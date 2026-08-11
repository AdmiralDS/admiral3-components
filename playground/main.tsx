import { StrictMode, useState } from 'react';

import { themes, themeModes, type ThemeMode } from '@admiral-ds/admiral3-tokens';
import { FontsSourceCodePro, FontsVTBGroup } from '@admiral-ds/admiral3-tokens/fonts';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';

import { playgroundScenarios } from './scenarios';
import '@admiral-ds/admiral3-tokens/css';
import './styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Playground root container is missing');
}

const scenarioId = new URLSearchParams(window.location.search).get('scenario') ?? playgroundScenarios[0]?.id;
const scenario = playgroundScenarios.find((item) => item.id === scenarioId);
const cssThemeMode = (mode: ThemeMode) => mode.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const playgroundThemeStorageKey = 'admiral-playground-theme';
const isThemeMode = (value: string | null): value is ThemeMode => themeModes.includes(value as ThemeMode);

const getStoredThemeMode = (): ThemeMode => {
  try {
    const storedThemeMode = window.localStorage.getItem(playgroundThemeStorageKey);

    return isThemeMode(storedThemeMode) ? storedThemeMode : 'light';
  } catch {
    return 'light';
  }
};

const storeThemeMode = (mode: ThemeMode) => {
  try {
    window.localStorage.setItem(playgroundThemeStorageKey, mode);
  } catch {
    // Ignore storage errors so the playground still works in restricted browser contexts.
  }
};

if (!scenario) {
  throw new Error(`Unknown playground scenario: ${scenarioId}`);
}

document.title = `${scenario.title} | Admiral Internal Playground`;

export const PlaygroundApp = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredThemeMode);

  const handleThemeModeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    storeThemeMode(mode);
  };

  return (
    <ThemeProvider theme={themes[themeMode]}>
      <main className="playground-shell" data-admiral-theme={cssThemeMode(themeMode)}>
        <header className="playground-header">
          <h1 className="playground-page-title">Internal E2E Playground</h1>
          <div className="playground-header-controls">
            <label className="playground-theme-label" htmlFor="playground-theme">
              Theme
            </label>
            <select
              className="playground-theme-select"
              id="playground-theme"
              onChange={(event) => handleThemeModeChange(event.target.value as ThemeMode)}
              value={themeMode}
            >
              {themeModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
            <button className="playground-toggle" onClick={() => setIsSidebarOpen((value) => !value)} type="button">
              {isSidebarOpen ? 'Hide menu' : 'Show menu'}
            </button>
          </div>
        </header>
        <section className={`playground-layout${isSidebarOpen ? '' : ' playground-layout_sidebar-hidden'}`}>
          {isSidebarOpen ? (
            <aside className="playground-sidebar">
              <nav aria-label="Playground scenarios" className="playground-nav">
                {playgroundScenarios.map((item) => {
                  const isActive = item.id === scenario.id;

                  return (
                    <a
                      key={item.id}
                      aria-current={isActive ? 'page' : undefined}
                      className={`playground-nav-link${isActive ? ' playground-nav-link_active' : ''}`}
                      data-visual={item.visual ? '' : undefined}
                      href={`/?scenario=${encodeURIComponent(item.id)}`}
                      title={item.title}
                    >
                      {item.title}
                    </a>
                  );
                })}
              </nav>
            </aside>
          ) : null}
          <section className="playground-content">
            <div>
              {scenario.title} ({scenario.id})
            </div>
            <div className="playground-preview">{scenario.render()}</div>
          </section>
        </section>
      </main>
    </ThemeProvider>
  );
};

createRoot(rootElement).render(
  <StrictMode>
    <FontsVTBGroup />
    <FontsSourceCodePro />
    <PlaygroundApp />
  </StrictMode>,
);
