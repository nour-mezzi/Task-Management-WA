import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import LoginPage from './Login.tsx'
import SignUpPage from './signup.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoginPage/>
    <SignUpPage/>
  </StrictMode>,
)
