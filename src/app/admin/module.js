/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * The StoryBoard administration module.
 */
angular.module('sb.admin', [ 'sb.services', 'sb.templates', 'sb.util',
    'ui.router'])
    .config(function ($stateProvider, $urlRouterProvider, PermissionResolver) {
        'use strict';

        // Routing Defaults.
        $urlRouterProvider.when('/admin', '/admin/project_group');

        // Declare the states for this module.
        $stateProvider
            .state('admin', {
                abstract: true,
                views: {
                    'submenu@': {
                        templateUrl: 'app/admin/template/admin_submenu.html'
                    },
                    '@': {
                        template: '<div ui-view></div>'
                    }
                },
                url: '/admin',
                resolve: {
                    isSuperuser: PermissionResolver
                        .requirePermission('is_superuser', true)
                }
            })
            .state('admin.project_group', {
                url: '/project_group',
                templateUrl: 'app/admin/template/project_group.html',
                controller: 'ProjectGroupAdminController'
            })
            .state('admin.project_group_edit', {
                url: '/project_group/:id',
                templateUrl: 'app/admin/template/project_group_edit.html',
                controller: 'ProjectGroupEditController',
                resolve: {
                    projectGroup: function ($stateParams, ProjectGroup) {
                        return ProjectGroup.get({id: $stateParams.id}).$promise;
                    },
                    projects: function ($stateParams, ProjectGroupItem) {
                        return ProjectGroupItem.query(
                            {projectGroupId: $stateParams.id}
                        ).$promise;
                    }
                }
            });
    });