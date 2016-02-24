/*
 * Copyright (c) 2016 Codethink Limited
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
 * The StoryBoard due dates submodule handles the creation of task and story
 * due dates.
 */
angular.module('sb.due_date', ['ui.router', 'sb.services', 'sb.util',
                               'ui.bootstrap'])
    .config(function ($stateProvider, $urlRouterProvider) {
        'use strict';

        // URL Defaults.
        $urlRouterProvider.when('/due_date', '/due_date/list');

        // Set our page routes.
        $stateProvider
            .state('sb.due_date', {
                abstract: true,
                url: '/due_date',
                template: '<div ui-view></div>'
            })
            .state('sb.due_date.detail', {
                url: '/{dueDateID:[0-9]+}',
                controller: 'DueDateDetailController',
                templateUrl: 'app/due_dates/template/detail.html'
            });
    });
