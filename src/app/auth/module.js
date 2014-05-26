/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
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

/**
 * This Storyboard module contains our authentication and authorization logic.
 */
angular.module('sb.auth', [ 'sb.services', 'sb.templates', 'ui.router',
        'sb.util', 'LocalStorageModule']
    )
    .config(function ($stateProvider, SessionResolver) {
        'use strict';

        // Declare the states for this module.
        $stateProvider
            .state('auth', {
                abstract: true,
                template: '<div ui-view></div>',
                url: '/auth'
            })
            .state('auth.authorize', {
                url: '/authorize?error&error_description',
                templateUrl: 'app/templates/auth/busy.html',
                controller: 'AuthAuthorizeController',
                resolve: {
                    isLoggedOut: SessionResolver.requireLoggedOut
                }
            })
            .state('auth.deauthorize', {
                url: '/deauthorize',
                templateUrl: 'app/templates/auth/busy.html',
                controller: 'AuthDeauthorizeController',
                resolve: {
                    isLoggedIn: SessionResolver.requireLoggedIn
                }
            })
            .state('auth.token', {
                url: '/token?code&state&error&error_description',
                templateUrl: 'app/templates/auth/busy.html',
                controller: 'AuthTokenController',
                resolve: {
                    isLoggedOut: SessionResolver.requireLoggedOut
                }
            })
            .state('auth.error', {
                url: '/error?error&error_description',
                templateUrl: 'app/templates/auth/error.html',
                controller: 'AuthErrorController'
            });
    })
    .run(function ($rootScope, $interval, SessionState, Session,
                   PermissionManager, RefreshManager) {
        'use strict';

        // Initialize our permission manager.
        PermissionManager.initialize();

        // Always record the logged in state on the root scope.
        $rootScope.$on(SessionState.LOGGED_IN, function () {
            $rootScope.isLoggedIn = Session.isLoggedIn();
        });
        $rootScope.$on(SessionState.LOGGED_OUT, function () {
            $rootScope.isLoggedIn = Session.isLoggedIn();
        });

        var refreshAttemptsDelay = 1800 * 1000;
        var refreshPromise = $interval(RefreshManager.tryRefresh,
                                       refreshAttemptsDelay);

        $rootScope.$on('$destroy', function() {
            $interval.cancel(refreshPromise);
        });
    });