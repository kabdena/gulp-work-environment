var gulp 				 = require("gulp"),
		sass 				 = require("gulp-sass"),
		browserSync  = require('browser-sync').create(),
		useref 			 = require('gulp-useref'),
		uglify 			 = require('gulp-uglify'),
		gulpIf	 		 = require('gulp-if'),
		cssnano 		 = require('gulp-cssnano'),
		autoprefixer = require('gulp-autoprefixer'),
		imagemin 		 = require('gulp-imagemin'),
		cache 			 = require('gulp-cache'),
		del 				 = require('del'),
		notify 			 = require('gulp-notify'),
		runSequence  = require('run-sequence');

/* BrowserSync task (LiveReload for Browser) */
gulp.task('browserSync', function () {
	browserSync.init({
		server: {
			baseDir: "./app"
		},
		notify: false
	});
});

/* Sass task (Compile Sass to SCSS) */
gulp.task('sass', function () {
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass().on('error', notify.onError()))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('app/css'))
		.pipe(notify({
			sound: false,
			message: 'Success compile file: <%= file.relative %>'
		}))
		.pipe(browserSync.stream())
});

/* Useref task (Optimizing CSS & JS files) */
gulp.task('useref', function () {
	return gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'))
});

/* Imagemin task (Optimizing images) */
gulp.task('images', function () {
	return gulp.src('app/img/**/*+(png|jpg|gif|svg)')
		.pipe(cache(imagemin()))
		.pipe(gulp.dest('dist/img'))
});

/* Fonts task (Copying fonts to Dist) */
gulp.task('fonts', function () {
	return gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
});

/* Del task (Clean up generated files auto)*/
gulp.task('clean:dist', function () {
	return del('dist');
});

/* Clean cache */
gulp.task('cache:clear', function () {
	cache.clearAll()
})

/* Watch task (Watch) */
gulp.task('watch', ['sass', 'browserSync'], function () {
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/**/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});
 
/* Default Task */
gulp.task('default', function (callback) {
	runSequence(['sass', 'browserSync', 'watch'],
		callback
	)
})

/* Build project */
gulp.task('build', function (callback) {
	runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'],
		callback
	)
})
