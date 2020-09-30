var path = require('path');
var fs = require('fs');

class ProxyPlugin {

  constructor (environment) {
    this.env = environment;
    this.envConfigPath = `./environments/${environment}.json`;
    this.proxyConfigPath = `./proxy.conf.json`;
  }

  apply (compiler) {
    compiler.plugin("compile", () => {
      let envConfig = this.readJSONFile(this.envConfigPath);
      if(envConfig && envConfig.isStandalone && envConfig.WASPath && !envConfig.WASPath.indexOf('http') != 0)
      {
        console.log(`[PROXY] Proxying all WAS requests to ${envConfig.WASPath}`);
        let proxyConfig = {};
        proxyConfig['/remoteWAS'] = {
          "target": envConfig.WASPath,
          "logLevel": "debug",
          "changeOrigin": true,
          "pathRewrite": {
            "^/remoteWAS": ""
          },
          "rejectUnauthorized": false,
          "secure": false
        };
        this.writeJSONFile(this.proxyConfigPath, proxyConfig);
      }
    });
  }
  readJSONFile(filePath) {
    let contents = fs.readFileSync(path.resolve(filePath), 'utf8');
    return JSON.parse(contents);
  }

  writeJSONFile(filePath, jsonContent) {
    fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2), 'utf8');
  }
}

module.exports = ProxyPlugin;
