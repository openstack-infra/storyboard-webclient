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
 * Controller for our story list.
 */
angular.module('sb.story').controller('StoryListController',
    function ($scope, $state, NewStoryService, Criteria, CurrentUser, Session, Subscription) {
        'use strict';

        /**
        * When we start, create a promise for the current user.
        */
        var cuPromise = CurrentUser.resolve();

        /**
        * The current user.
        *
        * @param currentUser
        */

        $scope.currentUser = null;
            cuPromise.then(function (user) {
                $scope.currentUser = user;
            });


        $scope.subscriptions = [];

        if (!Session.isLoggedIn()) {
            $scope.subscriptions = null;
        }
        else {
            cuPromise.then(
                function(user) {
                    $scope.subscriptions = Subscription.browse({
                        user_id: user.id,
                        target_type: 'story',
                        limit: 100
                    });
                }
            );
        }


        // search results must be of type "story"
        $scope.resourceTypes = ['Story'];

        // Search result criteria default must be "active"
        $scope.defaultCriteria = [
            Criteria.create('StoryStatus', 'active', 'Active')
        ];

        /**
         * Creates a new story.
         */
        $scope.newStory = function () {
            NewStoryService.showNewStoryModal()
                .then(function (story) {
                    // On success, go to the story detail.
                    $state.go('sb.story.detail', {storyId: story.id});
                }
            );
        };
    });
