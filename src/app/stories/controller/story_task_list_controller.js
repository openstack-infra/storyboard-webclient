/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * Controller that provides methods that allow editing of a story.
 */
angular.module('sb.story').controller('StoryTaskListController',
    function ($log, $scope, $state, $stateParams, Task) {
        'use strict';

        // Parse the ID
        var id = $stateParams.hasOwnProperty('storyId') ?
            parseInt($stateParams.storyId, 10) :
            null;

        /**
         * The current list of tasks
         */
        $scope.tasks = [];

        /**
         * Display toggle for the add task form.
         *
         * @TODO(krotscheck) Remove, we're not using this interface pattern
         * anywhere else. Should probably be a modal...?
         */
        $scope.showAddTaskForm = false;

        /**
         * The new task for the task form.
         */
        $scope.newTask = new Task({ story_id: id });

        /**
         * UI flag for when we're initially loading the view.
         *
         * @type {boolean}
         */
        $scope.isLoading = true;

        /**
         * Any error objects returned from the services.
         *
         * @type {{}}
         */
        $scope.error = {};

        /**
         * Loads the tasks for this story
         */
        $scope.loadTasks = function() {
            $scope.tasks = [];

            Task.browse(
                {story_id: id},
                function (result) {
                    $scope.tasks = result;
                },
                function (error) {
                    // We've encountered an error.
                    $scope.error = error;
                    $scope.isLoading = false;
                    $scope.isUpdating = false;
                }
            );
        };

        /**
         * Adds a task.
         */
        $scope.addTask = function () {
            $scope.newTask.$save(function (savedTask) {
                $scope.tasks.push(savedTask);
                $scope.newTask = new Task({story_id: id});
                $scope.$parent.loadEvents();
                $scope.showAddTaskForm = false;
            });
        };

        $scope.disableAssigneeInTasks = function() {
            // first hide all assignee inputs
            for (var i=0;i<$scope.tasks.length;i++)
            {
                var task = $scope.tasks[i];
                task.showAssigneeForm = false;
            }
        };

        // Initialize our view
        $scope.loadTasks();

    });
