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
angular.module('sb.story', ['ui.router', 'sb.services', 'sb.util',
    'ui.bootstrap'])
    .config(function ($stateProvider, $urlRouterProvider, PreferenceProvider,
            TimelineEventTypes) {
        'use strict';

        // URL Defaults.
        $urlRouterProvider.when('/story', '/story/list');

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
                templateUrl: 'app/templates/story/detail.html'
            });

        // Register a preference for filtering timeline events.
        // By default all types of events should be displayed.

        var events_filter_defaults = {};
        TimelineEventTypes.forEach(function(type) {
            events_filter_defaults[type] = true;
        });

        PreferenceProvider.addPreference('display_events_filter',
                                         events_filter_defaults);
    });
