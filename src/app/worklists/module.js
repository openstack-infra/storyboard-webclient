/**
 * Copyright (c) 2015 Codethink Limited
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
 * The StoryBoard story submodule handles most activity surrounding the
 * creation and management of stories, their tasks, and comments.
 */
angular.module('sb.worklist',
              ['ui.router', 'sb.services', 'sb.util',
    'ui.bootstrap'])
    .config(function ($stateProvider, $urlRouterProvider) {
        'use strict';

        // URL Defaults.
        $urlRouterProvider.when('/worklist', '/worklist/list');

        // Set our page routes.
        $stateProvider
            .state('sb.worklist', {
                abstract: true,
                url: '/worklist',
                template: '<div ui-view></div>'
            })
            .state('sb.worklist.detail', {
                url: '/{worklistID:[0-9]+}',
                controller: 'WorklistDetailController',
                templateUrl: 'app/worklists/template/detail.html',
                resolve: {
                    worklist: function (Worklist, $stateParams) {
                        // Pre-resolve the worklist.
                        return Worklist.get({
                            id: $stateParams.worklistID
                        }).$promise;
                    },
                    permissions: function(Worklist, $stateParams) {
                        // Pre-resolve the permissions.
                        return Worklist.Permissions.get({
                            id: $stateParams.worklistID
                        }).$promise;
                    }
                }
            });
    });
