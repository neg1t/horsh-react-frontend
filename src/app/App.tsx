import { BrowserRouter } from 'react-router-dom'

import { ThemeProvider } from 'shared/components/ThemeProvider'
import { RouterEffects } from 'shared/lib/router-effects'

import { Router } from './router'
import './styles'

function App() {
  return (
    <ThemeProvider defaultTheme='dark'>
      <BrowserRouter>
        <RouterEffects>
          <Router />
        </RouterEffects>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
