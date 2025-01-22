import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TurboEdgeProviderV0, Explorer } from '@turbo-ing/edge-v0'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TurboEdgeProviderV0 gameId='turbo-chat' daProxy='http://localhost:3000'>
    <Explorer />
      <App />
    </TurboEdgeProviderV0>
  </StrictMode>,
)
