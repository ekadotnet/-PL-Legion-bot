const logger = require("js-logger");

logger.useDefaults();
logger.setLevel(logger.INFO);

const onResolved = (func, params = undefined) => {
  logger.info(`Promise resolved in: ${func.name}\n`);
  params === undefined ? null : logger.info(params);
};

const onRejected = (reason, func, params = undefined) => {
  logger.error(`Promise rejected in: ${func.name}\nReason: ${reason}\n`);
  params === undefined ? null : logger.error(params);
};

module.exports = {
  onResolved: onResolved,
  onRejected: onRejected
};
