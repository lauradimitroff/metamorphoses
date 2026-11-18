import type { Composition } from '../domaine/types'

/** La composition présentée dans la vitrine : celle de l'accueil, et le point de départ des essais. */
export const COMPOSITION_VITRINE: Composition = {
  matiere: 'verre-clair',
  gravure: null,
  elements: [
    { uid: 'vitrine-fougere', elementId: 'fougere', x: -180, z: -120, rotation: 3 },
    { uid: 'vitrine-amethyste', elementId: 'amethyste', x: 150, z: -200, rotation: 0 },
    { uid: 'vitrine-champignons', elementId: 'champignons-luminescents', x: 230, z: 130, rotation: 5 },
    { uid: 'vitrine-mousse-1', elementId: 'mousse', x: -40, z: 130, rotation: 0 },
    { uid: 'vitrine-mousse-2', elementId: 'mousse', x: -300, z: 170, rotation: 8 },
    { uid: 'vitrine-mousse-3', elementId: 'mousse', x: 380, z: -70, rotation: 15 },
    { uid: 'vitrine-galets-1', elementId: 'galets', x: 60, z: 340, rotation: 2 },
    { uid: 'vitrine-galets-2', elementId: 'galets', x: -60, z: -370, rotation: 11 },
  ],
}
