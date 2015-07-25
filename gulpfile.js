var gulp = require("gulp"),
	connect = require("gulp-connect"),
	stylus = require("gulp-stylus"),
	rename = require("gulp-rename"),
	minifyCss = require("gulp-minify-css"),
	autoprefixer = require("gulp-autoprefixer"),
	uglify = require("gulp-uglify"),
	jshint = require("gulp-jshint");

// Server

gulp.task("connect", function(){
	connect.server({
		root: "app",
		port: 1337,
		livereload: true
	})
});

// HTML

gulp.task("html", function(){
	gulp.src("app/index.html")
	.pipe(connect.reload())
});

// CSS

gulp.task("css", function(){
	gulp.src("app/stylus/*.styl")
	.pipe(stylus())
	.pipe(autoprefixer({
		browsers: ["> 5%"],
		cascade: false
	}))
	.pipe(gulp.dest("app/tmp/css/"))
	.pipe(minifyCss(""))
	.pipe(rename("main.min.css"))
	.pipe(gulp.dest("app/tmp/css/"))
});

// Reload for CSS

gulp.task("reload", function(){
	gulp.src("app/index.html")
	.pipe(connect.reload())
})

// JS

gulp.task("js", function(){
	gulp.src("app/js/*.js")
	.pipe(gulp.dest('app/tmp/js/'))
	.pipe(uglify())
	.pipe(rename('main.min.js'))
	.pipe(gulp.dest('app/tmp/js/'))
	.pipe(connect.reload());
});

// JS Linting

gulp.task("lint", function(){
	gulp.src("app/js/*.js")
	.pipe(jshint())
	.pipe(jshint.reporter("jshint-stylish"))
});

// Watch

gulp.task("watch", function(){
	gulp.watch("app/stylus/*.styl", ["css", "reload"]);
	gulp.watch("app/index.html", ["html"]);
	gulp.watch("app/js/*.js", ["js", ["lint"]]);
});

// Default task

gulp.task("default", ["connect", "css", "js", "watch"]);

