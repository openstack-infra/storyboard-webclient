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
 * The Storyboard story submodule handles most activity surrounding the
 * creation and management of stories, their tasks, and comments.
 */
angular.module('sb.story', ['ui.router', 'sb.services', 'sb.util'])
    .config(function ($stateProvider, $urlRouterProvider) {
        'use strict';

        // URL Defaults.
        $urlRouterProvider.when('/story', '/story/list');
        $urlRouterProvider.when('/story/{id:[0-9]+}',
            function ($match) {
                return '/story/' + $match.id + '/overview';
            });
        $urlRouterProvider.when('/story/{storyId:[0-9]+}/task',
            function ($match) {
                return '/story/' + $match.storyId + '/overview';
            });
        $urlRouterProvider.when('/story/{storyId:[0-9]+}/task/{taskId:[0-9]+}',
            function ($match) {
                return '/story/' + $match.storyId +
                    '/task/' + $match.taskId;
            });

        // Set our page routes.
        $stateProvider
            .state('story', {
                abstract: true,
                url: '/story',
                template: '<div ui-view></div>'
            })
            .state('story.list', {
                url: '/list',
                templateUrl: 'app/templates/story/list.html',
                controller: 'StoryListController'
            })
            .state('story.detail', {
                url: '/{storyId:[0-9]+}',
                abstract: true,
                templateUrl: 'app/templates/story/detail.html'
            })
            .state('story.detail.overview', {
                url: '/overview',
                templateUrl: 'app/templates/story/overview.html'
            })
            .state('story.detail.edit', {
                url: '/edit',
                templateUrl: 'app/templates/story/edit.html'
            })
            .state('story.detail.delete', {
                url: '/delete',
                templateUrl: 'app/templates/story/delete.html'
            });
    });
