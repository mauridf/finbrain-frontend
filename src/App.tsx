import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { DesignSystemPage } from '@/app/design-system/DesignSystemPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota temporária do Bloco 02 — será substituída no Bloco 04 */}
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="*" element={<Navigate to="/design-system" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}