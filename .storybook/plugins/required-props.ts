import ts from 'typescript';
import type { Plugin } from 'vite';

export interface RequiredPropsPluginOptions {
  /**
   * Путь до tsconfig, который используется для анализа компонентов.
   */
  tsconfigPath: string;

  /**
   * Обрабатывать только файлы внутри указанной директории.
   */
  include?: string;
}

/**
 * Исправляет `required` в Storybook docgen metadata.
 *
 * react-docgen-typescript может считать prop необязательным,
 * если у него есть default value в деструктуризации:
 *
 *   interface Props {
 *     size: Size;
 *   }
 *
 *   const Component = ({ size = 'm' }: Props) => ...
 *
 * Для TypeScript `size` остаётся обязательным, но docgen может
 * записать `required: false`.
 *
 * Плагин получает тип props непосредственно через TypeScript
 * TypeChecker и после выполнения react-docgen-typescript
 * восстанавливает правильное значение `required`.
 */
export function requiredPropsPlugin({ tsconfigPath, include }: RequiredPropsPluginOptions): Plugin {
  let program: ts.Program | undefined;
  let checker: ts.TypeChecker | undefined;

  const normalizePath = (path: string) => path.replaceAll('\\', '/');

  const normalizedInclude = include ? normalizePath(include) : undefined;

  /**
   * Создаём TypeScript Program один раз.
   */
  const getProgram = () => {
    if (program && checker) {
      return { program, checker };
    }

    const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

    if (configFile.error) {
      throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'));
    }

    const parsedConfig = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      tsconfigPath.replace(/[/\\][^/\\]+$/, ''),
    );

    program = ts.createProgram({
      rootNames: parsedConfig.fileNames,
      options: parsedConfig.options,
    });

    checker = program.getTypeChecker();

    return { program, checker };
  };

  /**
   * Определяем, экспортируется ли declaration.
   */
  const isExported = (node: ts.Node) =>
    Boolean(ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export);

  /**
   * Получаем тип props React-компонента.
   *
   * Работает в том числе с:
   *
   *   const Button = forwardRef<HTMLButtonElement, ButtonProps>(...)
   *
   * TypeScript видит Button как callable React-компонент.
   * Первый параметр call signature — его props.
   */
  const getComponentPropsType = (
    declaration: ts.VariableDeclaration,
    typeChecker: ts.TypeChecker,
  ): ts.Type | undefined => {
    if (!ts.isIdentifier(declaration.name)) {
      return undefined;
    }

    const componentType = typeChecker.getTypeAtLocation(declaration.name);

    const signatures = typeChecker.getSignaturesOfType(componentType, ts.SignatureKind.Call);

    const signature = signatures[0];

    if (!signature) {
      return undefined;
    }

    const [propsParameter] = signature.getParameters();

    if (!propsParameter) {
      return undefined;
    }

    const propsDeclaration = propsParameter.valueDeclaration ?? propsParameter.declarations?.[0];

    if (!propsDeclaration) {
      return undefined;
    }

    return typeChecker.getTypeOfSymbolAtLocation(propsParameter, propsDeclaration);
  };

  /**
   * Строим карту:
   *
   * {
   *   Button: {
   *     appearance: false,
   *     dimension: false,
   *     ...
   *   },
   *
   *   SomeInput: {
   *     value: true,
   *     dimension: true,
   *     disabled: false,
   *   }
   * }
   */
  const getRequiredProps = (sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker) => {
    const components: Record<string, Record<string, boolean>> = {};

    sourceFile.forEachChild((node) => {
      if (!ts.isVariableStatement(node) || !isExported(node)) {
        return;
      }

      for (const declaration of node.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) {
          continue;
        }

        const componentName = declaration.name.text;

        const propsType = getComponentPropsType(declaration, typeChecker);

        if (!propsType) {
          continue;
        }

        const properties = typeChecker.getPropertiesOfType(propsType);

        if (properties.length === 0) {
          continue;
        }

        const props: Record<string, boolean> = {};

        for (const property of properties) {
          /**
           * Optional symbol имеет SymbolFlags.Optional.
           *
           * interface Props {
           *   foo: string;   // false
           *   bar?: string;  // true
           * }
           */
          const optional = Boolean(property.flags & ts.SymbolFlags.Optional);

          props[property.getName()] = !optional;
        }

        components[componentName] = props;
      }
    });

    return components;
  };

  return {
    name: 'storybook-required-props',

    /**
     * Нам важно выполняться ПОСЛЕ стандартного
     * react-docgen-typescript transform.
     */
    enforce: 'post',

    transform(code, id) {
      const cleanId = normalizePath(id.split('?')[0]);

      if (!/\.[jt]sx$/.test(cleanId)) {
        return null;
      }

      if (cleanId.includes('.stories.') || cleanId.includes('/node_modules/')) {
        return null;
      }

      if (normalizedInclude && !cleanId.startsWith(normalizedInclude)) {
        return null;
      }

      const { program: tsProgram, checker: typeChecker } = getProgram();

      const sourceFile = tsProgram.getSourceFile(cleanId);

      if (!sourceFile) {
        return null;
      }

      const components = getRequiredProps(sourceFile, typeChecker);

      if (Object.keys(components).length === 0) {
        return null;
      }

      /**
       * react-docgen-typescript уже добавил примерно:
       *
       * Button.__docgenInfo = {
       *   props: {
       *     ...
       *   }
       * };
       *
       * Мы НЕ парсим и НЕ переписываем этот объект.
       *
       * Вместо этого добавляем маленький runtime patch
       * сразу после него.
       */
      const patches = Object.entries(components)
        .map(([componentName, props]) => {
          const propsJson = JSON.stringify(props);

          return `
if (
  typeof ${componentName} !== 'undefined' &&
  ${componentName}.__docgenInfo?.props
) {
  const __requiredProps = ${propsJson};

  for (const [__propName, __required] of Object.entries(__requiredProps)) {
    if (${componentName}.__docgenInfo.props[__propName]) {
      ${componentName}.__docgenInfo.props[__propName].required = __required;
    }
  }
}
`;
        })
        .join('\n');

      return {
        code: `${code}\n${patches}`,
        map: null,
      };
    },
  };
}
