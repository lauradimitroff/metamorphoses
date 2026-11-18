import type { ReactNode } from 'react'
import type { ElementId } from '../../domaine/types'

/** Petites gravures au trait, dessinées à la main pour le catalogue. */
const DESSINS: Readonly<Record<ElementId, ReactNode>> = {
  mousse: (
    <>
      <path d="M7 36c-4-6 1-12 7-10 1-6 9-9 13-4 5-3 12 0 12 6 4 1 5 6 2 8H7Z" />
      <path d="M14 31c1-2 3-3 5-2M24 27c2-2 5-2 6 0M31 33c1-1 3-2 4-1M19 35c1-1 3-1 4 0" />
    </>
  ),
  fougere: (
    <>
      <path d="M17 43C21 31 25 18 34 6" />
      <path d="M20 35l-8-3M21.500 31l8 1M23 26l-9-5M25 23l8-1M27 18l-8-6M29 15l7 0M31 11l-5-5" />
    </>
  ),
  galets: (
    <>
      <path d="M6 33c0-6 7-10 14-9s11 5 10 10-7 6-13 6-11-2-11-7Z" />
      <path d="M26 24c1-4 6-7 11-5s6 6 4 10-6 5-11 4" />
      <path d="M31 39c1-3 5-5 8-3s3 5 0 6-6 0-8-3ZM11 31c3-2 7-3 11-1" />
    </>
  ),
  amethyste: (
    <>
      <path d="M24 5l6 8v25H18V13l6-8ZM18 13h12M24 5v33" />
      <path d="M18 25l-6-4-4 5 3 12h7M30 22l6-3 4 5-3 14h-7M12 21v17M36 19v19" />
      <path d="M5 38c6 4 32 4 38 0" />
    </>
  ),
  'champignons-luminescents': (
    <>
      <path d="M8 23C9 13 15 8 21 8s12 5 13 15c-8 3-18 3-26 0Z" />
      <path d="M18 26c0 6-1 11-2 16h9c-1-5-2-10-2-16" />
      <path d="M31 30c1-4 4-6 7-6s6 2 6 6c-4 2-9 2-13 0ZM36 32c0 3 0 7-1 10h5c-1-3-1-7-1-10" />
    </>
  ),
}

export function VignetteElement({ elementId, className }: { elementId: ElementId; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {DESSINS[elementId]}
    </svg>
  )
}
