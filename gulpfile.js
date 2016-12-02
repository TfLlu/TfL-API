const gulp        = require('gulp');
const babel       = require('gulp-babel');
const nodemon     = require('gulp-nodemon');

// https://gist.github.com/just-boris/89ee7c1829e87e2db04c
function wrapPipe(taskFn) {
    return function(done) {
        var onSuccess = function() {
            done();
        };
        var onError = function(err) {
            done(err);
        };
        var outStream = taskFn(onSuccess, onError);
        if (outStream && typeof outStream.on === 'function') {
            outStream.on('end', onSuccess);
        }
    };
}

gulp.task('default', function() { // (D)
    gulp.watch('src/**/*.js', ['build']);
});

gulp.task('build', wrapPipe(function(success, error) {
    return gulp.src('src/**/*.js')
        .pipe(babel().on('error', error))
        .pipe(gulp.dest('dist'));
}));

gulp.task('nodemon', () => {
    return nodemon({
        script: 'dist/index.js',
        watch: [ 'dist' ]
    });
});

gulp.task('develop', ['default', 'nodemon']);
