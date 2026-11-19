import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { MiseEnPage } from './interface/MiseEnPage'

// Chaque page est un fichier JavaScript séparé, chargé seulement quand on la visite.
// Three.js n'est ainsi téléchargé que par les pages qui affichent de la 3D.
const Accueil = lazy(() => import('./pages/Accueil'))
const Composer = lazy(() => import('./pages/Composer'))
const APropos = lazy(() => import('./pages/APropos'))
const Contact = lazy(() => import('./pages/Contact'))
const Registre = lazy(() => import('./pages/Registre'))
const Panier = lazy(() => import('./pages/Panier'))
const Introuvable = lazy(() => import('./pages/Introuvable'))

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<MiseEnPage />}>
          <Route index element={<Accueil />} />
          <Route path="composer" element={<Composer />} />
          <Route path="a-propos" element={<APropos />} />
          <Route path="contact" element={<Contact />} />
          <Route path="credits" element={<Registre />} />
          <Route path="panier" element={<Panier />} />
          <Route path="*" element={<Introuvable />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
