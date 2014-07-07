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
angular.module('sb.admin', [ 'sb.services', 'sb.templates', 'ui.router'])
    .config(function ($stateProvider, $urlRouterProvider, PermissionResolver) {
        'use strict';

        // Routing Defaults.
        $urlRouterProvider.when('/admin', '/admin/index');

        // Declare the states for this module.
        $stateProvider
            .state('admin', {
                abstract: true,
                template: '<div ui-view></div>',
                url: '/admin',
                resolve: {
                    isSuperuser: PermissionResolver
                        .requirePermission('is_superuser', true)
                }
            })
            .state('admin.index', {
                url: '/index',
                templateUrl: 'app/admin/template/index.html'
            });
    });