const logLevel = {
  error: { can: ['error', 'warn', 'info', 'debug', 'trace',].includes(process.env['REACT_APP_LOG_LEVEL'] ?? ''), func: (value: any) => console.error(value) },
  warn: { can: ['warn', 'info', 'debug', 'trace',].includes(process.env['REACT_APP_LOG_LEVEL'] ?? ''), func: (value: any) => console.warn(value) },
  info: { can: ['info', 'debug', 'trace',].includes(process.env['REACT_APP_LOG_LEVEL'] ?? ''), func: (value: any) => console.info(value) },
  debug: { can: ['debug', 'trace',].includes(process.env['REACT_APP_LOG_LEVEL'] ?? ''), func: (value: any) => console.log(value) },
  trace: { can: ['trace',].includes(process.env['REACT_APP_LOG_LEVEL'] ?? ''), func: (value: any) => console.trace(value) },
};
const createLogFunction = (key: keyof typeof logLevel) => (value: any) => logLevel[key].can && logLevel[key].func(value);
console.log({ logLevel });

export const logger = {
  error: createLogFunction('error'),
  warn: createLogFunction('warn'),
  info: createLogFunction('info'),
  debug: createLogFunction('debug'),
  trace: createLogFunction('trace'),
};
