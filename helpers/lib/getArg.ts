import yargs from 'yargs';

const argv = yargs(process.argv).argv as Record<string, unknown>;

const isNonEmptyString = (arg: unknown): arg is string =>
  typeof arg === 'string' && arg !== '';

const getArg = ({
  cliArg,
  processEnvName,
  defaultValue,
}: {
  cliArg: string;
  processEnvName: string;
  defaultValue?: string;
}): string => {
  let arg = argv[cliArg];

  if (isNonEmptyString(arg)) {
    return arg;
  }

  const cdkContext = getCdkContext();

  if (cdkContext != null) {
    arg = cdkContext[cliArg];
  }

  if (isNonEmptyString(arg)) {
    return arg;
  }

  arg = process.env[processEnvName];

  if (isNonEmptyString(arg)) {
    return arg;
  }

  if (defaultValue == null) {
    throw new Error(
      `--${cliArg} CLI argument or ${processEnvName} env var required.`,
    );
  }

  return defaultValue;
};

const getCdkContext = (): Record<string, unknown> | undefined => {
  const cdkContextEnv = process.env.CDK_CONTEXT_JSON;

  return cdkContextEnv != null
    ? <Record<string, unknown>>JSON.parse(cdkContextEnv)
    : undefined;
};

export default getArg;
