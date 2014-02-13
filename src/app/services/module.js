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

/**
 * The Storyboard Services module contains all of the necessary API resources
 * used by the storyboard client. Its resources are available via injection to
 * any module that declares it as a dependency.
 *
 * @author Michael Krotscheck
 */
angular.module('sb.services',
        ['ngResource', 'ui.router', 'sb.templates', 'sb.util',
            'LocalStorageModule'])
    .config(function ($stateProvider, $urlRouterProvider) {
        'use strict';

        // Default rerouting.
        $urlRouterProvider.when('/auth/login', '/login');
        $urlRouterProvider.when('/auth/logout', '/logout');

        // Declare the states for this module.
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/templates/auth/provider/login.html',
                resolve: {
                    data: function(authService) {
                        authService.loginHandler();
                    }
                }
            })
            .state('logout', {
                url: '/logout',
                resolve: {
                    data: function(authService) {
                        authService.logoutHandler();
                    }
                }
            })
            .state('code', {
                url: '/auth/code',
                resolve: {
                    data: function(authService) {
                        authService.authCodeHandler();
                    }
                }
            })
            .state('token', {
                url: '/auth/token',
                resolve: {
                    data: function(authService) {
                        authService.tokenHandler();
                    }
                }
            });
    }
);