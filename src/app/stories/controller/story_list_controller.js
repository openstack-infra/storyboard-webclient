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
    function ($scope, $state, Criteria, NewStoryService,
             SubscriptionList, CurrentUser, $stateParams, $filter, $q,
             Tags, User, Project, ProjectGroup) {
        'use strict';

        // search results must be of type "story"
        $scope.resourceTypes = ['Story'];

        // Search result criteria default must be "active"
        $scope.defaultCriteria = [];

        if ($stateParams.q) {
            $scope.defaultCriteria.push(
                Criteria.create('Text', $stateParams.q)
            );
        }
        if ($stateParams.status) {
            $scope.defaultCriteria.push(
                Criteria.create('StoryStatus', $stateParams.status,
                                $filter('capitalize')($stateParams.status))
            );
        }
        if ($stateParams.tags) {
            $scope.defaultCriteria.push(
                Criteria.create('Tags', $stateParams.tags, $stateParams.tags)
            );
        }
        if ($stateParams.assignee_id) {
            User.get({'id': $stateParams.assignee_id}).$promise
                .then(function(result) {
                    $scope.defaultCriteria.push(
                        Criteria.create('User', $stateParams.assignee_id,
                                        result.full_name)
                    );
                }
            );
        }
        if ($stateParams.project_id) {
            Project.get({'id': $stateParams.project_id}).$promise
                .then(function(result) {
                    $scope.defaultCriteria.push(
                        Criteria.create('Project', $stateParams.project_id,
                                        result.name)
                    );
                }
            );
        }
        if ($stateParams.project_group_id) {
            ProjectGroup.get({'id': $stateParams.project_group_id}).$promise
                .then(function(result) {
                    $scope.defaultCriteria.push(
                        Criteria.create('ProjectGroup',
                                        $stateParams.project_group_id,
                                        result.title)
                    );
                }
            );
        }

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

        //GET list of subscriptions
        var cuPromise = CurrentUser.resolve();

        cuPromise.then(function(user){
            $scope.storySubscriptions = SubscriptionList.subsList(
                'story', user);
        });
    });
