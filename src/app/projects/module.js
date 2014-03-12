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
 * The Storyboard project submodule handles most activity surrounding the
 * creation and management of projects.
 */
angular.module('sb.projects',
        ['ui.router', 'sb.services', 'sb.util', 'sb.auth'])
    .config(function ($stateProvider, $urlRouterProvider, SessionResolver,
                      PermissionResolver) {
        'use strict';

        // Routing Defaults.
        $urlRouterProvider.when('/project', '/project/list');
        $urlRouterProvider.when('/project/{id:[0-9]+}',
            function ($match) {
                return '/project/' + $match.id + '/overview';
            });

        // Set our page routes.
        $stateProvider
            .state('project', {
                abstract: true,
                url: '/project',
                template: '<div ui-view></div>'
            })
            .state('project.list', {
                url: '/list',
                templateUrl: 'app/templates/project/list.html',
                controller: 'ProjectListController'
            })
            .state('project.detail', {
                abstract: true,
                url: '/{id:[0-9]+}',
                templateUrl: 'app/templates/project/detail.html',
                controller: 'ProjectDetailController'
            })
            .state('project.detail.overview', {
                url: '/overview',
                templateUrl: 'app/templates/project/overview.html'
            })
            .state('project.detail.edit', {
                url: '/edit',
                templateUrl: 'app/templates/project/edit.html',
                resolve: {
                    isLoggedIn: SessionResolver.requireLoggedIn,
                    isSuperuser: PermissionResolver
                        .requirePermission('is_superuser', true)
                }
            }).
            state('project.detail.delete', {
                url: '/delete',
                templateUrl: 'app/templates/project/delete.html',
                resolve: {
                    isLoggedIn: SessionResolver.requireLoggedIn,
                    isSuperuser: PermissionResolver
                        .requirePermission('is_superuser', true)
                }
            })
            .state('project.detail.stories', {
                url: '/stories',
                templateUrl: 'app/templates/project/stories.html',
                controller: 'ProjectStoryListController'
            })
            .state('project.new', {
                url: '/new',
                templateUrl: 'app/templates/project/new.html',
                controller: 'ProjectNewController',
                resolve: {
                    isLoggedIn: SessionResolver.requireLoggedIn,
                    isSuperuser: PermissionResolver
                        .requirePermission('is_superuser', true)
                }
            });
    })
;
