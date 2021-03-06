'use strict'

const condenseWhitespace = require('condense-whitespace')
const browserSync = require('browser-sync').create()
const imagemin = require('gulp-imagemin')
const { spawn } = require('child_process')
const gulp = require('gulp')

const log = require('acho')({
  outputType: type => '[jekyll]'
})

gulp.task('jekyll', () => {
  const jekyll = spawn('bundle', [
    'exec',
    'jekyll',
    'serve',
    '--watch',
    '--incremental',
    '--drafts'
  ])

  const logMessage = type => buffer => {
    buffer
      .toString()
      .split(/\n/)
      .forEach(message => {
        message.length > 2 && log[type](condenseWhitespace(message))
      })
  }
  ;[
    { output: 'stdout', type: 'info' },
    { output: 'stderr', type: 'error' }
  ].forEach(({ output, type }) => jekyll[output].on('data', logMessage(type)))
})

gulp.task('serve', () => {
  browserSync.init({
    port: 1337,
    open: false,
    server: {
      baseDir: '_site'
    }
  })

  gulp
    .watch(['!_site/.sass-cache', '_site/**/*.*'])
    .on('change', browserSync.reload)
})

gulp.task('images', () => {
  gulp
    .src('images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('images'))
})

gulp.task('default', ['jekyll', 'serve'])
