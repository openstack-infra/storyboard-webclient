/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * The StoryBoard root application module.
 *
 * This module contains the entire, standalone application for the StoryBoard
 * ticket tracking web client.
 *
 * @author Michael Krotscheck
 */
angular.module('storyboard',
    [ 'sb.services', 'sb.templates', 'sb.dashboard', 'sb.pages', 'sb.projects',
        'sb.auth', 'sb.story', 'sb.profile', 'ui.router', 'ui.bootstrap',
        'monospaced.elastic', 'angularMoment'])
    .constant('angularMomentConfig', {
        preprocess: 'utc',
        timezone: 'UTC',
    })
    .config(function ($provide, $urlRouterProvider, $locationProvider,
                      $httpProvider, msdElasticConfig) {
        'use strict';

        // Default URL hashbang route
        $urlRouterProvider.otherwise('/');

        // Override the hash prefix for Google's AJAX crawling.
        $locationProvider.hashPrefix('!');

        // Attach common request headers out of courtesy to the API
        $httpProvider.defaults.headers.common['X-Client'] = 'StoryBoard';

        // Globally set an additional amount of whitespace to the end of our
        // textarea elastic resizing.
        msdElasticConfig.append = '\n';
    })
    .run(function ($log, $rootScope, $state) {
        'use strict';

        // Listen to changes on the root scope. If it's an error in the state
        // changes (i.e. a 404) take the user back to the index.
        $rootScope.$on('$stateChangeError',
            function () {
                $state.go('index');
            });
    });
