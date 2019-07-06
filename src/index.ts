import winston from 'winston';
import colors from 'colors/safe';

interface Config {
  isTesting: boolean;
  isProduction: boolean;
}

enum Level {
  verbose = 'verbose',
  info = 'info',
  debug = 'debug',
}

/**
 * Define log levels for envs
 */
const level = (config: Config): Level => {
  if (config.isTesting) {
    return Level.verbose;
  }
  if (config.isProduction) {
    return Level.info;
  }
  // for dev env
  return Level.debug;
};

const format = winston.format.printf((info): string => `${info.level}: ${info.message} [${info.label}]`);

/**
 * Get logger object
 */
export = (module: NodeJS.Module, config: Config): winston.Logger => {
  // Include filename
  const path: string = colors.grey(`${module.filename.split('/').slice(-2).join('/')}`);
  return winston.createLogger({
    format: winston.format.combine(
      winston.format.label({ label: path }),
      winston.format.cli(),
      format,
    ),
    transports: [
      // Use console
      new winston.transports.Console(),
    ],
    level: level(config),
  });
};
