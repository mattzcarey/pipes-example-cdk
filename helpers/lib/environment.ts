import { getStage } from './getStage';

const stage = getStage();

export enum Environment {
  Production = 'production',
  Staging = 'staging',
  Dev = 'development',
}

export const isProduction: () => boolean = () => {
  return stage === Environment.Production.toString();
};

export const isStaging = (): boolean => {
  return stage === Environment.Staging.toString();
};

export const isDev = (): boolean => {
  return stage === Environment.Dev.toString();
};
