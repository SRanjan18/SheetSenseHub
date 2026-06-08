import runtimeConfig from './environments.json';

const withoutTrailingSlash = (value) => value.replace(/\/+$/, '');

const getCurrentHostname = () =>
  typeof window === 'undefined' ? '' : window.location.hostname;

const getDefaultEnvironment = () => 'local';

const getEnvironmentName = (runtimeConfig, hostname = getCurrentHostname()) =>
  runtimeConfig.environmentByHostname?.[hostname] ??
  runtimeConfig.defaultEnvironment ??
  getDefaultEnvironment(hostname);

const assertRequired = (fieldName, value) => {
  if (!value?.trim()) {
    throw new Error(`Missing required runtime config field: ${fieldName}`);
  }

  return value;
};

const buildEnvironmentConfig = (environment, environmentConfig) => {
  const appName = assertRequired('appName', environmentConfig.appName);
  const apiBaseUrl = withoutTrailingSlash(
    assertRequired('apiBaseUrl', environmentConfig.apiBaseUrl)
  );
  const googleAuthUrl = assertRequired('googleAuthUrl', environmentConfig.googleAuthUrl);
  const googleClientId = assertRequired('googleClientId', environmentConfig.googleClientId);

  return Object.freeze({
    appName,
    environment,
    apiBaseUrl,
    googleAuthUrl,
    googleClientId,
    isProduction: environment === 'prod',
  });
};

const environment = getEnvironmentName(runtimeConfig);
const environmentConfig = runtimeConfig.environments?.[environment];

if (!environmentConfig) {
  throw new Error(`Unknown runtime environment: ${environment}`);
}

const config = buildEnvironmentConfig(environment, environmentConfig);

console.info(
  `[${config.appName}] running ${config.environment} environment against ${config.apiBaseUrl}`
);

export default config;
