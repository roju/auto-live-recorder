import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
// import App from './App.tsx'
import Settings from './Settings.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>

  <HashRouter basename={"/"}>
    <Routes>
      <Route path="/" element={<Settings />} />
      {/* <Route path="/settings" element={<Settings />} /> */}
    </Routes>
  </HashRouter>
  </React.StrictMode>,
)
