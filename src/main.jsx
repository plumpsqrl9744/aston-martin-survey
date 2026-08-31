import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import QR from './QR.jsx'

const base = import.meta.env.BASE_URL

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={base}>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/qr" element={<QR />} />
    </Routes>
  </BrowserRouter>
)
