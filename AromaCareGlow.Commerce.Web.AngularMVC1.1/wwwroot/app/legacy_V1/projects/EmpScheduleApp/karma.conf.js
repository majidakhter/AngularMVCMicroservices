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
        random: false
      }
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../../../../../../../Angular/SelfSchedule/TestResults/coverage'),
      reports: ['html', 'lcovonly', 'cobertura', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    junitReporter: {
      outputDir: '../../../../../../../Angular/SelfSchedule/TestResults/junit', // results will be saved as $outputDir/$browserName.xml
      useBrowserName: false, // add browser name to report and classes names
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
    reporters: ['junit', 'kjhtml', 'coverage-istanbul', 'mocha'],
    port: 9882,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    //browsers: ['Chrome'],
    browsers: ['ChromeHeadless'],
    singleRun: false
  });
};
