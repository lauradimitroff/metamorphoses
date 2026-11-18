import type { Page } from '@playwright/test'

/**
 * Les tests vérifient l'interface et les règles, pas l'image. Sans carte graphique
 * (comme en CI), le rendu logiciel de la scène saturerait le navigateur : on la désactive,
 * ce qui vérifie au passage le repli sans WebGL.
 */
export function desactiverWebgl(page: Page) {
  return page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...reste: unknown[]) {
      if (type.includes('webgl')) return null
      return Reflect.apply(original, this, [type, ...reste])
    } as typeof HTMLCanvasElement.prototype.getContext
  })
}
