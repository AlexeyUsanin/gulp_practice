const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');
const zip = require('gulp-zip');
const htmlmin = require('gulp-htmlmin');
const htmllint = require('gulp-htmlhint');

//////// DEVELOPMENT /////////
function liveReload() {
  browserSync.init({
    server: './app'
  });

  gulp.watch('app/sass/*.scss', styles);
  gulp.watch(['app/js/carousel.js'], script);
  gulp.watch('app/*.html').on('change', browserSync.reload)
}


function styles() {
  return gulp.src('./app/sass/*.scss', { allowEmpty: true })
    .pipe(sass())
    .pipe(autoprefixer({
      grid: 'autoplace'
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./app/css'))
    .pipe(browserSync.stream())
}

function script() {
  return gulp.src([
        './node_modules/jquery/dist/jquery.min.js',
        './node_modules/slick-carousel/slick/slick.min.js',
        './app/js/carousel.js'
      ],
      { allowEmpty: true })
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./app/js'))
        .pipe(browserSync.stream())
}

/////// BUILD PROJECT ////////
function buildCSS() {
  return gulp.src('./app/css/main.css')
        .pipe(gulp.dest('./build/css'))
}

function buildHTML() {
  return gulp.src('./app/*.html')
        .pipe(htmllint({
          'spec-char-escape': false
        }))
        .pipe(htmllint.reporter())
        .pipe(htmllint.failOnError())
        .pipe(htmlmin(
          { collapseWhitespace: true,
            removeEmptyAttributes: true,
            useShortDoctype: true,
            removeComments: true
          }))
        .pipe(gulp.dest('./build'))
}

function buildJS() {
  return gulp.src('./app/js/script.min.js')
        .pipe(gulp.dest('./build/js'))
}

function cleanUp() {
  return del(['./build']);
}

function acrchive() {
  return gulp.src('./build/*')
    .pipe(zip('build.zip'))
    .pipe(gulp.dest('./'))
}

function build() {
  return gulp.parallel(
    cleanUp,
    gulp.series(
      buildCSS,
      buildHTML,
      buildJS,
      acrchive
    ),
  )
}

exports.default = liveReload;
exports.build = build();