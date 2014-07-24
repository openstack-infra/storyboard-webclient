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
angular.module('sb.profile',
        ['sb.services', 'sb.templates', 'sb.auth', 'ui.router', 'ui.bootstrap']
    )
    .config(function ($stateProvider, SessionResolver, $urlRouterProvider) {
        'use strict';

        // URL Defaults.
        $urlRouterProvider.when('/profile', '/profile/preferences');

        // Declare the states for this module.
        $stateProvider
            .state('profile', {
                abstract: true,
                url: '/profile',
                resolve: {
                    isLoggedIn: SessionResolver.requireLoggedIn,
                    currentUser: SessionResolver.requireCurrentUser
                },
                views : {
                    'submenu@': {
                        templateUrl: 'app/profile/template/profile_submenu.html'
                    },
                    '@': {
                        template: '<div ui-view></div>'
                    }
                }
            })
            .state('profile.preferences', {
                url: '/preferences',
                templateUrl: 'app/profile/template/preferences.html',
                controller: 'ProfilePreferencesController'
            });
    });