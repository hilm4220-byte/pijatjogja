import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SettingsProvider } from './contexts/SettingsContext.tsx'
import { FooterProvider } from './contexts/FooterContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SettingsProvider>
      <FooterProvider>
        <App />
      </FooterProvider>
    </SettingsProvider>
  </React.StrictMode>,
)