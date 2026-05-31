export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  GENERATING_IMAGES = 'GENERATING_IMAGES',
  EDITING = 'EDITING',
  GENERATED = 'GENERATED',
}

export enum AppMode {
  NORMAL = 'NORMAL',
  GOW = 'GOW',
}

export type GowFeature = 'WEBSITE';