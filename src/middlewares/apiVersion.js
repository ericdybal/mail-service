import logger from '../config/logger';

export const apiVersion = (versionConfig, defaultVersion) => {
  return function(req, res, next) {
    logger.debug('apiVersion');

    let version = getVersion(req);
    if (!version) {
      version = defaultVersion;
    }
    return versionConfig[version](req, res, next);
  };
};

const getVersion = (req) => {
  let version;
  if (req.headers && req.headers['accept-version']) {
    version = req.headers['accept-version'];
  }
  return version;
};

export default apiVersion;