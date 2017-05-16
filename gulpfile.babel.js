const dir = {
  src: './src/theme',
  build: './wp-content/themes/theme'
}
// PHP settings
const php = {
  src: dir.src + 'template/**/*.php',
  build: dir.build
}

import gulp from 'gulp'
import gutil from 'gulp-util'
import newer from 'gulp-newer'
import imagemin from 'gulp-imagemin'
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import deporder from 'gulp-deporder'
import concat from 'gulp-concat'
import stripdebug from 'gulp-strip-debug'
import uglify from 'gulp-uglify'

// Browser-sync
const browsersync = false

// copy PHP files
gulp.task('php', () => {
  return gulp.src(php.src)
    .pipe(newer(php.build))
    .pipe(gulp.dest(php.build))
})
