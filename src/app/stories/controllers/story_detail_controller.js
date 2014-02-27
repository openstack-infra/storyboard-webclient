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
 * Story detail &  manipulation controller.
 */
angular.module('sb.story').controller('StoryDetailController',
    function ($scope, $state, $stateParams, Story, Task, Project) {
        'use strict';

        // Parse the ID
        var id = $stateParams.hasOwnProperty('storyId') ?
            parseInt($stateParams.storyId, 10) :
            null;

        /**
         * The story we're manipulating right now.
         */
        $scope.story = {};
        $scope.tasks = [];
        $scope.newTask = new Task({
            story_id: id
        });
        $scope.projects = Project.query({});

        /**
         * UI flag for when we're initially loading the view.
         *
         * @type {boolean}
         */
        $scope.isLoading = true;

        /**
         * UI view for when a change is round-tripping to the server.
         *
         * @type {boolean}
         */
        $scope.isUpdating = false;

        /**
         * Any error objects returned from the services.
         *
         * @type {{}}
         */
        $scope.error = {};

        /**
         * Generic service error handler. Assigns errors to the view's scope,
         * and unsets our flags.
         */
        function handleServiceError(error) {
            // We've encountered an error.
            $scope.error = error;
            $scope.isLoading = false;
            $scope.isUpdating = false;
        }

        /**
         * Loads the tasks for this story
         */
        function loadTasks() {
            $scope.tasks = [];

            Task.query(
                {story_id: id},
                function (result) {
                    $scope.tasks = result;
                },
                handleServiceError
            );
        }

        // Sanity check, do we actually have an ID? (zero is falsy)
        if (!id && id !== 0) {
            // We should never reach this, however that logic lives outside
            // of this controller which could be unknowningly refactored.
            $scope.error = {
                error: true,
                error_code: 404,
                error_message: 'You did not provide a valid ID.'
            };
            $scope.isLoading = false;
        } else {
            // We've got an ID, so let's load it...
            Story.read(
                {'id': id},
                function (result) {
                    // We've got a result, assign it to the view and unset our
                    // loading flag.
                    $scope.story = result;
                    console.warn(result);
                    $scope.newTask.project_id = result.project_id;
                    $scope.isLoading = false;
                },
                handleServiceError
            );

            loadTasks();
        }

        /**
         * Adds a task.
         */
        $scope.addTask = function () {
            $scope.newTask.$save(function () {
                loadTasks();
                $scope.newTask = new Task();
            });
        };


        /**
         * Scope method, invoke this when you want to update the project.
         */
        $scope.update = function () {
            // Set our progress flags and clear previous error conditions.
            $scope.isUpdating = true;
            $scope.error = {};

            // Invoke the save method and wait for results.
            $scope.story.$update(
                function (result) {
                    // Unset our loading flag and navigate to the detail view.
                    $scope.isUpdating = false;
                    $state.go('story.detail.overview', {storyId: result.id});
                },
                handleServiceError
            );
        };
    });
