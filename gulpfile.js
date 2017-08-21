var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sequence = require('gulp-sequence'),
    del = require('del');
var rev = require('gulp-rev');                                  //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');
var domSrc = require('gulp-dom-src');
var fileinclude  = require('gulp-file-include');

gulp.task('concat', function() {
    gulp.src('project/views/**/**.html')
        .pipe(fileinclude({
          prefix: '@@',
          basepath: 'project'
        }))
    .pipe(gulp.dest('publish-debugger/views'));
});
gulp.task('copyto', function() {
    gulp.src('project/assets/**').pipe(gulp.dest('publish-debugger/assets'));
    gulp.src('project/js/**').pipe(gulp.dest('publish-debugger/js'));
    gulp.src('project/css/**').pipe(gulp.dest('publish-debugger/css'));
    gulp.src('project/iconfont/**').pipe(gulp.dest('publish-debugger/iconfont'));
    gulp.src('project/img/**').pipe(gulp.dest('publish-debugger/img'));
    gulp.src('project/plugin/**').pipe(gulp.dest('publish-debugger/plugin'));
});

gulp.task('default', ['concat', 'copyto'], function() {
    gulp.watch('project/**',['concat', 'copyto']);
});
//-----------------------------------以上是调试----------------------------------

//region publish
gulp.task('concat-publish', function() {
    gulp.src('project/views/**/**.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'project'
        }))
        .pipe(gulp.dest('publish/views'));
});
gulp.task('copyto-publish', function() {
    gulp.src('project/assets/**').pipe(gulp.dest('publish/assets'));
    gulp.src('project/js/**').pipe(gulp.dest('publish/js'));
    gulp.src('project/css/**').pipe(gulp.dest('publish/css'));
    gulp.src('project/iconfont/**').pipe(gulp.dest('publish/iconfont'));
    gulp.src('project/img/**').pipe(gulp.dest('publish/img'));
    gulp.src('project/plugin/**').pipe(gulp.dest('publish/plugin'));
});
gulp.task('minifycss', function() {
    return gulp.src(['project/css/*.css','project/css/*/*.css'])      //压缩的文件
        .pipe(minifycss())  //执行压缩
        .pipe(rev())                                            //- 文件名加MD5后缀
        .pipe(gulp.dest('./publish/css'))                               //- 输出文件本地
        .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev'));

});

gulp.task('minifyjs', function() {
    return gulp.src(['project/js/**.js','project/js/*/*.js'])
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./publish/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./revjs'));
});
gulp.task('rev', function() {
    gulp.src(['./rev/*.json','./revjs/*.json', './publish/views/*/*.html'])
        .pipe(revCollector({
            replaceReved: true,
            // dirReplacements: {
            //     '../../css': '/dist/css',
            // }
        }))
        .pipe(gulp.dest('publish/views/'));
});

//endregion

gulp.task('publish', function(){
    sequence('concat-publish', 'copyto-publish', 'minifycss', 'minifyjs', 'rev',
        function(){
            console.log("发布完成");
        });
});