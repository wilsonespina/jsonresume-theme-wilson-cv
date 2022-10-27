const gulp = require('gulp');

gulp.task('clean', require('del').bind(null, ['.sass-cache', 'docs/**', '!docs/CNAME']));
