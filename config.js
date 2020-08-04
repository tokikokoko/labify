const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
var homedir = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;

const saveConfig = (hostname, apiBasePath, gitlabToken) => {
  const configJson = {
    hostname: hostname,
    apiBasePath: apiBasePath,
    gitlabToken: gitlabToken,
  };
  fs.mkdirSync(
    configDirPath(),
    {
      recursive: true,
    },
  );
  fs.writeFile(
    configFilePath(),
    JSON.stringify(configJson),
    (err) => {
      if (err) {
        console.error("Error: ", err);
      };
    },
  );
};

const loadConfig = () => {
  let data = fs.readFileSync(configFilePath());
  return JSON.parse(data.toString());
};

const configDirPath = () => {
  const homedir = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
  return path.join(homedir, '.config/labify');
};

const configFilePath = () => {
  const homedir = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
  return path.join(homedir, '.config/labify', 'config.json');
};

module.exports = {
  saveConfig: saveConfig,
  loadConfig: loadConfig,
  configFilePath: configFilePath,
};