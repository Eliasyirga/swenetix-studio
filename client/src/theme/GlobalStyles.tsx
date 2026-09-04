import React from 'react';
import { Global, css } from '@emotion/react';
import { AppTheme } from './theme';

export const GlobalStyles: React.FC = () => (
  <Global
    styles={(theme: AppTheme) => css`
      *, *::before, *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html, body {
        background-color: ${theme.colors.background};
        color: ${theme.colors.text};
        font-family: ${theme.fonts.body};
        font-size: 14px;
        line-height: ${theme.lineHeights.normal};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
        min-height: 100vh;
      }

      h1, h2, h3, h4, h5, h6 {
        font-family: ${theme.fonts.heading};
        font-weight: ${theme.fontWeights.semibold};
        letter-spacing: -0.01em;
        color: ${theme.colors.text};
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      button, input, select, textarea {
        font-family: inherit;
      }

      /* Clean minimalist scrollbar */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      ::-webkit-scrollbar-track {
        background: ${theme.colors.background};
      }

      ::-webkit-scrollbar-thumb {
        background: ${theme.colors.surfaceBorder};
        border-radius: 3px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: ${theme.colors.textMuted};
      }
    `}
  />
);
