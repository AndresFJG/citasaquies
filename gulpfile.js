// const { src, dest, watch, parallel, series } = require('gulp');
// const sass = require('gulp-sass')(require('sass'));
// const autoprefixer = require('autoprefixer');
// const postcss = require('gulp-postcss');
// const sourcemaps = require('gulp-sourcemaps');
// const cssnano = require('cssnano');
// const concat = require('gulp-concat');
// const terser = require('gulp-terser-js');
// const rename = require('gulp-rename');
// const imagemin = require('gulp-imagemin');
// const cache = require('gulp-cache');

// const paths = {
//     imagenes: 'src/img/**/*',
//     js: 'src/js/**/*.js',
//     scss: 'src/scss/**/*.scss',
// };

// function css() {
//     return src(paths.scss)
//         .pipe(sourcemaps.init())
//         .pipe(sass())
//         .pipe(postcss([autoprefixer(), cssnano()]))
//         .pipe(sourcemaps.write('.'))
//         .pipe(dest('./build/css'));
// }

// function javascript() {
//     return src(paths.js)
//       .pipe(sourcemaps.init())
//       .pipe(concat('bundle.js'))
//       .pipe(terser())
//       .pipe(sourcemaps.write('.'))
//       .pipe(rename({ suffix: '.min' }))
//       .pipe(dest('./build/js'));
// }

// function imagenes() {
//     return src(paths.imagenes)
//         .pipe(cache(imagemin({ optimizationLevel: 3 })))
//         .pipe(dest('build/img'))
// }
// function webpackTask() {
//     return src('src/entry.js')
//         .pipe(webpackStream(require('./webpack.config.js'), webpack))
//         .pipe(dest('dist'));
// }

// async function versionWebp() {
//     const { default: webp } = await import('gulp-webp');
//     return src(paths.imagenes)
//         .pipe(webp())
//         .pipe(dest('build/img'))
// }
// function watchArchivos() {
//     watch(paths.scss, css);
//     watch(paths.js, javascript);
//     watch(paths.imagenes, imagenes);
//     watch(paths.imagenes, { ignoreInitial: false }, versionWebp).on('change', function(path, stats) {
//         console.log(`File ${path} was changed`);
//     });
// }

// exports.default = parallel(css, javascript, imagenes, versionWebp, watchArchivos); 

// exports.build = series(css, javascript, imagenes, versionWebp, function(done) {
//     console.log('Build complete');
//     done();
// });

const { src, dest, watch , parallel, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss    = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const cache = require('gulp-cache');
// const webp = require('gulp-webp');
import('gulp-webp').then((gulpWebp) => {
    // Usa gulpWebp aquí
}).catch((error) => {
    // Maneja cualquier error
    console.error(error);
});
const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*'
}

function build() {
    return src('build/**/*')
      .pipe(rename(function(path) {
        path.dirname = path.dirname.replace(/^build/, 'dist');
      }))
      .pipe(dest('dist'));
  }

// css es una función que se puede llamar automaticamente
function css() {
    return src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        // .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe( dest('./build/css') );
}


function javascript() {
    return src(paths.js)
      .pipe(sourcemaps.init())
      .pipe(concat('bundle.js')) // final output file name
      .pipe(terser())
      .pipe(sourcemaps.write('.'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest('./build/js'))
}

function imagenes() {
    return src(paths.imagenes)
        .pipe(cache(imagemin({ optimizationLevel: 3})))
        .pipe(dest('build/img'))
        .pipe(notify({ message: 'Imagen Completada'}));
}

// function versionWebp() {
//     return src(paths.imagenes)
//         .pipe( webp() )
//         .pipe(dest('build/img'))
//         .pipe(notify({ message: 'Imagen Completada'}));
// }
function versionWebp() {
    return import('gulp-webp')
        .then((gulpWebp) => {
            return src(paths.imagenes)
                .pipe(gulpWebp.default()) // Accede al módulo gulp-webp con .default()
                .pipe(dest('build/img'))
                .pipe(notify({ message: 'Imagen Completada'}));
        })
        .catch((error) => {
            console.error(error);
        });
}


function watchArchivos() {
    watch( paths.scss, css );
    watch( paths.js, javascript );
    watch( paths.imagenes, imagenes );
    watch( paths.imagenes, versionWebp );
}
 exports.css = css; 
 exports.watchArchivos = watchArchivos; 
exports.default = parallel(css, javascript,  imagenes, versionWebp, watchArchivos ); 
exports.build = series(css, javascript, imagenes, versionWebp, build, function(done) {
         console.log('Build complete');
         done();
     });