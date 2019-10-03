// プラグインの読み込み
const gulp = require('gulp'); //gulpプラグインの読み込み
const sass = require('gulp-sass'); //Sassをコンパイルするプラグインの読み込み
const plumber = require('gulp-plumber'); //エラーの強制停止を防止プラグインの読み込み
const notify = require('gulp-notify'); //エラー発生時にデスクトップ通知するプラグインの読み込み
const sassGlob = require('gulp-sass-glob'); //@importの記述を簡潔にするプラグインの読み込み
const browserSync = require('browser-sync').create(); //自動でブラウザリロードをする
const postcss = require('gulp-postcss'); //autoprefixerとセットで読み込みさせる
const autoprefixer = require('autoprefixer'); //ベンダープレフィックス自動付与するプラグインの読み込み
const cssdeclsort = require('css-declaration-sorter'); //CSSの並べ替えするプラグインの読み込み
const imagemin = require('gulp-imagemin'); //画像を圧縮するプラグインの読み込み
const pngquant = require('imagemin-pngquant'); //gulp-imageminのライブラリ（PNGを圧縮）
const mozjpeg = require('imagemin-mozjpeg'); //gulp-imageminのライブラリ（JpegNGを圧縮）
const concat = require('gulp-concat'); //ファイルを結合するプラグインの読み込み
const jshint = require('gulp-jshint'); //JavaScriptの構文をチェックしてくれるプラグインの読み込み
const rename = require('gulp-rename'); //ファイル名を変更するプラグインの読み込み
const uglify = require('gulp-uglify'); //ファイルを圧縮してくれるプラグインの読み込み


// scssのコンパイル
gulp.task('sass', function () {
    return gulp
        .src('./src/scss/**/*.scss') //ファイルの参照先を指定
        .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })) //エラーチェック
        .pipe(sassGlob()) //importの読み込みを簡潔にする
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(postcss([autoprefixer(
            {
                cascade: false
            }
        )]))
        .pipe(postcss([cssdeclsort({ order: 'alphabetically' })])) //プロパティをソートし直す(アルファベット順)
        .pipe(gulp.dest('./css')); //コンパイル後の出力先
});

// 圧縮率の定義
const imageminOption = [
    pngquant({ quality: [0.65, 0.8], }),
    mozjpeg({ quality: 85 }),
    imagemin.gifsicle({
        interlaced: false,
        optimizationLevel: 1,
        colors: 256
    }),
    imagemin.jpegtran(),
    imagemin.optipng(),
    imagemin.svgo()
];

// 画像の圧縮
gulp.task('imagemin', function () {
    return gulp
        .src('./src/img/*.{png,jpg,gif,svg}')
        .pipe(imagemin(imageminOption))
        .pipe(gulp.dest('./img'));
});

// jsファイルを結合
gulp.task('js.concat', function () {
    return gulp.src([
        './src/js/**/*.js'
    ])
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('script.js'))
        .pipe(gulp.dest('./js'));
});

// jsファイルを圧縮
gulp.task('js.compress', function () {
    return gulp.src('./js/script.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(rename('script.min.js'))
        .pipe(gulp.dest('./js'));
});

// 保存時のリロード
gulp.task('browser-sync', function (done) {
    browserSync.init({

        // ローカル開発
        server: {
            baseDir: "./",
            index: "index.html"
        }
    });
    done();
});

gulp.task('bs-reload', function (done) {
    browserSync.reload();
    done();
});

// 監視
gulp.task('watch', function (done) {
    gulp.watch('./src/scss/**/*.scss', gulp.series('sass', 'bs-reload')); //Sassファイルが変更されたらコンパイルしてブラウザをリロードする
    gulp.watch('./src/js/*.js', gulp.series('js.concat', 'js.compress', 'bs-reload')); //jsファイルが変更されたらブラウザをリロードする
    gulp.watch('./**/*.html', gulp.series('bs-reload')); //htmlファイルが変更されたらブラウザをリロードする
    gulp.watch('./src/img/*.{png,jpg,gif,svg}', gulp.series('imagemin', 'bs-reload')); //画像が変更されたら圧縮をしてブラウザをリロードする
});

// default
gulp.task('default', gulp.series(gulp.parallel('browser-sync', 'watch')));