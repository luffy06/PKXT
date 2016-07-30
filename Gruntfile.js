module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    var config = grunt.file.readJSON('package.json');
    grunt.initConfig({
        clean: {
            build: [
                 config.path.scripts + '/*.*.*.js',
                 config.path.styles + '/*.*.*.css'
            ]
        },
        htmlmin: {
            build: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: config.path.pages,
                    src: ['**/*.html'],
                    dest: config.path.pages,
                    ext: '.html'
                }]
            }
        },
        uglify: {
            options: {
                unused: false,
                global_defs: {
                    DEBUG: false
                }
            },
            my_target: {
                files: [{
                    expand: true,
                    cwd: config.path.scripts,
                    src: ['*.js', '!*.min.js'],
                    dest: config.path.scripts,
                    ext: '.min.js'
                }]
            }
        },
        cssmin: {
            my_target: {
                files: [{
                    expand: true,
                    cwd: config.path.styles,
                    src: ['*.css', '!*.min.css'],
                    dest: config.path.styles
                }]
            }
        },
        filerev: {
            options: {
                algorithm: 'md5',
                length: 7
            },
            static: {
                files: [{
                    expand: true,
                    cwd: config.path.styles,
                    src: ['*.*.css','*.css'],
                    dest: config.path.styles
                }, {
                    expand: true,
                    cwd: config.path.scripts,
                    src: ['*.*.js','*.js'],
                    dest: config.path.scripts
                }]
            }
        },
        usemin: {
            options: {
                assetsDirs: [
                    config.path.styles + '/',
                    config.path.scripts + '/'
                ],
                patterns: {
                    pages: [
                        [new RegExp('([a-zA-Z0-9\-_]*\.css)', 'g'), 'replace styles in pages'],
                        [new RegExp('([a-zA-Z0-9\-_]*\.js)', 'g'), 'replace scripts in pages']
                    ]
                }
            },
            pages: config.path.pages + '/**.html',
        }



    });

    grunt.registerTask('default', [
        'clean:build',
        //'htmlmin',
        'cssmin',
        'uglify',
        'filerev',
        'usemin'
    ]);
};
