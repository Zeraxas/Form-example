var gulp = require("gulp"),
	connect = require("gulp-connect"),
	stylus = require("gulp-stylus"),
	rename = require("gulp-rename"),
	minifyCss = require("gulp-minify-css"),
	autoprefixer = require("gulp-autoprefixer"),
	uglify = require("gulp-uglify"),
	jshint = require("gulp-jshint"),
	imagemin = require("gulp-imagemin"),
	pngquant = require("imagemin-pngquant"),
	svgstore = require("gulp-svgstore"),
	inject = require("gulp-inject"),
	cheerio = require("gulp-cheerio"),
	htmlreplace = require("gulp-html-replace"),
	htmlmin = require("gulp-htmlmin");

var paths = {
	app: "app/",
	dist: "dist/",
	stylus: "app/stylus/",
	js: "app/js/",
	tmp: "app/tmp/",
	tmpCss: "app/tmp/css/",
	tmpJs: "app/tmp/js/",
	images: "app/assets/images/",
	copressed: "app/assets/compressed/",
	svg: "app/resourses/svg/"
}


// Server

gulp.task("connect", function(){
	connect.server({
		root: paths.app,
		port: 1337,
		livereload: true
	})
});

// HTML

gulp.task("html", function(){
	gulp.src(paths.app + "index.html")
	.pipe(connect.reload())
});

// CSS

gulp.task("css", function(){
	gulp.src(paths.stylus + "main.styl")
	.pipe(stylus({
		"include css": true
	}))
	.pipe(autoprefixer({
		browsers: ["> 5%"],
		cascade: false
	}))
	.pipe(gulp.dest(paths.tmpCss))
	.pipe(minifyCss(""))
	.pipe(rename("main.min.css"))
	.pipe(gulp.dest(paths.tmpCss))
});

// Reload for CSS

gulp.task("reload", function(){
	gulp.src(paths.app + "index.html")
	.pipe(connect.reload())
})

// JS

gulp.task("js", function(){
	gulp.src(paths.js +  "*.js")
	.pipe(gulp.dest(paths.tmpJs))
	.pipe(uglify())
	.pipe(rename('main.min.js'))
	.pipe(gulp.dest(paths.tmpJs))
	.pipe(connect.reload());
});

// JS Linting

gulp.task('lint', function(){
	gulp.src(paths.js +  "*.js")
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'))
});

// Compress images

gulp.task("compress", function(){
	gulp.src(paths.images + "**/*")
	.pipe(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(gulp.dest(paths.copressed));
});

// Create svg sprite and inject it into html

gulp.task("spriteSvg", function(){
	var svgs = gulp
		.src(paths.svg + "*.svg")
		.pipe(rename({prefix: "icon-"}))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}]
		}))
		.pipe(svgstore({inlineSvg: true}))
		.pipe(cheerio({
			run: function($) {
				$("[fill]").removeAttr("fill");
			},
			parserOptions: { xmlMode: true }
		}))

	function fileContents(filePath, file) {
		return file.contents.toString()
	}

	gulp.src(paths.app + "index.html")
	.pipe(inject(svgs, {transform: fileContents}))
	.pipe(gulp.dest(paths.app));
});

// Replace css and js links/src and minify html file

gulp.task("copyhtml", function() {
	gulp.src(paths.app + "index.html")
	.pipe(htmlreplace({
		"css": "css/main.min.css",
		"js": "js/main.min.js"
	}))
	.pipe(htmlmin({
		collapseWhitespace: true,
		removeComments: true
	}))
	.pipe(gulp.dest(paths.dist))
});

// Copy minified versions of css and js files to dist

gulp.task("copy", function() {
	gulp.src(paths.tmpCss + "*.min.css")
	.pipe(gulp.dest(paths.dist + "css/"))
	gulp.src( paths.tmpJs + "*.min.js")
	.pipe(gulp.dest(paths.dist + "js/"))
});

//  Build

gulp.task("build", ["copyhtml", "copy"]);

// Watch

gulp.task("watch", function(){
	gulp.watch(paths.stylus + "*.styl", ["css", "reload"]);
	gulp.watch(paths.app + "index.html", ["html"]);
	gulp.watch(paths.js + "*.js", ["js", ["lint"]]);
	gulp.watch(paths.images + "**/*", ["compress"]);
	gulp.watch(paths.svg + "*.svg", ["spriteSvg"]);
});

// Default task

gulp.task("default", ["connect", "css", "js", "spriteSvg", "watch"]);