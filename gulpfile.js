const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');
const htmlhint = require("gulp-htmlhint");
const htmlmin = require('gulp-htmlmin');
const zip = require('gulp-zip');
const ghPages = require('gulp-gh-pages');

function liveReload() {
  browserSync.init({
    server: './app'
  });

  gulp.watch('app/sass/*.scss', styles);
  gulp.watch(['app/js/carousel.js'], scripts);
  gulp.watch('app/*.html').on('change', browserSync.reload)
}

function styles() {
  return gulp.src('./app/sass/*.scss')
    .pipe(sass())
    .pipe(autoprefixer(['last 4 versions']))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./app/css'))
    .pipe(browserSync.stream())
}

function scripts() {
  return gulp.src([
        './node_modules/jquery/dist/jquery.min.js',
        './node_modules/slick-carousel/slick/slick.min.js',
        './app/js/carousel.js'],
        { allowEmpty: true })
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./app/js'))
        .pipe(browserSync.stream())

}


function buildCSS() {
  return gulp.src('./app/css/main.css')
        .pipe(gulp.dest('./build/css'))
}

function buildHTML() {
  return gulp.src('./app/*.html')
        .pipe(htmlhint())
        .pipe(htmlhint.reporter())
        .pipe(htmlhint.failOnError())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./build'))
}

function buildJS() {
  return gulp.src('./app/js/main.min.js')
        .pipe(gulp.dest('./build/js'))
}

function cleanUp() {
  return del([
    'build',
]);
}

function archive() {
  return gulp.src('build/*')
		.pipe(zip('build.zip'))
		.pipe(gulp.dest('./'))
}

function build() {
  return gulp.parallel(
    cleanUp,
    buildCSS,
    buildHTML,
    buildJS,
    archive
  )
}

function deploy() {
  return gulp.src('./build')
    .pipe(ghPages({
      remoteUrl: "https://github.com/AlexeyUsanin/gulp_practice.git",
      branch: "master"
    }));
}

exports.default = liveReload;


exports.build = build();

exports.deploy = deploy;