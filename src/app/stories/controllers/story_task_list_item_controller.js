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
angular.module('sb.story').controller('StoryTaskListItemController',
    function ($scope, $state, $modal, Project, Session, Task, User,
              CurrentUser) {
        'use strict';

        var projectId = $scope.task.project_id || null;
        var currentUser = null;

        // Resolve the current user.
        CurrentUser.resolve().then(function (user) {
            currentUser = user;
        });

        if (!!projectId) {
            Project.get({id: projectId},
                function (project) {
                    $scope.project = project;
                }, function () {
                    $scope.project = null;
                });
        }

        /**
         * Load the assignee.
         */
        $scope.loadAssignee = function () {
            if (!!$scope.task.assignee_id) {
                User.get({id: $scope.task.assignee_id},
                    function (assignee) {
                        $scope.assignee = assignee;
                    }, function () {
                        $scope.assignee = null;
                    });
            } else {
                $scope.assignee = null;
            }
        };

        /**
         * Updates this task's status
         */
        $scope.updateStatus = function (status) {
            $scope.task.status = status;

            switch (status) {
                case 'inprogress':
                case 'review':
                    // If you're moving something into inprogress or review,
                    // and it's _not_ assigned, it's assumed that you'll be
                    // working on it. This is different from being reviewer.
                    if (!$scope.task.assignee_id && !!currentUser) {
                        $scope.task.assignee_id = currentUser.id;
                    }
                    break;
                case 'merged':
                case 'invalid':
                    // merged and invalid tasks are automatically unassigned.
                    $scope.task.assignee_id = null;
                    break;
            }

            $scope.task.$update();
            $scope.loadAssignee();
        };

        /**
         * UI Toggle for when the edit form should be displayed.
         */
        $scope.showTaskEditForm = false;

        /**
         * Scope method to toggle said edit form.
         */
        $scope.toggleEditForm = function () {
            if (Session.isLoggedIn()) {
                $scope.showTaskEditForm = !$scope.showTaskEditForm;
            } else {
                $scope.showTaskEditForm = false;
            }
        };

        /**
         * Removes this task
         */
        $scope.removeTask = function () {
            var modalInstance = $modal.open({
                templateUrl: 'app/templates/story/delete_task.html',
                controller: 'StoryTaskDeleteController',
                resolve: {
                    task: function () {
                        return $scope.task;
                    }
                }
            });

            modalInstance.result.then(
                function () {
                    $scope.loadTasks();
                }
            );
        };

        /**
         * Cancel the edit form
         */
        $scope.cancelTask = function () {
            Task.read({id: $scope.task.id},
                function (task) {
                    $scope.task = task;
                });
            $scope.showTaskEditForm = false;
        };

        /**
         * Updates the task list.
         */
        $scope.updateTask = function () {
            $scope.task.$update(function () {
                $scope.loadTasks(); // Reload
                $scope.showTaskEditForm = false;
            });
        };

        // UI Initialization.
        $scope.loadAssignee();
    });
