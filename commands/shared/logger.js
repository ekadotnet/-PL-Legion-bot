const logger = require("js-logger");

logger.useDefaults();
logger.setLevel(logger.INFO);

const onResolved = (func, params = undefined) => {
  logger.debug(`Promise resolved in: ${func.name}\n`);
  params === undefined ? null : logger.info(params);
};

const onRejected = (reason, func, params = undefined) => {
  logger.error(`Promise rejected in: ${func.name}\nReason: ${reason}\n`);
  params === undefined ? null : logger.error(params);
};

const onError = error => {
  logger.error(`${error.name} error occured:\n${error.message}`);
};

const log = message => {
  logger.info(message);
};

module.exports = {
  onResolved: onResolved,
  onRejected: onRejected,
  onError: onError,
  log: log
};
