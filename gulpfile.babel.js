import gulp from 'gulp';
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';

// Defines main-entry-points
const scripts = [
  {
    entries: 'game3d.es6',
    namespace: 'Global8ball',
    filename: 'game3d.js'
  },
  {
    entries: 'game_config/table_config.es6',
    namespace: 'TableConfig',
    filename: 'table_config.js'
  },
  {
    entries: 'game_config/balls_config.es6',
    namespace: 'BallsConfig',
    filename: 'balls_config.js'
  }
];

// Task to bundle, transpile, minify and write results to dist/
const compress = function () {
  scripts.forEach(script => {
    const bundler = transpile(script);
    minify(bundler);
    write_result(bundler);
  });
};

// Default task to bundle, transpile and write results to dist/
const bundle = function () {
  scripts.forEach(script => {
    const bundler = transpile(script);
    write_result(bundler);
  });
};

// Browserifies and babelifies, inits sourcemaps
const transpile = function (script) {
  const bundler = browserify({
    entries: script.entries,
    extensions: ['.js', '.es6'],
    standalone: script.namespace,
    debug: true
  });
  bundler.transform(babelify);
  const bundle = bundler.bundle()
    .on('error', function (err) {
      console.error(err);
    })
    .pipe(source(script.filename))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}));
  return bundle;
};

// Minifies and adds suffix .min to filename
const minify = function (bundler) {
  bundler.pipe(uglify())
    .pipe(rename({suffix: '.min'}));
};

// Writes the results to dist/
const write_result = function (bundler) {
  bundler.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/js'));
};

// Copies stuff
const copy_to_public = function () {
  const base_path = './public';

  const javascripts = [
    './node_modules/pepjs/dist/pep.js',
    './node_modules/cannon/build/cannon.js',
    './node_modules/babylonjs/babylon.js'
  ];

  const templates = [
    './templates/*.html'
  ];

  javascripts.forEach(function(script) {
    copy_files(script, base_path + '/js/');
  });

  templates.forEach(function(script) {
    copy_files(script, base_path + '/');
  });
};

const copy_files = function (src, dest) {
  gulp.src(src)
      .pipe(gulp.dest(dest));
};

gulp.task('concatenate_and_minify', compress);
gulp.task('concatenate_only', bundle);
gulp.task('copy_to_public', copy_to_public);
gulp.task('default', ['copy_to_public', 'concatenate_and_minify']);
