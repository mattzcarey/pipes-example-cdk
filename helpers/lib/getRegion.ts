import getArg from './getArg';

export const getRegion = (): string =>
  getArg({
    cliArg: 'region',
    processEnvName: 'REGION',
  });
