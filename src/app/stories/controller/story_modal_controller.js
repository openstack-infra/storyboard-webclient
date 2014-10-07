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
 * Controller for the "new story" modal popup.
 */
angular.module('sb.story').controller('StoryModalController',
    function ($scope, $modalInstance, params, Project,
              Story, Task) {
        'use strict';

        $scope.projects = Project.query({});
        $scope.story = new Story({title: ''});
        $scope.tasks = [new Task({
            title: '',
            project_id: params.projectId || null
        })];

        var lastTitle = '', trackingStoryTitle = true;
        $scope.$on('$destroy', $scope.$watch(
            function () {
                return $scope.story.title;
            },
            function (newTitle) {

                // Exit if we've set a custom title.
                if (!trackingStoryTitle) {
                    return;
                }

                // Get the first task in the list.
                var task = $scope.tasks[0];
                if (trackingStoryTitle && task.title === lastTitle) {
                    task.title = newTitle;
                    lastTitle = newTitle;
                } else {
                    trackingStoryTitle = false;
                }
            }
        ));

        /**
         * Saves the story, then saves all the tasks associated with that
         * story.
         */
        $scope.save = function () {
            $scope.story.$create(function (story) {

                var resolvingTasks = $scope.tasks.length;

                // Now that we've created the task, save all the tasks.
                $scope.tasks.forEach(function (task) {
                    task.story_id = story.id;
                    task.$create(function () {
                        resolvingTasks--;
                        if (resolvingTasks === 0) {
                            $modalInstance.close(story);
                        }
                    });
                });
            });
        };

        /**
         * Close this modal without saving.
         */
        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

        /**
         * Add another task.
         */
        $scope.addTask = function () {
            // When adding a new modal, grab the project ID from the last
            // item in the list.

            var lastTask = $scope.tasks[$scope.tasks.length - 1];
            $scope.tasks.push(new Task({
                project_id: lastTask.project_id
            }));
        };

        /**
         * Remove a task from the task list, but only if we have
         * more than one task.
         */
        $scope.removeTask = function (task) {
            if ($scope.tasks.length < 2) {
                return;
            }
            var idx = $scope.tasks.indexOf(task);
            $scope.tasks.splice(idx, 1);
        };

        /**
         * Project typeahead search method.
         */
        $scope.searchProjects = function (value) {
            return Project.query({name: value, limit: 10}).$promise;
        };

        /**
         * Formats the project name.
         */
        $scope.formatProjectName = function (model) {
            if (!!model) {
                return model.name;
            }
            return '';
        };

        /**
         * Select a new project.
         */
        $scope.selectNewProject = function (model, task) {
            task.project_id = model.id;
        };
    })
;
