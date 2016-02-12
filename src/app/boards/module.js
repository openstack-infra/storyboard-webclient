/*
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
 * The StoryBoard board submodule handles the creation and usage of
 * kanban-style boards.
 */
angular.module('sb.board', ['ui.router', 'sb.services', 'sb.util',
    'ui.bootstrap'])
    .config(function ($stateProvider, $urlRouterProvider) {
        'use strict';

        // URL Defaults.
        $urlRouterProvider.when('/board', '/board/list');

        // Set our page routes.
        $stateProvider
            .state('sb.board', {
                abstract: true,
                url: '/board',
                template: '<div ui-view></div>'
            })
            .state('sb.board.detail', {
                url: '/{boardID:[0-9]+}',
                controller: 'BoardDetailController',
                templateUrl: 'app/boards/template/detail.html'
            })
            .state('sb.board.list', {
                url: '/list',
                controller: 'BoardsListController',
                templateUrl: 'app/boards/template/list.html'
            });
    });
