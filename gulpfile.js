var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');

gulp.task('serve', ['sass'], function() {
  browserSync({
    server: {
      baseDir: './'
    }
  });
  gulp.watch('./scss/*.scss', ['sass', reload]);
  gulp.watch("./js/*.js").on('change', reload);
  gulp.watch("./examples/*.js").on('change', reload);
  gulp.watch("./*.html").on('change', reload);
});

gulp.task('sass', function () {
  gulp.src('./scss/app.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['serve']);
