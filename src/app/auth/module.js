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
 * This Storyboard module contains our adaptive authentication and authorization
 * logic.
 *
 * @author Michael Krotscheck
 */
angular.module('sb.auth',
        [ 'sb.services', 'sb.templates', 'ui.router', 'sb.util']
    )
    .config(function ($stateProvider, $urlRouterProvider) {
        'use strict';

        // Default rerouting.
        $urlRouterProvider.when('/auth/login', '/login');

        // Declare the states for this module.
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/templates/auth/provider/login.html',
                controller: 'AuthLoginController'
            })
            .state('code', {
                url: '/auth/code',
                controller: 'AuthCodeController'
            })
            .state('token', {
                url: '/auth/token',
                controller: 'AuthTokenController'
            });
    });