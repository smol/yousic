module.exports = function(grunt) {

	// 1. All configuration goes here
	grunt.initConfig({
		nodemon: {
			dev: {
				script: 'server.js'
			}
		},

		pkg: grunt.file.readJSON('package.json'),

		dirs : {
			modules : 'front/bower_components',
			src : 'front/public',
			build : 'front/build'
		},
		copy : {
			html : {
				expand : true,
				cwd : '<%= dirs.src %>',
				src : '**/*.html',
				dest : '<%= dirs.build %>',
				flatten : false

			},
			asset : {
				expand : true,
				cwd : '<%= dirs.src %>/static/img/',
				src : '**/*',
				dest : '<%= dirs.build %>/static/img/',
				flatten : false
			},
			font : {
				expand : true,
				cwd : '<%= dirs.src %>/static/font/',
				src : '**/*',
				dest : '<%= dirs.build %>/static/font/',
				flatten : false
			}
			// main : {
			// 	expand : true,
			// 	cwd : '<%= dirs.src %>/static/javascripts/library/',
			// 	src : '*.js',
			// 	dest : 'public/build/library',
			// 	flatten : true
			// }
		},

		concat: {
			libs : {
				src : [
					'<%= dirs.modules %>/angular/angular.min.js',
					'<%= dirs.modules %>/socket.io-client/socket.io.js',
					'<%= dirs.modules %>/angular-socket-io/socket.min.js',
					'<%= dirs.modules %>/angular-ui-router/release/angular-ui-router.min.js',
				],
				dest: '<%= dirs.build %>/lib.min.js',
			},
			dist: {
				src: ['<%= dirs.src %>/**/*.js'],
				dest: '<%= dirs.build %>/yousic.min.js',
			},
			css : {
				src : ['<%= dirs.src %>/static/**/*.scss'],
				dest : '<%= dirs.build %>/style.scss'
			}
		},

		uglify: {
			build: {
				src: 'public/build/production.js',
				dest: 'public/build/production.min.js'
			}
		},

		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'<%= dirs.build %>/style.css': '<%= dirs.build %>/style.scss'
				}
			}
		},

		autoprefixer: {
			dist: {
				files: {
					'<%= dirs.build %>/style.css': '<%= dirs.build %>/style.css'
				}
			}
		},

		clean : {
			src : ['<%= dirs.build %>']
		},

		watch: {
			scripts: {
				files: ['<%= dirs.src %>/**/*.js'],
				tasks: ['concat', 'uglify'],
				options: {
					spawn: false,
					livereload: true,
				},
			},

			html: {
				files: ['<%= dirs.src %>/**/*.html'],
				tasks: ['copy:html'],
				options: {
					spawn: false,
					livereload: true,
				}
			},

			css: {
				files: ['<%= dirs.src %>/static/**/*.scss'],
				tasks: ['concat:css', 'sass'],
				options: {
					spawn: false,
					livereload: true,
				}
			}
		},

		concurrent : {
			dev : ['watch', 'nodemon'],
			options : {
				logConcurrentOutput : true
			}
		}

	});

	// 3. Where we tell Grunt we plan to use this plug-in.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	// grunt.loadNpmTasks('grunt-autoprefixer');
	// grunt.loadNpmTasks('grunt-devtools');

	// 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
	grunt.registerTask('default', ['clean', 'concat', 'uglify', 'sass', 'copy']);

	grunt.registerTask('dev', ['default', 'concurrent:dev']);

};
