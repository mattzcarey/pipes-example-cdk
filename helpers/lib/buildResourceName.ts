import { getStage } from './getStage';

export const buildResourceName = (baseName: string): string =>
  `${getStage()}-${baseName}`;
