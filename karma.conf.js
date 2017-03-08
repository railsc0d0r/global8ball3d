// Karma configuration
// Generated on Wed Oct 12 2016 12:19:32 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'jasmine'],

    // plugins to use
    plugins: [
     'karma-jasmine',
     'karma-chrome-launcher',
     'karma-firefox-launcher',
     'karma-browserify',
     'karma-coverage',
     'karma-longest-reporter'
    ],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/cannon/build/cannon.js',
      'node_modules/babylonjs/babylon.js',
      'src/**/*.es6',
      'spec/**/*.es6'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.es6': ['browserify', 'coverage'],
      'spec/**/*.es6': ['browserify', 'coverage']
    },

    browserify: {
          debug: true,
          transform: [
            ['babelify']
          ],
          extensions: ['.es6']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage', 'longest'],

    // generates coverage on console
    coverageReporter: {
      type : 'text-summary'
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chromium'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
