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
        'sb.auth', 'sb.story', 'sb.profile', 'sb.notification', 'sb.search',
        'sb.admin', 'sb.subscription', 'sb.project_group', 'sb.worklist',
        'sb.board', 'sb.due_date', 'ui.router', 'ui.bootstrap',
        'monospaced.elastic', 'angularMoment', 'angular-data.DSCacheFactory',
        'viewhead', 'ngSanitize', 'as.sortable'])
    .constant('angularMomentConfig', {
        preprocess: 'utc',
        timezone: 'UTC'
    })
    .config(function ($urlRouterProvider, $locationProvider, $httpProvider,
                      msdElasticConfig, $stateProvider, SessionResolver,
                      PreferenceResolver) {
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

        // Create a root state (named 'sb') that will not resolve until
        // necessary application data has been loaded.
        $stateProvider
            .state('sb', {
                abstract: true,
                url: '',
                template: '<div ui-view></div>',
                resolve: {
                    sessionState: SessionResolver.resolveSessionState,
                    preferences: PreferenceResolver.resolvePreferences
                }
            });
    })
    .run(function ($log, $rootScope, $document) {
        'use strict';

        var resolvingClassName = 'resolving';
        var body = $document.find('body');

        // Apply a global class to the application when we're in the middle of
        // a state resolution, as well as a global scope variable that UI views
        // can switch on.
        $rootScope.$on('$stateChangeStart', function () {
            body.addClass(resolvingClassName);
            $rootScope.isResolving = true;
        });
        $rootScope.$on('$stateChangeSuccess', function () {
            body.removeClass(resolvingClassName);
            $rootScope.isResolving = false;
        });
        $rootScope.$on('$stateChangeError', function () {
            body.removeClass(resolvingClassName);
            $rootScope.isResolving = false;
        });
    })
    .run(function ($log, $rootScope, $state) {
        'use strict';

        // Listen to changes on the root scope. If it's an error in the state
        // changes (i.e. a 404) take the user back to the index.
        $rootScope.$on('$stateChangeError',
            function () {
                $state.go('sb.index');
            });
    })
    .run(function ($http, DSCacheFactory) {
        'use strict';

        DSCacheFactory.createCache('defaultCache', {
            // Items added to this cache expire after 1 minute.
            maxAge: 60000,
            // Items will be deleted from this cache only on check.
            deleteOnExpire: 'passive'
        });

        $http.defaults.cache = DSCacheFactory.get('defaultCache');
    });
