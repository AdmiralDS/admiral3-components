import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type InputEvent,
  type PointerEvent,
} from 'react';

import { InputSliderRangeFields, StyledInputSliderRange } from './style';
import type { InputSliderRangeProps, InputSliderRangeValue } from './types';
import { refSetter } from '../../utils/refSetter';
import { FormItemContext } from '../_internal/FormItemContext';
import { normalizeSliderValue } from '../_internal/SliderAtoms';
import { Input } from '../Input';
import { SliderRange } from '../SliderRange';

type Bound = 0 | 1;
type Draft = { value: string; text: string } | null;

const parseNumber = (text: string) => {
  if (text.trim() === '') return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
};

/** Числовой интервал с двумя форматируемыми полями и слайдером. */
export const InputSliderRange = forwardRef<HTMLDivElement, InputSliderRangeProps>(
  (
    {
      dimension: dimensionProp = 'm',
      disabled: disabledProp = false,
      readOnly: readOnlyProp = false,
      status,
      required,
      min: minProp = 0,
      max: maxProp = 100,
      step: stepProp = 1,
      minValueDistance: minValueDistanceProp,
      value,
      defaultValue,
      onValueChange,
      lowerName,
      upperName,
      form,
      formatValue = String,
      parseValue = parseNumber,
      lowerInputProps = {},
      upperInputProps = {},
      sliderProps,
      lowerNativeInputRef,
      upperNativeInputRef,
      lowerNativeSliderRef,
      upperNativeSliderRef,
      ...props
    },
    ref,
  ) => {
    const formItem = useContext(FormItemContext);
    const dimension = formItem?.dimension ?? dimensionProp;
    const disabled = formItem?.disabled ?? disabledProp;
    const readOnly = formItem?.readOnly ?? readOnlyProp;
    const lowerRef = useRef<HTMLInputElement>(null);
    const upperRef = useRef<HTMLInputElement>(null);
    const mergedLowerRef = useMemo(() => refSetter(lowerRef, lowerNativeInputRef), [lowerNativeInputRef]);
    const mergedUpperRef = useMemo(() => refSetter(upperRef, upperNativeInputRef), [upperNativeInputRef]);
    const lowerSliderRef = useRef<HTMLInputElement>(null);
    const upperSliderRef = useRef<HTMLInputElement>(null);
    const mergedLowerSliderRef = useCallback(
      (input: HTMLInputElement | null) => refSetter(lowerSliderRef, lowerNativeSliderRef)(input),
      [lowerNativeSliderRef],
    );
    const mergedUpperSliderRef = useCallback(
      (input: HTMLInputElement | null) => refSetter(upperSliderRef, upperNativeSliderRef)(input),
      [upperNativeSliderRef],
    );

    // Управляет проверками при рендере; ref хранит физический input, который сохраняется при обмене ролями.
    const [isDragging, setIsDragging] = useState(false);
    const dragging = useRef<HTMLInputElement | null>(null);

    const min = Number.isFinite(minProp) ? minProp : 0;
    const max = Number.isFinite(maxProp) ? Math.max(min, maxProp) : min;
    const step = Number.isFinite(stepProp) && stepProp > 0 ? stepProp : 1;
    // По умолчанию зазор равен step, явный 0 разрешает совпадение. Ограничиваем зазор доступной сеткой слайдера.
    const requestedDistance =
      minValueDistanceProp === undefined || !Number.isFinite(minValueDistanceProp)
        ? step
        : Math.max(0, minValueDistanceProp);
    const minValueDistance = Number(
      Math.min(normalizeSliderValue(max, min, max, step) - min, requestedDistance).toPrecision(15),
    );
    const resetLower = defaultValue?.[0] ?? String(min);
    const resetUpper = defaultValue?.[1] ?? String(max);
    const [internalValue, setInternalValue] = useState<InputSliderRangeValue>([resetLower, resetUpper]);
    const currentValue = value === undefined ? internalValue : value;
    const numbers: [number | null, number | null] = [parseNumber(currentValue[0]), parseNumber(currentValue[1])];

    // У каждого редактора свой промежуточный текст. Внешнее значение имеет приоритет.
    const [drafts, setDrafts] = useState<[Draft, Draft]>([null, null]);
    const lowerDraft = !readOnly && drafts[0]?.value === currentValue[0] ? drafts[0] : null;
    const upperDraft = !readOnly && drafts[1]?.value === currentValue[1] ? drafts[1] : null;
    if (lowerDraft !== drafts[0] || upperDraft !== drafts[1]) setDrafts([lowerDraft, upperDraft]);
    const getText = (bound: Bound, draft: Draft) => {
      const number = numbers[bound];
      return draft ? draft.text : number === null ? currentValue[bound] : formatValue(number);
    };
    const texts = [getText(0, lowerDraft), getText(1, upperDraft)];

    // Во время drag временно разрешаем сближение. При отпускании distance передаётся явно,
    // чтобы проверить окончательный зазор ещё до рендера с isDragging=false.
    const getNumberError = (
      number: number | null,
      bound: Bound,
      source: InputSliderRangeValue,
      distance = isDragging ? 0 : minValueDistance,
    ) => {
      if (number === null || !Number.isFinite(number)) return 'Введите число.';
      if (number < min || number > max) return `Введите число от ${min} до ${max}.`;
      const other = parseNumber(source[bound === 0 ? 1 : 0]);
      if (other !== null && (bound === 0 ? number > other : number < other)) {
        return bound === 0
          ? 'Нижняя граница не должна превышать верхнюю.'
          : 'Верхняя граница не должна быть ниже нижней.';
      }
      // Убираем погрешность дробной арифметики, чтобы допустимый зазор не считался слишком маленьким.
      if (other !== null && Number(Math.abs(other - number).toPrecision(15)) < distance) {
        return `Минимальное расстояние между границами — ${minValueDistance}.`;
      }
      return '';
    };
    const getValidationMessage = (
      text: string,
      bound: Bound,
      source: InputSliderRangeValue,
      distance = isDragging ? 0 : minValueDistance,
    ) => {
      const parsed = text.trim() === '' ? null : parseValue(text);
      const number = parseNumber(source[bound]);
      const error =
        (text === '' ? '' : getNumberError(parsed, bound, source, distance)) ||
        (source[bound] === '' ? '' : getNumberError(number, bound, source, distance));
      // Изменение соседа не должно незаметно разрешать отправку прежнего числа вместо текста редактора.
      const draft = bound === 0 ? lowerDraft : upperDraft;
      return error || (draft && parsed !== number ? 'Завершите ввод числа.' : '');
    };
    const errors = [getValidationMessage(texts[0], 0, currentValue), getValidationMessage(texts[1], 1, currentValue)];

    // Очистка поля сохраняет последнюю позицию его ползунка.
    const [lastSliderValue, setLastSliderValue] = useState<[number, number]>([numbers[0] ?? min, numbers[1] ?? max]);
    const [swappedPreview, setSwappedPreview] = useState<{
      value: InputSliderRangeValue;
      positions: [number, number];
    } | null>(null);
    if (
      (numbers[0] !== null && numbers[0] !== lastSliderValue[0]) ||
      (numbers[1] !== null && numbers[1] !== lastSliderValue[1])
    ) {
      setLastSliderValue([numbers[0] ?? lastSliderValue[0], numbers[1] ?? lastSliderValue[1]]);
    }
    if (swappedPreview) {
      setSwappedPreview(null);
      if (swappedPreview.value[0] === currentValue[0] && swappedPreview.value[1] === currentValue[1]) {
        setLastSliderValue(swappedPreview.positions);
      }
    }
    const lower = normalizeSliderValue(numbers[0] ?? Math.min(lastSliderValue[0], numbers[1] ?? max), min, max, step);
    const upper = Math.max(lower, normalizeSliderValue(numbers[1] ?? lastSliderValue[1], min, max, step));

    useLayoutEffect(() => {
      lowerRef.current?.setCustomValidity(errors[0]);
      upperRef.current?.setCustomValidity(errors[1]);
    });

    // Проверяем текущий текст обоих полей относительно новой пары source: границы зависят друг от друга.
    // setCustomValidity получает текст ошибки или '' для её снятия и участвует в нативной проверке формы.
    const syncValidity = (source: InputSliderRangeValue, distance: number) => {
      if (lowerRef.current)
        lowerRef.current.setCustomValidity(getValidationMessage(lowerRef.current.value, 0, source, distance));
      if (upperRef.current)
        upperRef.current.setCustomValidity(getValidationMessage(upperRef.current.value, 1, source, distance));
    };

    const commitValue = (
      next: [string, string],
      nextTexts: [string | null, string | null],
      distance = isDragging ? 0 : minValueDistance,
    ) => {
      if (nextTexts[0] !== null && lowerRef.current) lowerRef.current.value = nextTexts[0];
      if (nextTexts[1] !== null && upperRef.current) upperRef.current.value = nextTexts[1];
      // Обновляем валидность до onValueChange, где потребитель уже может вызвать form.checkValidity().
      // useLayoutEffect синхронизирует её после рендера, в том числе при изменении внешних props.
      syncValidity(next, distance);
      setDrafts([
        nextTexts[0] === null ? lowerDraft : { value: next[0], text: nextTexts[0] },
        nextTexts[1] === null ? upperDraft : { value: next[1], text: nextTexts[1] },
      ]);
      if (value === undefined) setInternalValue(next);
      if (next[0] !== currentValue[0] || next[1] !== currentValue[1]) onValueChange?.(next);
    };

    const commitBound = (bound: Bound, number: number | null, text: string) => {
      const next: [string, string] = [currentValue[0], currentValue[1]];
      next[bound] = number === null ? '' : String(number);
      commitValue(next, bound === 0 ? [text, null] : [null, text]);
    };

    const handleInput = (bound: Bound, event: InputEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      if (disabled || readOnly || input.matches(':disabled')) return;
      const text = input.value;
      const number = text.trim() === '' ? null : parseValue(text);
      const error = text === '' ? '' : getNumberError(number, bound, currentValue);
      input.setCustomValidity(error);
      if (!error) {
        commitBound(bound, number, text);
      } else {
        setDrafts(
          bound === 0 ? [{ value: currentValue[0], text }, upperDraft] : [lowerDraft, { value: currentValue[1], text }],
        );
      }
      (bound === 0 ? lowerInputProps : upperInputProps).onInput?.(event);
    };
    const handleLowerInput = (event: InputEvent<HTMLInputElement>) => handleInput(0, event);
    const handleUpperInput = (event: InputEvent<HTMLInputElement>) => handleInput(1, event);

    const handleSliderChange = (next: [number, number]) => {
      if (disabled || readOnly || !lowerRef.current || lowerRef.current.matches(':disabled')) return;
      const lowerChanged = next[0] !== lower;
      const upperChanged = next[1] !== upper;
      const distance = dragging.current ? 0 : minValueDistance;
      if (lowerChanged && upperChanged) {
        // При обмене ползунков переносим исходное значение и текст неподвижной границы вместе с её ролью.
        // Это сохраняет пустоту, промежуточный текст и точность, которую не отображает шаг SliderRange.
        const lowerCrossed = next[1] > upper;
        const nextValue: [string, string] = lowerCrossed
          ? [currentValue[1], String(next[1])]
          : [String(next[0]), currentValue[0]];
        // Переносим сохранённую позицию пустой границы только если владелец примет новую пару.
        if (currentValue[lowerCrossed ? 1 : 0] === '') setSwappedPreview({ value: nextValue, positions: next });
        commitValue(
          nextValue,
          lowerCrossed ? [texts[1], formatValue(next[1])] : [formatValue(next[0]), texts[0]],
          distance,
        );
        return;
      }
      // Учитываем исходное число соседа: его позиция на слайдере могла округлиться по step.
      // Пустой сосед не ограничивает значение поля; вне drag сразу соблюдаем минимальный зазор.
      const lowerLimit = numbers[1] === null ? max : Number((numbers[1] - distance).toPrecision(15));
      const upperLimit = numbers[0] === null ? min : Number((numbers[0] + distance).toPrecision(15));
      const nextLower = Math.max(min, Math.min(next[0], lowerLimit));
      const nextUpper = Math.min(max, Math.max(next[1], upperLimit));
      commitValue(
        [lowerChanged ? String(nextLower) : currentValue[0], upperChanged ? String(nextUpper) : currentValue[1]],
        [lowerChanged ? formatValue(nextLower) : null, upperChanged ? formatValue(nextUpper) : null],
        distance,
      );
    };

    const handleInputBlur = (bound: Bound, event: FocusEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const number = input.value.trim() === '' ? null : parseValue(input.value);
      if (!disabled && !readOnly && !input.matches(':disabled') && number !== null && Number.isFinite(number)) {
        const other = numbers[bound === 0 ? 1 : 0];
        // На blur ограничиваем число соседней границей с зазором и min/max, сохраняя точность ручного ввода.
        // Пустое или нечисловое поле сюда не попадает и сохраняет свой текст.
        const limit =
          other === null
            ? bound === 0
              ? max
              : min
            : Math.min(
                max,
                Math.max(min, Number((other + (bound === 0 ? -minValueDistance : minValueDistance)).toPrecision(15))),
              );
        const next = bound === 0 ? Math.min(limit, Math.max(min, number)) : Math.max(limit, Math.min(max, number));
        if (next !== number || String(next) !== currentValue[bound]) commitBound(bound, next, formatValue(next));
      }
      (bound === 0 ? lowerInputProps : upperInputProps).onBlur?.(event);
    };
    const handleLowerBlur = (event: FocusEvent<HTMLInputElement>) => handleInputBlur(0, event);
    const handleUpperBlur = (event: FocusEvent<HTMLInputElement>) => handleInputBlur(1, event);

    const handleSliderPointerDown = (event: PointerEvent<HTMLDivElement>) => {
      sliderProps?.onPointerDown?.(event);
      if (disabled || readOnly || event.defaultPrevented || !event.isPrimary || event.button !== 0) return;
      // Начало drag отслеживаем только на нативном ползунке: нажатие по дорожке меняет значение однократно.
      // Сравнение элементов вместо instanceof работает и при рендеринге в iframe с другим конструктором input.
      const input = [lowerSliderRef.current, upperSliderRef.current].find(
        (input) => input !== null && input === event.target,
      );
      if (input && !input.matches(':disabled')) {
        dragging.current = input;
        setIsDragging(true);
      }
    };

    // Временный зазор меньше minValueDistance допустим до завершения нативного жеста.
    // Документ ловит отпускание вне компонента; переподписка после рендера даёт finish актуальную пару значений.
    useEffect(() => {
      if (!isDragging) return;
      const ownerDocument = lowerRef.current?.ownerDocument;
      const finish = () => {
        const input = dragging.current;
        dragging.current = null;
        setIsDragging(false);
        if (!input || disabled || readOnly || input.matches(':disabled')) return;
        const [lowerNumber, upperNumber] = numbers;
        // Пустоту не заменяем числом ради зазора и не меняем сохранённую позицию пустого ползунка.
        if (lowerNumber === null || upperNumber === null) return;
        if (Number((upperNumber - lowerNumber).toPrecision(15)) >= minValueDistance) return;
        // Проверяем исходные числа: позиции SliderRange могут быть округлены относительно соседнего поля.
        // data-bound отражает текущую роль input, в том числе после пересечения в этом же жесте.
        const bound = input.dataset.bound === 'lower' ? 0 : 1;
        // Округляем по сетке от min в сторону от соседа: lower влево, upper вправо.
        // Округление к ближайшему шагу могло бы снова уменьшить зазор ниже допустимого.
        const roundBound = (number: number, targetBound: Bound) => {
          const steps = Number(((number - min) / step).toPrecision(15));
          return normalizeSliderValue(
            min + (targetBound === 0 ? Math.floor(steps) : Math.ceil(steps)) * step,
            min,
            max,
            step,
          );
        };
        const nextNumbers: [number, number] = [lowerNumber, upperNumber];
        nextNumbers[bound] = roundBound(
          bound === 0 ? upperNumber - minValueDistance : lowerNumber + minValueDistance,
          bound,
        );
        const otherBound = bound === 0 ? 1 : 0;
        // У края активному ползунку может не хватить места: используем доступное движение и сдвигаем соседа.
        if (Number((nextNumbers[1] - nextNumbers[0]).toPrecision(15)) < minValueDistance) {
          nextNumbers[otherBound] = roundBound(
            nextNumbers[bound] + (bound === 0 ? minValueDistance : -minValueDistance),
            otherBound,
          );
        }
        // Обычно обновляется только активная граница. Текст соседа меняем лишь при его фактическом сдвиге.
        const nextValue: [string, string] = [currentValue[0], currentValue[1]];
        const nextTexts: [string | null, string | null] = [null, null];
        nextValue[bound] = String(nextNumbers[bound]);
        nextTexts[bound] = formatValue(nextNumbers[bound]);
        if (nextNumbers[otherBound] !== numbers[otherBound]) {
          nextValue[otherBound] = String(nextNumbers[otherBound]);
          nextTexts[otherBound] = formatValue(nextNumbers[otherBound]);
        }
        commitValue(nextValue, nextTexts, minValueDistance);
      };
      // Завершаем фазу до всплытия pointerup; коррекция здесь учитывает точность исходной пары.
      ownerDocument?.addEventListener('pointerup', finish, true);
      ownerDocument?.addEventListener('pointercancel', finish, true);
      return () => {
        ownerDocument?.removeEventListener('pointerup', finish, true);
        ownerDocument?.removeEventListener('pointercancel', finish, true);
      };
    });

    // Пересоздание пары value не должно отменять отложенную очистку текста при reset.
    const isControlled = value !== undefined;
    useEffect(() => {
      const nativeForm = lowerRef.current?.form;
      if (!nativeForm) return;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const reset = (event: Event) => {
        timer = setTimeout(() => {
          if (event.defaultPrevented) return;
          setDrafts([null, null]);
          if (!isControlled) setInternalValue([resetLower, resetUpper]);
        });
      };
      nativeForm.addEventListener('reset', reset);
      return () => {
        nativeForm.removeEventListener('reset', reset);
        clearTimeout(timer);
      };
    }, [isControlled, resetLower, resetUpper, form]);

    return (
      <StyledInputSliderRange ref={ref} {...props}>
        <InputSliderRangeFields>
          <Input
            {...lowerInputProps}
            ref={mergedLowerRef}
            type="text"
            name={undefined}
            form={form}
            dimension={dimension}
            disabled={disabled}
            readOnly={readOnly}
            status={status}
            required={required}
            value={texts[0]}
            aria-invalid={!!errors[0] || lowerInputProps['aria-invalid'] || undefined}
            onInput={handleLowerInput}
            onBlur={handleLowerBlur}
          />
          <Input
            {...upperInputProps}
            ref={mergedUpperRef}
            type="text"
            name={undefined}
            form={form}
            dimension={dimension}
            disabled={disabled}
            readOnly={readOnly}
            status={status}
            required={required}
            value={texts[1]}
            aria-invalid={!!errors[1] || upperInputProps['aria-invalid'] || undefined}
            onInput={handleUpperInput}
            onBlur={handleUpperBlur}
          />
        </InputSliderRangeFields>
        <input
          type="hidden"
          name={lowerName}
          form={form}
          disabled={disabled}
          value={errors[0] ? '' : currentValue[0]}
        />
        <input
          type="hidden"
          name={upperName}
          form={form}
          disabled={disabled}
          value={errors[1] ? '' : currentValue[1]}
        />
        {!readOnly && (
          <SliderRange
            showTooltip
            {...sliderProps}
            dimension={dimension === 'l' ? 'm' : dimension}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            // На время drag отключаем коррекцию в SliderRange: композиция выполнит её по исходным числам.
            minValueDistance={isDragging ? 0 : minValueDistance}
            value={[lower, upper]}
            onChange={handleSliderChange}
            onPointerDown={handleSliderPointerDown}
            lowerNativeSliderRef={mergedLowerSliderRef}
            upperNativeSliderRef={mergedUpperSliderRef}
            lowerNativeSliderProps={{
              'aria-label': lowerInputProps['aria-label'] ?? 'Нижняя граница',
              'aria-labelledby': lowerInputProps['aria-labelledby'],
              'aria-describedby': lowerInputProps['aria-describedby'],
              ...sliderProps?.lowerNativeSliderProps,
              name: undefined,
              form,
            }}
            upperNativeSliderProps={{
              'aria-label': upperInputProps['aria-label'] ?? 'Верхняя граница',
              'aria-labelledby': upperInputProps['aria-labelledby'],
              'aria-describedby': upperInputProps['aria-describedby'],
              ...sliderProps?.upperNativeSliderProps,
              name: undefined,
              form,
            }}
          />
        )}
      </StyledInputSliderRange>
    );
  },
);

InputSliderRange.displayName = 'InputSliderRange';
