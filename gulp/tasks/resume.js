const
  gulp = require('gulp'),
  fs = require('fs'),
  $ = require('gulp-load-plugins')();

const resume = () => {
  return gulp.src('docs/**/*').pipe($.size({
    title: 'build',
    gzip: true
  }));
}

gulp.task('resume', resume);
