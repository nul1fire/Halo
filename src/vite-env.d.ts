/// <reference types="vite/client" />

import type { MediaPayload } from './types/media'

declare global {
  interface Window {
    halo: {
      onMediaUpdate: (callback: (data: MediaPayload | null) => void) => void
      onClipboardUpdate: (callback: (text: string) => void) => void
      onSystemStats: (callback: (data: { cpu: number; ram: number }) => void) => void
      toggleClickThrough: (ignore: boolean) => void
      controlMedia: (command: 'play' | 'pause' | 'next' | 'prev') => void
      quitApp: () => void
    }
  }

  interface Navigator {
    getBattery?: () => Promise<BatteryManager>
  }

  interface BatteryManager extends EventTarget {
    charging: boolean
    level: number
  }
}

export {}
