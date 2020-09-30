var request = require('request');
var path = require('path');
var fs = require('fs');
var moment = require('moment');

var configPath = '';

class AuthenticationPlugin {

  constructor (environment) {

    this.env = environment;
    this.envConfigPath = `./src/environments/environment.${environment}.ts`;
    configPath = this.envConfigPath;
  }

  apply (compiler) {
    compiler.plugin("compile", () => {
      var env = this.env;
      getEnvironmentConfig(this.envConfigPath, function (fileString) {
        let envConfig = parseTSFile(fileString);
        envConfig.env = env;

        if (envConfig.isStandalone) {

          if (!envConfig.auth.accessToken) {
            getToken(configPath, envConfig, fileString);
          } else {
            var configTime = moment(envConfig.auth.tokenRequested);
            var minutes = moment.duration(moment.utc().diff(configTime)).asMinutes();
            if (minutes >= 58) {
              getToken(configPath, envConfig, fileString);
            }
          }
        }
      });
    });
  }
}

function getEnvironmentConfig (filePath, callback) {
  fs.readFile(path.resolve(filePath), 'utf8', function (error, data) {
    if (error) {
      throw error;
    } else {
      callback(data);
    }
  });
}

const str2obj = str => {
  return str
    .replace(/'/g, '')
    .split(',')
    .map(keyVal => {
      return keyVal
        .split(': ')
        .map(_ => _.trim());
    })
    .reduce((accumulator, currentValue) => {
      accumulator[currentValue[0]] = currentValue[1]
      return accumulator
    }, {})
}

function parseTSFile (fileString) {

  let search = 'isStandalone: ';

  let standaloneIndex = fileString.indexOf(search);
  let isStandaloneChar = fileString.substring(standaloneIndex + search.length, standaloneIndex + search.length + 1);

  let o = {};
  o.isStandalone = isStandaloneChar === 't';

  let authSearch = 'auth: {';
  let authIndex = fileString.indexOf(authSearch);
  let authString = fileString.substring(authIndex + authSearch.length);
  let endBracketIndex = authString.indexOf('}');

  o.auth = str2obj(authString.substring(0, endBracketIndex));

  return o;
}

function writeToken (envConfigPath, config, fileString) {
  //this method will write to the appropriate environment.env.ts file.
  //1. modify fileString, by replacing the auth section with the config auth section, which contains the auth token.

  let authSearch = 'auth: {';
  let authIndex = fileString.indexOf(authSearch);
  let authString = fileString.substring(authIndex);
  let endBracketIndex = authString.indexOf('}');

  let replacementAuth = JSON.stringify(config.auth, null, 4).replace(/"/g, '\'');

  let newFileString = fileString.slice(0, authIndex) + 'auth: ' + replacementAuth + fileString.slice(authIndex + endBracketIndex + 1);

  //2. write file
  fs.writeFile(envConfigPath, newFileString, function (error) {
    if (error) {
      throw error;
    }
  });
}

function getToken (envConfigPath, envConfig, fileString) {

  request.post({
    url: `https://login.microsoftonline.com/${envConfig.auth.directory}/oauth2/token`,
    form: {
      grant_type: "client_credentials",
      client_id: envConfig.auth.clientId,
      client_secret: envConfig.auth.clientSecret,
      resource: `https://${envConfig.auth.realm}`
    }
  }, function (error, response, body) {
    if (error) {
      throw error;
    }
    if (body) {
      var content = JSON.parse(body);

      if (!content.access_token) {
        throw content.error_description;
      }

      envConfig.auth.accessToken = content.access_token;
      envConfig.auth.tokenRequested = moment.utc();

      writeToken(envConfigPath, envConfig, fileString);
    }
  });
}

module.exports = AuthenticationPlugin;
