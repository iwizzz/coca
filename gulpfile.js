const {src, dest, watch, parallel, series} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const svgSprite = require('gulp-svg-sprite');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const include = require('gulp-include');



function styles() {
    return src('sait/style/main.scss')
        .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']}))
        .pipe(concat("main.min.css"))
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(dest('sait/style'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src('sait/js/main.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('sait/js'))
        .pipe(browserSync.stream())
}

function watcher() {
    watch(['sait/style/**/*.scss'], styles)
    watch(['sait/src/images'], images)
    watch(['sait/js/main.js'], scripts)
    watch(['sait/components/*', 'sait/pages/**/*.html', '!sait/pages/index.html'], pages)
    watch(['sait/pages/index.html'], indexPage)
    watch(['sait/**/*.html', ]).on('change', browserSync.reload);
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'sait/html'
        }
    });
}


function buildCore() {
    return src([
        'sait/style/main.min.css',
        'sait/js/*.js',
        '!sait/js/main.js',
        'sait/html/*.html',
        'sait/index.html',
        'sait/dist/**',
        '!sait/dist/images/stack',
        '!sait/dist/images/*.svg',
        'sait/dist/images/sprite.svg'
    ], {base: 'sait'})
        .pipe(dest('dist'))
}

function cleanDist() {
    return src('dist')
        .pipe(clean());
}


function images() {
    return src(['sait/src/images/**/*.*', 
                "!sait/src/images/*.svg",
            ], {base: 'sait/src/images'})
        .pipe(newer('sait/dist/images'))
        .pipe(avif({ quality: 50}))

        .pipe(src('sait/src/images/**/*.*'), {base: 'sait/src/images'})
        .pipe(newer('sait/dist/images'))
        .pipe(webp())

        .pipe(src('sait/src/images/**/*.*'), {base: 'sait/src/images'})
        .pipe(newer('sait/dist/images'))
        .pipe(imagemin())

        .pipe(dest('sait/dist/images'))
}

function sprite() {
    return src(['sait/dist/images/*.svg'])
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg',
                    example: true
                }
            }
        }))
        .pipe(dest('sait/dist/images'))
}

function fonts() {
    return src('sait/src/fonts/*.*')
        .pipe(fonter({
            formats: ['woff', 'ttf']
        }))
        .pipe(src('sait/dist/fonts/*.ttf'))
        .pipe(ttf2woff2())
        .pipe(dest('sait/dist/fonts'))

}

function pages() {
    return src(['sait/pages/**/*.html', '!sait/pages/index.html'], {base: 'sait/pages'})
        .pipe(include({
            includePaths: 'sait/components'
        }))
        .pipe(dest('sait/html'))
        .pipe(browserSync.stream())
}

function indexPage() {
    return src('sait/pages/index.html')
        .pipe(dest('sait/'))
        .pipe(browserSync.stream())
}

exports.styles = styles;
exports.scripts = scripts;
exports.watcher = watcher;
exports.browsersync = browsersync;
exports.images = images;
exports.sprite = sprite;
exports.fonts = fonts;
exports.pages = pages;


exports.default = parallel(/*browsersync, */ pages, watcher, scripts);
exports.build = series(cleanDist, buildCore);
exports.convertSrc = series(images, sprite, fonts)