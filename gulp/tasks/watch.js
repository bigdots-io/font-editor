var gulp = require('gulp');
var watch = require('gulp-watch');

gulp.task('watch', function() {
  gulp.watch('public/scripts/**/*', ['browserify']);
  gulp.watch('../macro-library/**/*', ['browserify']);
});
