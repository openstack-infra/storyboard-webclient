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
 * The StoryBoard project group submodule handles most activity involving
 * searching for and reviewing project groups. Administration of project groups
 * has moved from the admin module.
 */
angular.module('sb.project_group',
    ['ui.router', 'sb.services', 'sb.util', 'sb.auth'])
    .config(function ($stateProvider, $urlRouterProvider, PermissionResolver) {
        'use strict';

        // Routing Defaults.
        $urlRouterProvider.when('/project_group', '/project_group/list');

        // Set our page routes.
        $stateProvider
            .state('sb.project_group', {
                abstract: true,
                url: '/project_group',
                template: '<div ui-view></div>',
                resolve: {
                    isSuperuser: PermissionResolver
                        .resolvePermission('is_superuser', true)
                }
            })
            .state('sb.project_group.list', {
                url: '/list',
                templateUrl: 'app/project_group/template/list.html',
                controller: 'ProjectGroupListController'
            })
            .state('sb.project_group.detail', {
                url: '/{id:[0-9]+}',
                templateUrl: 'app/project_group/template/detail.html',
                controller: 'ProjectGroupDetailController',
                resolve: {
                    projectGroup: function ($stateParams, ProjectGroup, $q) {
                        var deferred = $q.defer();

                        ProjectGroup.get({id: $stateParams.id},
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                                deferred.reject(error);
                            });
                        return deferred.promise;
                    }
                }
            })
            .state('sb.project_group.edit', {
                url: '/{id:[0-9]+}/edit',
                templateUrl: 'app/project_group/template/edit.html',
                controller: 'ProjectGroupEditController',
                resolve: {
                    projectGroup: function ($stateParams, ProjectGroup) {
                        return ProjectGroup.get({id: $stateParams.id}).$promise;
                    },
                    projects: function ($stateParams, ProjectGroupItem) {
                        return ProjectGroupItem.browse(
                            {projectGroupId: $stateParams.id}
                        ).$promise;
                    },
                    isSuperuser: PermissionResolver
                        .requirePermission('is_superuser', true)
                }
        });
    });
