import { BrowserRouter } from 'react-router-dom'

import { RouterEffects } from 'shared/lib/router-effects'

import { Router } from './router'
import './styles'

function App() {
  return (
    <BrowserRouter>
      <RouterEffects>
        <Router />
      </RouterEffects>
    </BrowserRouter>
  )
}

export default App
