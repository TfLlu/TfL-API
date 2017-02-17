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

gulp.task('default', [ 'nodemon' ]);

gulp.task('watch', () => {
    gulp.watch('src/**/*.js', [ 'build' ]);
});

gulp.task('build', wrapPipe((success, error) => {
    return gulp.src('src/**/*.js')
        .pipe(babel().on('error', error))
        .pipe(gulp.dest('dist'));
}));

gulp.task('nodemon', () => {
    return nodemon({
        script: 'dist/index.js',
        watch: [ 'src' ],
        tasks: [ 'build' ]
    });
});

gulp.task('develop', ['default', 'nodemon']);
