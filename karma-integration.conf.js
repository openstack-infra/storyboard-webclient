/*
 * Copyright (c) 2013 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

module.exports = function (config) {
    'use strict';

    config.set({

        port: 9877,

        basePath: '',

        frameworks: ['jasmine'],

        plugins: [
            'karma-coverage',
            'karma-jasmine',
            'karma-html-reporter',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-firefox-launcher'
        ],

        files: [
            './dist/js/libs.js',
            './bower_components/angular-mocks/angular-mocks.js',
            './dist/js/storyboard.js',
            './dist/js/templates.js',
            './test/unit/**/*.js'
        ],

        exclude: [
        ],

        singleRun: true,

        reporters: ['dots', 'progress', 'coverage', 'html'],

        colors: false,

        browsers: [ 'PhantomJS', 'Firefox' ],

        preprocessors: {
            './dist/js/storyboard.js': ['coverage']
        },

        coverageReporter: {
            type: 'html',
            dir: './cover/integration/'
        },

        htmlReporter: {
            outputDir: './reports/integration',
            templatePath: './node_modules' +
                '/karma-html-reporter/jasmine_template.html'
        }
    });
};