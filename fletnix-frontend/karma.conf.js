// Karma configuration file, see link for more information
// https://karma-runner.github.io/6.4/config/configuration-file.html

module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      client: {
        clearContext: false, // leave Jasmine Spec Runner output visible in browser
        jasmine: {
          random: false
        }
      },
      coverageReporter: {
        dir: require('path').join(__dirname, './coverage/fletnix-frontend'),
        subdir: '.',
        reporters: [
          { type: 'html' },
          { type: 'text-summary' },
          { type: 'lcovonly' }
        ],
        check: {
          global: {
            statements: 50,
            branches: 50,
            functions: 50,
            lines: 50
          }
        }
      },
      reporters: ['progress', 'kjhtml', 'coverage'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['Chrome'],
      singleRun: false,
      restartOnFileChange: true,
      customLaunchers: {
        ChromeHeadless: {
          base: 'Chrome',
          flags: [
            '--no-sandbox',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--headless',
            '--disable-gpu',
            '--disable-dev-shm-usage'
          ]
        }
      }
    });
  };
  