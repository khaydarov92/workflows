var gulp = require('gulp'),
	gutil = require('gulp-util'), // display log in terminal
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'), // server and live reload
	gulpif = require('gulp-if'), // if statement for gulp
	uglify = require('gulp-uglify'), // js minify
	minifyHTML = require('gulp-minify-html'), // html minify
	concat = require('gulp-concat'); // concat files

var env,
	coffeeSources,
	jsSources,
	sassSources,
	htmlSources,
	jsonSources,
	outputDir,
	sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
}

// links ------------------------------------------
coffeeSources = ['components/coffee/*.coffee'];
jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];

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
		.pipe(gulpif(env === 'production', uglify()))
		.pipe(gulp.dest(outputDir + 'js'))
		.pipe(connect.reload())
});

// sass task
gulp.task('compass', function() {
	gulp.src(sassSources)
		.pipe(compass({
			// sass config, instead of config.rb file
			sass: 'components/sass',
			image: outputDir + 'images',
			style: sassStyle
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest(outputDir + 'css'))
		.pipe(connect.reload())
});

// to track changes
gulp.task('watch', function() {
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch('builds/development/*.html', ['html']);
	gulp.watch(jsonSources, ['json']);
});

gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		//port: 8888,
		livereload: true
	});
});

// if in prod mode => minify & place into prod directory
gulp.task('html', function() {
	gulp.src('builds/development/*.html')
	.pipe(gulpif(env === 'production', minifyHTML()))
	.pipe(gulpif(env === 'production', gulp.dest(outputDir)))
	.pipe(connect.reload())
});

gulp.task('json', function() {
	gulp.src(jsonSources)
	.pipe(connect.reload())
});

// default task for runing all the tasks
gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);



















