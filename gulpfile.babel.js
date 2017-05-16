import gulp from 'gulp'
import gutil from 'gulp-util'
import newer from 'gulp-newer'
import imagemin from 'gulp-imagemin'
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import deporder from 'gulp-deporder'
import concat from 'gulp-concat'
import  stripdebug from 'gulp-strip-debug'
import uglify from 'gulp-uglify'

const themeName = 'my-wordpress-theme'

const dir = {
  src: './src/theme',
  build: `./wp-content/themes/${themeName}`
}

const php = {
  src: dir.src + '/**/*.php',
  build: dir.build
}

const twig = {
  src: dir.src + '/**/*.twig',
  build: dir.build
}

const images = {
  src: dir.src + '/images/**/*',
  build: dir.build + '/images/'
}

const css = {
  src: dir.src + '/scss/style.scss',
  watch: dir.src + '/scss/**/*',
  build: dir.build,
  sassOpts: {
    outputStyle: 'nested',
    imagePath: images.build,
    precision: 3,
    errLogToConsole: true
  },
  processors: [
    require('postcss-assets')({
      loadPaths: ['images/'],
      basePath: dir.build,
      baseUrl: `/wp-content/themes/${themeName}`
    }),
    require('autoprefixer')({
      browsers: ['last 2 versions', '> 2%']
    }),
    require('css-mqpacker'),
    require('cssnano')
  ]
}

const js = {
  src: dir.src + '/js/**/*',
  build: dir.build + '/js/',
  filename: 'scripts.js'
}

// Browser-sync
const browsersync = false

// Browsersync options
const syncOpts = {
  proxy: '192.168.99.100:8080',
  files: dir.build + '**/*',
  open: false,
  notify: false,
  ghostMode: false,
  ui: {
    port: 8001
  }
}

gulp.task('browsersync', () => {
  if (browsersync === false) {
    require('browser-sync').create().init(syncOpts)
  }
})

gulp.task('php', () => {
  return gulp.src(php.src)
    .pipe(newer(php.build))
    .pipe(gulp.dest(php.build))
})

gulp.task('twig', () => {
  return gulp.src(twig.src)
    .pipe(newer(twig.build))
    .pipe(gulp.dest(twig.build))
})

gulp.task('scss', ['images'], () => {
  return gulp.src(css.src)
    .pipe(sass(css.sassOpts))
    .pipe(postcss(css.processors))
    .pipe(gulp.dest(css.build))
    .pipe(browsersync ? browsersync.reload({ stream: true }) : gutil.noop())
})

gulp.task('js', () => {
  return gulp.src(js.src)
    .pipe(deporder())
    .pipe(concat(js.filename))
    .pipe(stripdebug())
    .pipe(uglify())
    .pipe(gulp.dest(js.build))
    .pipe(browsersync ? browsersync.reload({ stream: true }) : gutil.noop())
})

gulp.task('images', () => {
  return gulp.src(images.src)
    .pipe(newer(images.build))
    .pipe(imagemin())
    .pipe(gulp.dest(images.build))
})

gulp.task('watch', ['browsersync'], () => {
  gulp.watch(php.src, ['php'], browsersync ? browsersync.reload : {})
  gulp.watch(twig.src, ['twig'], browsersync ? browsersync.reload : {})
  gulp.watch(images.src, ['images'])
  gulp.watch(css.watch, ['css'])
  gulp.watch(js.src, ['js'])
})


gulp.task('build', ['php', 'twig', 'scss', 'js'])

gulp.task('default', ['build', 'watch'])
