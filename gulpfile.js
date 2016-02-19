var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	concat = require('gulp-concat');

var coffeeSources = ['components/coffee/*.coffee'];

var jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];

var sassSources = ['components/sass/style.scss']

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
});