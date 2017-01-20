import gulp from 'gulp';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import browserify from 'browserify';
import babelify from 'babelify';
// 轉成 gulp 讀取的 vinyl (黑膠) 流
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import compass from 'gulp-compass';
import imagemin from 'gulp-imagemin';
import plumber from 'gulp-plumber';
import connect from 'gulp-connect';

const scriptsPaths = {
	src: 'source/js/*.js',
	dest: 'public/javascripts'
};

const stylesPaths = {
	src: 'source/sass/**/*.sass',
	dest: 'public/stylesheets'
};

const imagesPaths = {
	src: 'source/img/**',
	dest: 'public/images'
};

gulp.task('scripts', () => {
	return browserify({
		entries: ['source/js/main.js']
	})
	.transform(babelify)
	.bundle()
	.pipe(plumber())
	.pipe(source('bundle.js'))
	.pipe(buffer()) // 從 streaming 轉回 buffered vinyl 檔案
	.pipe(sourcemaps.init({loadMaps: true})) // 由於我們壓縮了檔案，要用 sourcemaps 來對應原始文件方便除錯
    .pipe(uglify()) // 壓縮檔案
    .pipe(sourcemaps.write('./')) 
    .pipe(gulp.dest(scriptsPaths.dest));
});

gulp.task('styles', () => {
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

gulp.task('images', () => {
	gulp.src(imagesPaths.src)
	    .pipe(imagemin())
	    .pipe(gulp.dest(imagesPaths.dest))
	    .pipe(connect.reload());
});

gulp.task('connect', () => {
	connect.server({
		root: ['./public'],
		livereload: true,
		port: 7777
	});
});

gulp.task('watch', () => {
	gulp.watch(scriptsPaths.src, ['scripts']);
	gulp.watch(stylesPaths.src, ['styles']);
	gulp.watch(imagesPaths.src, ['images']);
});

gulp.task('default', ['scripts', 'styles', 'images', 'watch', 'connect']);

