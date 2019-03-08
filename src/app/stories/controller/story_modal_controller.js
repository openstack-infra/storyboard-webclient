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
    function ($scope, $modalInstance, params, Project, Story, Task, User,
              Team, $q, CurrentUser, StoryHelper) {
        'use strict';

        var currentUser = CurrentUser.resolve();

        $scope.projects = Project.browse({});

        currentUser.then(function(user) {
            $scope.story = new Story({
                title: '',
                users: [user],
                teams: []
            });
        });

        $scope.tasks = [new Task({
            title: ''
        })];


        /**
         * Handle any change to whether or not the story is security-related
         */
        $scope.updateSecurity = function(forcePrivate, update) {
            $scope.privacyLocked = StoryHelper.updateSecurity(
                forcePrivate, update, $scope.story, $scope.tasks);
        };

        // Preload the project
        if (params.projectId) {
            Project.get({
                id: params.projectId
            }, function (project) {
                $scope.asyncProject = project;
                $scope.tasks = [new Task({
                    title: '',
                    project_id: project.id
                })];
            });
        }

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
            var project_id = lastTask.project_id;

            if (!project_id) {
                // if we are in the scope of a project, grab the project ID
                // from that scope.
                project_id = params.projectId || null;
            }

            var current_task = new Task({project_id: project_id});
            if (project_id) {
                // Preload the project
                Project.get({
                    id: project_id
                }, function (project) {
                    $scope.asyncProject = project;
                });
            }
            $scope.tasks.push(current_task);
            $scope.updateSecurity(true, false);
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
            return Project.browse({name: value, limit: 10}).$promise;
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
            $scope.updateSecurity(true, false);
        };

        /**
         * User/team typeahead search method.
         */
        $scope.searchActors = function (value, users, teams) {
            var userIds = users.map(function(user){return user.id;});
            var teamIds = teams.map(function(team){return team.id;});
            var deferred = $q.defer();
            var usersDeferred = $q.defer();
            var teamsDeferred = $q.defer();

            User.browse({full_name: value, limit: 10},
                function(searchResults) {
                    var results = [];
                    angular.forEach(searchResults, function(result) {
                        if (userIds.indexOf(result.id) === -1) {
                            result.name = result.full_name;
                            result.type = 'user';
                            results.push(result);
                        }
                    });
                    usersDeferred.resolve(results);
                }
            );
            Team.browse({name: value, limit: 10},
                function(searchResults) {
                    var results = [];
                    angular.forEach(searchResults, function(result) {
                        if (teamIds.indexOf(result.id) === -1) {
                            result.type = 'team';
                            results.push(result);
                        }
                    });
                    teamsDeferred.resolve(results);
                }
            );

            var searches = [teamsDeferred.promise, usersDeferred.promise];
            $q.all(searches).then(function(searchResults) {
                var results = [];
                angular.forEach(searchResults, function(promise) {
                    angular.forEach(promise, function(result) {
                        results.push(result);
                    });
                });
                deferred.resolve(results);
            });

            return deferred.promise;
        };

        /**
         * Add a new user or team to one of the permission levels.
         */
        $scope.addActor = function (model) {
            if (model.type === 'user') {
                $scope.story.users.push(model);
            } else if (model.type === 'team') {
                $scope.story.teams.push(model);
            }
        };

        /**
         * Remove a user from the permissions.
         */
        $scope.removeUser = function (model) {
            var idx = $scope.story.users.indexOf(model);
            $scope.story.users.splice(idx, 1);
        };

        /**
         * Remove a team from the permissions.
         */
        $scope.removeTeam = function(model) {
            var idx = $scope.story.teams.indexOf(model);
            $scope.story.teams.splice(idx, 1);
        };
    })
;
