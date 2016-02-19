var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	concat = require('gulp-concat');

var coffeeSources = ['components/coffee/*.coffee'];

var jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];

var sassSources = ['components/sass/style.scss'];

var htmlSources = ['builds/development/*.html'];

var jsonSources = ['builds/development/js/*.json'];

// compile CoffeeScript
gulp.task('coffee', function() {
	gulp.src(coffeeSources)
		.pipe(coffee({bare: true}) // send to pipe with all coffee methods, uses bare in this case
			.on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'))
});

// merge js files
gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulp.dest('builds/development/js'))
		.pipe(connect.reload())
});

// sass task
gulp.task('compass', function() {
	gulp.src(sassSources)
		.pipe(compass({
			// sass config, instead of config.rb file
			sass: 'components/sass',
			image: 'builds/development/images',
			style: 'expanded'
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest('builds/development/css'))
		.pipe(connect.reload())
});

// to track changes
gulp.task('watch', function() {
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch(htmlSources, ['html']);
	gulp.watch(jsonSources, ['json']);
});

gulp.task('connect', function() {
	connect.server({
		root: 'builds/development/',
		//port: 8888,
		livereload: true
	});
});

gulp.task('html', function() {
	gulp.src(htmlSources)
	.pipe(connect.reload())
});

gulp.task('json', function() {
	gulp.src(jsonSources)
	.pipe(connect.reload())
});

// default task for runing all the tasks
gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);



















