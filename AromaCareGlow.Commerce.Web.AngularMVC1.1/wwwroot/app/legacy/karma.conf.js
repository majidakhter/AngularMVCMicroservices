// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-junit-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-mocha-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: true
      }
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../../../../../Angular/QuickSchedule/TestResults/coverage'),
      reports: ['html', 'cobertura', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    junitReporter: {
      outputDir: '../../../../../Angular/QuickSchedule/TestResults/junit',
      useBrowserName: false
    },

    mochaReporter: {
      symbols: {
        success: '+',
        info: '#',
        warning: '!',
        error: 'x'
      },
      output: 'autowatch',
      ignoreSkipped: true
    },
    reporters: ['junit', 'kjhtml', 'coverage-istanbul', 'mocha', 'progress'],
    port: 9885,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    restartOnFileChange: true
  });
};
