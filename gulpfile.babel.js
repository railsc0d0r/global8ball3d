import gulp from 'gulp';
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';

// Defines main-entry-points
const entries = 'src/game3d.es6';

// Task to bundle, transpile, minify and write results to dist/
const compress = function () {
  const bundler = transpile(entries);

  minify(bundler);
  write_result(bundler);
};

// Default task to bundle, transpile and write results to dist/
const bundle = function () {
  const bundler = transpile(entries);
  write_result(bundler);
};

// Browserifies and babelifies, inits sourcemaps
const transpile = function (entries) {
  const bundler = browserify({
    entries: 'src/main.es6',
    extensions: ['.js', '.es6'],
    standalone: 'Game3D',
    debug: true
  });
  bundler.transform(babelify);
  const bundle = bundler.bundle()
    .on('error', function (err) {
      console.error(err);
    })
    .pipe(source('game3d.js'))
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
  const stuff = [
    {
      src: './node_modules/pepjs/dist/pep.js',
      dest: '/js/'
    },
    {
      src: './node_modules/cannon/build/cannon.js',
      dest: '/js/'
    },
    {
      src: './node_modules/babylonjs/babylon.js',
      dest: '/js/'
    },
    {
      src: './templates/*.html',
      dest: '/'
    }
  ];

  stuff.forEach(function(element) {
    copy_files(base_path, element.src, element.dest);
  });
};

const copy_files = function (base_path, src, dest) {
  gulp.src(src)
      .pipe(gulp.dest(base_path + dest));
};

gulp.task('concatenate_and_minify', compress);
gulp.task('concatenate_only', bundle);
gulp.task('copy_to_public', copy_to_public);
gulp.task('default', ['copy_to_public', 'concatenate_and_minify']);
