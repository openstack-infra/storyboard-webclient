/*
 * Copyright (c) 2013 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * This file serves as task declaration/configuration for steps executed
 * during the grunt build. It loads grunt modules declared in package.json,
 * configures them, and makes them available via 'grunt PLUGIN' on the
 * commandline. It also groups these tasks into individual steps helpful during
 * development, such as build, package, test, and release.
 *
 * @author Michael Krotscheck
 */
var config = {
    livereload: {
        port: 35729
    }
};

var lrSnippet = require('connect-livereload')(config.livereload);
var mountFolder = function (connect, dir) {
    'use strict';
    return connect.static(require('path').resolve(dir));
};
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;


module.exports = function (grunt) {
    'use strict';

    var dir = {
        source: './src',
        theme: './src/theme',
        test: './test',
        output: './build',
        report: './reports',
        node_modules: './node_modules',
        fontawesome: './node_modules/@fortawesome/fontawesome-free-webfonts'
    };

    var proxies = {
        localhost: {
            context: '/api/v1',
            host: 'localhost',
            port: 8080,
            https: false,
            rewrite: {
                '^/api/v1': '/v1'
            }
        }
    };

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        /**
         * grunt clean
         *
         * Cleans our output directories.
         */
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            dir.report,
                            './cover',
                            dir.output
                        ]
                    }
                ]
            }
        },

        /**
         * grunt gitinfo
         *
         * Gets information about the current state of the source repository.
         */
        gitinfo: {
            options: {
                cwd: '.'
            }
        },

        /**
         * grunt template
         *
         * Interpolate variables into any templates we have defined.
         */
        template: {
            'process-html-template': {
                options: {
                    data: {
                        sha: '<%= gitinfo.local.branch.current.SHA %>'
                    }
                },
                files: {
                    'src/app/pages/template/about.html': [
                        'src/app/pages/template/about.html.tpl'
                    ]
                }
            }
        },

        /**
         * grunt concat
         *
         * Creates a single file out of our javascript source in accordance
         * with the concatenation priority. First the application module, then
         * any dependent module declarations, and finally everything else.
         */
        concat: {
            dist: {
                src: [
                    dir.source + '/app/**/module.js',
                    dir.source + '/app/**/*.js'
                ],
                dest: dir.output + '/js/storyboard.js'
            }
        },

        /**
         * grunt sass
         *
         * Compiles our .scss files into real CSS, and produces a source map
         * to aid debugging.
         */
        sass: {
            options: {
                includePaths: [
                    dir.theme + '/custom/',
                    dir.theme + '/storyboard/',
                    dir.node_modules + '/bootstrap-sass/assets/stylesheets/',
                    dir.node_modules + '/highlightjs/styles',
                    dir.node_modules + '/ng-sortable/dist/',
                    dir.fontawesome + '/scss/'
                ],
                sourceMap: true
            },
            theme: {
                files: {
                    'build/styles/main.css': dir.theme + '/main.scss'
                }
            }
        },

        /**
         * grunt imagemin
         *
         * Runs optimizations on our images and copies them to the dist
         * directory.
         */
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: dir.source + '/images',
                        src: '**/*.{png,jpg,jpeg}',
                        dest: dir.output + '/images'
                    }
                ]
            }
        },

        /**
         * Compile our SVG's into fonts. This is a utility method only which
         * needs to be executed manually.
         */
        webfont: {
            custom_icons: {
                src: dir.source + '/fonts/src/*.svg',
                dest: dir.source + '/fonts',
                destCss: dir.source + '/theme/base',
                options: {
                    font: 'custom_icons',
                    syntax: 'bem',
                    htmlDemo: false,
                    stylesheet: 'css',
                    relativeFontPath: '../../fonts',
                    hashes: false
                }
            }
        },

        /**
         * grunt html2js
         *
         * A convenience method that converts all of the templates found in our
         * project into a single javascript file (mostly by converting them
         * into strings). This presents a tradeoff: All of the HTML layout
         * is loaded up front, which could take a while, but it prevents load
         * lag during application runtime.
         */
        html2js: {
            options: {
                module: 'sb.templates',
                base: dir.source
            },
            main: {
                src: [dir.source + '/app/*/template/**/**.html'],
                dest: dir.output + '/js/templates.js'
            }
        },

        /**
         * grunt copy
         *
         * Copies any as-yet-unprocessed files into the dist directory, as well
         * as pulling any assets from imported libraries to their appropriate
         * locations.
         */
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: dir.source,
                        dest: dir.output,
                        src: [
                            '**/*.{txt,eot,ttf,woff}',
                            '*.html',
                            'robots.txt',
                            'config.json'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: dir.fontawesome + '/webfonts/',
                        dest: dir.output + '/fonts',
                        src: [
                            '*.*'
                        ]
                    },
                    {
                        src: dir.theme + '/storyboard/favicon.ico',
                        dest: dir.output + '/favicon.ico'
                    },
                    {
                        src: dir.theme + '/custom/favicon.ico',
                        dest: dir.output + '/favicon.ico'
                    }
                ]
            },
            draft: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: dir.test + '/draft',
                        dest: dir.output,
                        src: [
                            '*.json'
                        ]
                    }
                ]
            }
        },

        /**
         * @private
         *
         * grunt useminPrepare
         *
         * This task is a configuration builder, used to parse minification
         * annotations in index.html. It's used in our compile step as an
         * dependency concatenator, so that we can easily declare what we
         * need in the index.html file and get all the pieces wrapped up
         * nice and pretty by the script.
         *
         * It will generate configurations for the concat task (the others
         * are explicitly disabled).
         */
        useminPrepare: {
            html: [dir.source + '/index.html'],
            options: {
                flow: {
                    steps: {
                        'js': ['concat'],
                        'css': ['concat']
                    },
                    post: []
                },
                dest: dir.output
            }
        },

        /**
         * grunt useminPrepare cssmin
         *
         * Parses all of the css references in our index.html and minifies them.
         * The configuration for this task is generated by useminPrepare.
         */
        cssmin: {
            minify: {
                expand: true,
                cwd: dir.output + '/styles/',
                src: ['*.css'],
                dest: dir.output + '/styles/'
            }

        },

        /**
         * grunt useminPrepare uglify
         *
         * Performs a minifcation on our concatenated javascript, making sure
         * not to mangle angularjs' injector pattern.
         */
        uglify: {
            options: {
                mangle: false
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: dir.output + '/js',
                        src: '**/*.js',
                        dest: dir.output + '/js'
                    }
                ]
            }
        },

        /**
         * grunt useminPrepare usemin
         *
         * Completes the packaging task by renaming all modified asset
         * references from the previous steps in referencing documents.
         */
        usemin: {
            html: [
                dir.output + '/index.html'
            ],
            css: [
                dir.output + '/styles/**/*.css'
            ],
            options: {
                dirs: [dir.output]
            }
        },

        /**
         * grunt htmlmin
         *
         * The final optimization step, which cleans up our html file and
         * removes extraneous comments, tags, and more.
         */
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    collapseWhitespace: false,
                    collapseBooleanAttributes: false,
                    removeAttributeQuotes: false,
                    removeRedundantAttributes: false,
                    useShortDoctype: false,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true
                },
                files: [
                    {
                        expand: true,
                        cwd: dir.output,
                        src: ['index.html'],
                        dest: dir.output
                    }
                ]
            }
        },


        /**
         * grunt compress
         *
         * Create a tarball containing the build output.
         */
        compress: {
          main: {
            options: {
              archive: 'storyboard-output.tgz',
              mode: 'tgz'
            },
            files: [
              {expand: true, cwd: dir.output, src: ['**/*'], dest: ''}
            ]
          }
        },


        /**
         * grunt watch
         *
         * This task is run with grunt server, in order to automatically update
         * the hosted files that are served via the devserver. The livereload
         * directive will then communicate with the browser and refresh the page
         * when necessary.
         */
        watch: {
            template: {
                files: [
                    dir.source + '/**/*.tpl'
                ],
                tasks: ['compile']
            },
            concat: {
                files: [
                    dir.source + '/app/**/module.js',
                    dir.source + '/app/**/*.js'
                ],
                tasks: ['concat']
            },
            sass: {
                files: [
                    dir.theme + '/**/*.scss'
                ],
                tasks: ['sass:theme']
            },
            copy: {
                files: [
                    dir.source + '/**/*.{ico,txt,eot,ttf,woff}'
                ],
                tasks: ['copy:dist']
            },
            index: {
                files: [
                    dir.source + '/index.html'
                ],
                tasks: ['compile']

            },
            templates: {
                files: [
                    dir.source + '/app/*/template/**/**.html'
                ],
                tasks: ['html2js']
            },
            livereload: {
                options: {
                    livereload: config.livereload.port
                },
                files: [
                    dir.output + '/**/*.*'
                ]
            }
        },

        /**
         * grunt connect
         *
         * The connect plugin hosts a simple web server with our application,
         * either under development or under test.
         */
        connect: {
            options: {
                hostname: grunt.option('hostname') || 'localhost'
            },
            livereload: {
                options: {
                    port: 9000,
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, dir.output),
                            proxySnippet
                        ];
                    }
                },
                proxies: [proxies.localhost]
            },
            dist: {
                options: {
                    port: 9000,
                    keepalive: true,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, dir.output),
                            proxySnippet
                        ];
                    }
                },
                proxies: [proxies.localhost]
            },
            test: {
                options: {
                    port: 9005,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, dir.output),
                            proxySnippet
                        ];
                    }
                },
                proxies: [proxies.localhost]
            }
        },

        /**
         * grunt shell:xvfbStart / grunt shell:xvfbStop
         *
         * Starts and stops a virtual frame buffer.
         */
        shell: {
            xvfbStart: {
                command: 'source ./bin/xvfb.sh start'
            },
            xvfbStop: {
                command: 'source ./bin/xvfb.sh stop'
            }
        },

        /**
         * grunt protractor
         *
         * Protractor is an angular-provided method by which jasmine tests are
         * executed via the selenium web driver. Its goal is to handle browser
         * drive testing, rather than unit or integration testing.
         */
        protractor: {
            options: {
                configFile: './protractor.conf.js',
                keepAlive: true,
                noColor: false,
                args: {
                }
            },
            dist: {},
            integration: {
                options: {
                    configFile: './protractor-integration.conf.js'
                }
            }
        }

    });

    /**
     * Compiles all of our sources.
     */
    grunt.registerTask('compile', [
        'gitinfo',
        'template',
        'useminPrepare',
        'concat',
        'sass',
        'imagemin',
        'html2js',
        'copy:dist',
        'usemin'
    ]);

    /**
     * Package built code into a release package.
     */
    grunt.registerTask('package', [
        'uglify',
        'cssmin',
        'htmlmin',
        'compress'
    ]);

    /**
     * Compile and packages our code.
     */
    grunt.registerTask('build', [
        'compile',
        'package'
    ]);


    /**
     * Compile and packages our code.
     */
    grunt.registerTask('build:draft', [
        'compile',
        'package',
        'copy:draft'
    ]);

    /**
     * This task performs a full build of our application, and then runs that
     * source in a local web server. It does no watching, it simply hosts the
     * files.
     */
    grunt.registerTask('serve:dist', [
        'clean',
        'compile',
        'package',
        'configureProxies:dist',
        'connect:dist'
    ]);

    /**
     * Development server - runs a build and sets up concurrent watchers that
     * will automatically lint, test, and refresh
     * the code when a change is detected.
     */
    grunt.registerTask('serve', [
        'clean',
        'compile',
        'configureProxies:livereload',
        'connect:livereload',
        'watch'
    ]);

    /**
     * grunt test:integration
     *
     * This command will create a clean build against which our integration
     * tests will be run.
     */
    grunt.registerTask('test:integration', [
        'clean',
        'compile',
        'configureProxies:test',
        'connect:test',
        'protractor:integration'
    ]);

    /**
     * grunt test:functional
     *
     * This command will create a clean build against which our functional
     * tests will be run. For more information, please see
     * protractor.conf.js
     */
    grunt.registerTask('test:functional', [
        'clean',
        'compile',
        'connect:test',
        'protractor'
    ]);
};
