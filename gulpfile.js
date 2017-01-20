var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var compass = require('gulp-compass');
var imagemin = require('gulp-imagemin');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');

var scriptsPaths = {
	src: 'source/js/*.js',
	dest: 'public/javascripts'
};

var stylesPaths = {
	src: 'source/sass/**/*.sass',
	dest: 'public/stylesheets'
};

var imagesPaths = {
	src: 'source/img/**',
	dest: 'public/images'
};

gulp.task('scripts', function() {
	gulp.src(scriptsPaths.src)
	    .pipe(plumber())
	    .pipe(babel({
	    	presets: ['es2015']
	    }))
	    .pipe(concat('main.js'))
	    .pipe(uglify())
	    .pipe(gulp.dest(scriptsPaths.dest))
	    .pipe(connect.reload());
});

gulp.task('styles', function() {
	gulp.src(stylesPaths.src)
	    .pipe(plumber())
	    .pipe(compass({
	    	css: 'public/stylesheets',
	    	sass: 'source/sass',
	    	image: 'source/img',
	    	style: 'compressed',
	    	comments: false,
	    	require: ['susy']
	    }))
	    .pipe(connect.reload());
});

gulp.task('images', function() {
	gulp.src(imagesPaths.src)
	    .pipe(imagemin())
	    .pipe(gulp.dest(imagesPaths.dest))
	    .pipe(connect.reload());
});

gulp.task('connect', function() {
	connect.server({
		livereload: true,
		port: 7777
	});
});

gulp.task('watch', function() {
	gulp.watch(scriptsPaths.src, ['scripts']);
	gulp.watch(stylesPaths.src, ['styles']);
	gulp.watch(imagesPaths.src, ['images']);
});

gulp.task('default', ['scripts', 'styles', 'images', 'watch', 'connect']);

