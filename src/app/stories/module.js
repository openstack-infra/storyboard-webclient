/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 * Copyright (c) 2017 Adam Coldrick
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
angular.module('sb.story', ['ui.router', 'sb.services', 'sb.util',
    'ui.bootstrap'])
    .config(function ($stateProvider, $urlRouterProvider, PreferenceProvider,
                      TimelineEventTypes, SessionResolver) {
        'use strict';

        // URL Defaults.
        $urlRouterProvider.when('/story', '/story/list');

        var queryParams = 'q&status&tags&project_group_id&'
            + 'project_id&assignee_id';

        var creationParams = 'title&description&project_id&'
            + 'private&force_private&tags&team_id&user_id';

        // Set our page routes.
        $stateProvider
            .state('sb.story', {
                abstract: true,
                url: '/story',
                template: '<div ui-view></div>'
            })
            .state('sb.story.list', {
                url: '/list?' + queryParams,
                params: {
                    'status': 'active'
                },
                templateUrl: 'app/stories/template/list.html',
                controller: 'StoryListController'
            })
            .state('sb.story.detail', {
                url: '/{storyId:[0-9]+}',
                templateUrl: 'app/stories/template/detail.html',
                controller: 'StoryDetailController',
                resolve: {
                    story: function (Story, $stateParams) {
                        // Pre-resolve the story.
                        return Story.get({
                            id: $stateParams.storyId
                        }).$promise;
                    },
                    creator: function (story, User) {
                        // Pre-resolve the creator after the story has been
                        // resolved.
                        if (!story.creator_id) {
                            return {};
                        } else {
                            return User.get({
                                id: story.creator_id
                            }).$promise;
                        }
                    },
                    tasks: function (Task, $stateParams) {
                        return Task.browse({
                            story_id: $stateParams.storyId
                        }).$promise;
                    },
                    currentUser: function (CurrentUser, Session) {
                        var user = Session.resolveSessionState()
                            .then(function() {
                                if (Session.isLoggedIn()) {
                                    return CurrentUser.resolve();
                                }
                                return {};
                            });
                        return user;
                    },
                    worklists: function(Worklist, $stateParams, CurrentUser) {
                        var userPromise = CurrentUser.resolve();

                        return userPromise.then(function(user) {
                            return Worklist.browse({
                                story_id: $stateParams.storyId,
                                subscriber_id: user.id,
                                hide_lanes: ''
                            }).$promise;
                        }, function() {
                            return [];
                        });
                    }
                }
            })
            .state('sb.story.new', {
                url: '/new?' + creationParams,
                templateUrl: 'app/stories/template/new_page.html',
                controller: 'StoryNewController',
                resolve: {
                    isLoggedIn: SessionResolver.requireLoggedIn,
                    currentUser: SessionResolver.requireCurrentUser
                }
            });

        // Register a preference for filtering timeline events.
        // By default all types of events should be displayed.

        TimelineEventTypes.forEach(function (type) {
            PreferenceProvider.addPreference('display_events_' + type, 'true');
        });
    });
