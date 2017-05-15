//---------------------------------------------------------------------------------
//
//  Dependencies
//
//---------------------------------------------------------------------------------

var concat = require('gulp-concat'),
    del = require('del'),
    gulp = require('gulp'),
    gUtil = require('gulp-util'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify');

var jsFiles = require('./jsFiles.json'),
    vendorFiles = require('./vendorFiles.json');

//---------------------------------------------------------------------------------
//
//  Private Variables
//
//---------------------------------------------------------------------------------

var target = {
    appDev: 'src/app/',
    appProd: 'build/app/'
};

//---------------------------------------------------------------------------------
//
//  Gulp Tasks
//
//---------------------------------------------------------------------------------

/**
 * Compiles sass files
 * @param {boolean} env
 * @param src
 * @param dest
 */
function compileSass(env, src, dest) {
    var outputStyle = 'nested';

    if (env) {
        outputStyle = 'compressed';
    }

    gulp.src(src)
        .pipe(sass({
            outputStyle: outputStyle,
            sourceComments: !env,
            omitSourceMapUrl: !env
        }))
        .pipe(gulp.dest(dest));
}

gulp.task('sass:dev', function () {
    compileSass(false, target.appDev + 'sass/main.scss', target.appDev + 'css');
});

/**
 * sass:prod task
 */
gulp.task('sass:prod', function () {
    compileSass(true, 'src/app/sass/main.scss', 'build/app/css');
});

gulp.task('sass:watch', function () {
    gulp.watch(target.appDev + 'sass/*.sсss', ['sass:dev']);
});

/**
 * Delete build
 */
gulp.task('clean', function () {
    del(['build/**']);
});

/**
 * Update bower
 */
gulp.task('bower', /*['clean'],*/ function () {
    return gulp.src('')
        .pipe(shell('bower cache clean'))
        .pipe(shell('bower install'))
});

/**
 * Minify files
 */
gulp.task('uglify', /*['bower'],*/ function () {
    return gulp.src(jsFiles)
        .pipe(concat('photohost.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/app/'));
});

/**
 * Copy task
 */
gulp.task('copy', function () {
    // all folders/files, without app and bower_components folders
    gulp.src(['src/**', '!src/app/**', '!src/bower_components/**'])
        .pipe(gulp.dest('build'));

    // bower components
    gulp.src(vendorFiles)
        .pipe(gulp.dest('build/bower_components'));

    // index.html
    gulp.src('src/app/index.min.html')
        .pipe(rename('index.html'))
        .pipe(gulp.dest('build/app'));

    // html files
    gulp.src(['src/app/**/*.html', '!src/app/index.html', '!src/app/index.min.html'])
        .pipe(gulp.dest('build/app'));

    // font awesome min.css and fonts
    gulp.src('src/bower_components/font-awesome/**')
        .pipe(gulp.dest('build/bower_components/font-awesome'));
});

gulp.task('build', ['clean', 'copy', 'uglify', 'sass:prod']);