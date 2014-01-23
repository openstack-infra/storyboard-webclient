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
 * The Storyboard project_group submodule handles most activity surrounding the
 * creation and management of project_groups.
 */
angular.module('sb.project_groups', ['ui.router', 'sb.services', 'sb.util'])
    .config(function ($stateProvider, $urlRouterProvider) {
        'use strict';

        // URL Defaults.
        $urlRouterProvider.when('/project_groups', '/project_groups/list');

        // Set our page routes.
        $stateProvider
            .state('project_groups', {
                abstract: true,
                url: '/project_groups',
                template: '<div ui-view></div>'
            })
            .state('project_groups.list', {
                url: '/list',
                templateUrl: 'app/templates/project_groups/list.html',
                controller: 'ProjectGroupListController'
            })
            .state('project_groups.edit', {
                url: '/{id:[0-9]+}/edit',
                templateUrl: 'app/templates/project_groups/edit.html',
                controller: 'ProjectGroupDetailController'
            })
            .state('project_groups.detail', {
                url: '/{id:[0-9]+}',
                templateUrl: 'app/templates/project_groups/detail.html',
                controller: 'ProjectGroupDetailController'
            })
            .state('project_groups.new', {
                url: '/new',
                templateUrl: 'app/templates/project_groups/new.html',
                controller: 'ProjectGroupNewController'
            });
    });
