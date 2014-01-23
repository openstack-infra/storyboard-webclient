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
 * The Storyboard team submodule handles most activity surrounding the
 * creation and management of project teams.
 */
angular.module('sb.teams', ['ui.router', 'sb.services', 'sb.util'])
    .config(function ($stateProvider, $urlRouterProvider) {
        'use strict';

        // URL Defaults.
        $urlRouterProvider.when('/teams', '/teams/list');

        // Set our page routes.
        $stateProvider
            .state('teams', {
                abstract: true,
                url: '/teams',
                template: '<div ui-view></div>'
            })
            .state('teams.list', {
                url: '/list',
                templateUrl: 'app/templates/teams/list.html',
                controller: 'TeamsListController'
            });
    });
