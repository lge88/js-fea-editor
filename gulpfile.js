var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');

var config = {
  path: {
    HTML: './src/index.html',
    SASS: './src/scss/*.scss',
    SASS_ENTRY: './src/scss/app.scss',
    MINIFIED_OUT: 'build.min.js',
    OUT: 'build.js',
    DEST: 'dist',
    DEST_BUILD: 'dist/build',
    DEST_SRC: 'dist/src',
    ENTRY_POINT: './src/js/App.jsx'
  }
};

gulp.task('copy', function() {
  gulp.src(config.path.HTML)
    .pipe(gulp.dest(config.path.DEST));
  console.log('HTML copied.');
});

gulp.task('sass', function () {
  gulp.src(config.path.SASS_ENTRY)
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(config.path.DEST));
  console.log('sass recompiled.');
});

gulp.task('watch', ['copy', 'sass'], function() {
  gulp.watch(config.path.HTML, ['copy']);
  gulp.watch(config.path.SASS, ['sass']);

  var watcher = watchify(browserify({
    entries: [config.path.ENTRY_POINT],
    transform: [reactify],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  }));

  var onUpdate = function() {
    watcher.bundle()
      .pipe(source(config.path.OUT))
      .pipe(gulp.dest(config.path.DEST_SRC))
      .on('finish', function() {
        console.log('updated.');
      });
  };

  watcher.on('update', onUpdate);
  onUpdate();
});

gulp.task('serve', ['watch'], function() {
  browserSync({
    server: {
      baseDir: config.path.DEST
    },
    files: [
      config.path.DEST + '/*.html',
      config.path.DEST + '/*.css',
      config.path.DEST + '/src/*.js'
    ]
  });
});
