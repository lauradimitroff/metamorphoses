import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

// Polices hébergées dans le projet : aucun appel à un serveur tiers.
// Seuls les alphabets latin et latin étendu (pour « œ ») sont inclus.
import '@fontsource/cormorant-garamond/latin-400.css'
import '@fontsource/cormorant-garamond/latin-ext-400.css'
import '@fontsource/cormorant-garamond/latin-400-italic.css'
import '@fontsource/cormorant-garamond/latin-ext-400-italic.css'
import '@fontsource/cormorant-garamond/latin-500.css'
import '@fontsource/cormorant-garamond/latin-ext-500.css'
import '@fontsource/alegreya-sans/latin-400.css'
import '@fontsource/alegreya-sans/latin-ext-400.css'
import '@fontsource/alegreya-sans/latin-400-italic.css'
import '@fontsource/alegreya-sans/latin-ext-400-italic.css'
import '@fontsource/alegreya-sans/latin-500.css'
import '@fontsource/alegreya-sans/latin-ext-500.css'
import '@fontsource/pinyon-script/latin-400.css'
import '@fontsource/pinyon-script/latin-ext-400.css'

import './styles/jetons.css'
import './styles/base.css'
import App from './App'
import { prechargerFichiersScene, surveillerIntentionDeComposer } from './interface/prechargement'

// L'accueil et l'atelier montrent la scène : ses fichiers partent tout de suite, en même temps que le code.
if (window.location.pathname === '/' || window.location.pathname === '/composer') prechargerFichiersScene()
// Ailleurs, l'atelier se prépare dès qu'on survole, touche ou atteint au clavier un lien « Composer ».
surveillerIntentionDeComposer()

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
