/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 * Copyright (c) 2016 Codethink Ltd.
 * Copyright (c) 2017 Adam Coldrick
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
 * Story detail &  manipulation controller.
 */
angular.module('sb.story').controller('StoryNewController',
    function ($log, $rootScope, $scope, $state, $stateParams, $modal, Session,
              Preference, TimelineEvent, Comment, TimelineEventTypes,
              Story, Project, Branch, Task, DSCacheFactory, User, $q,
              storyboardApiBase, SessionModalService, moment,
              $document, $timeout, $location, Tags, Team, currentUser) {
        'use strict';

        var story = new Story({
            title: $stateParams.title,
            description: $stateParams.description,
            private: !!$stateParams.private || !!$stateParams.force_private,
            users: [currentUser],
            teams: []
        });

        $scope.story = story;

        /**
         * If the force_private query parameter is set, then enforce story
         * privacy and hide the option from the user.
         **/
        $scope.forcePrivate = !!$stateParams.force_private;

        /**
         * All tasks associated with this story, resolved in the state.
         *
         * @type {[Task]}
         */
        $scope.projectNames = [];
        $scope.projects = {};
        $scope.tasks = [];

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
         * Resets our loading flags.
         */
        function handleServiceSuccess() {
            $scope.isLoading = false;
            $scope.isUpdating = false;
        }

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
         * Scope method, invoke this when you want to update the story.
         */
        $scope.update = function () {
            // Set our progress flags and clear previous error conditions.
            $scope.isUpdating = true;
            $scope.error = {};

            // Invoke the save method and wait for results.
            $scope.story.$update(
                function () {
                    $scope.showEditForm = false;
                    $scope.previewStory = false;
                    handleServiceSuccess();
                },
                handleServiceError
            );
        };

        /**
         * Show modal informing the user login is required.
         */
        $scope.showLoginRequiredModal = function() {
            SessionModalService.showLoginRequiredModal();
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

        // ###################################################################
        // Task Management
        // ###################################################################

        /**
         * The new task for the task form.
         */
        $scope.newTask = new Task({
            branch_id: 1,
            show: true,
            status: 'todo'
        });

        function mapTaskToProject(task) {
            Project.get({id: task.project_id}).$promise.then(function(project) {
                var idx = $scope.projectNames.indexOf(project.name);
                if (idx < 0) {
                    $scope.projectNames.push(project.name);
                    $scope.projects[project.name] = project;
                    $scope.projects[project.name].branchNames = [];
                    $scope.projects[project.name].branches = {};
                }
                Branch.get({id: task.branch_id}).$promise.then(
                    function(branch) {
                        var branchIdx = $scope.projects[project.name]
                            .branchNames.indexOf(branch.name);
                        if (branchIdx > -1) {
                            $scope.projects[project.name].branches[branch.name]
                                .tasks.push(task);
                        } else {
                            $scope.projects[project.name]
                                .branches[branch.name] = branch;
                            $scope.projects[project.name]
                                .branches[branch.name].tasks = [task];
                            $scope.projects[project.name]
                                .branches[branch.name].newTask = new Task({
                                    story_id: $scope.story.id,
                                    branch_id: branch.id,
                                    project_id: project.id,
                                    status: 'todo'
                                });
                            $scope.projects[project.name]
                                .branchNames.push(branch.name);
                        }
                    });
            });
        }

        /**
         * Adds a task.
         */
        $scope.createTask = function (task, branch) {
            // Make a copy to save, so that the next task retains the
            // old information (for easier continuous editing).
            var savedTask = new Task(angular.copy(task));
            $scope.tasks.push(savedTask);
            if (branch) {
                branch.tasks.push(savedTask);
            } else {
                mapTaskToProject(savedTask);
            }
        };

        /**
         * Cleans up the project/branch/task tree.
         *
         * If there are no tasks remaining in the given branch in the given
         * project, then remove that branch from the project's list of
         * branches to display tasks for.
         *
         * If there are then no branches left in the project, remove the
         * project from the list of projects to display tasks for.
         */
        function cleanBranchAndProject(projectName, branchName) {
            var project = $scope.projects[projectName];
            var branch = project.branches[branchName];
            var nameIdx = -1;

            if (branch.tasks.length === 0) {
                nameIdx = project.branchNames.indexOf(branchName);
                if (nameIdx > -1) {
                    project.branchNames.splice(nameIdx, 1);
                }
                delete project.branches[branchName];
            }
            if (project.branchNames.length === 0) {
                nameIdx = $scope.projectNames.indexOf(projectName);
                if (nameIdx > -1) {
                    $scope.projectNames.splice(nameIdx, 1);
                }
                delete $scope.projects[projectName];
            }
        }

        /**
         * Updates the task list.
         */
        $scope.updateTask = function (task, fieldName, value, projectName,
                                      branchName) {
            var params = {id: task.id};
            params[fieldName] = value;
            task[fieldName] = value;
            if(!!task.id) {
                Task.update(params, function() {
                    $scope.showTaskEditForm = false;
                    $scope.loadEvents();
                }).$promise.then(function(updated) {
                    if (fieldName === 'project_id') {
                        var project = $scope.projects[projectName];
                        var branch = project.branches[branchName];

                        var branchTaskIndex = branch.tasks.indexOf(task);
                        if (branchTaskIndex > -1) {
                            branch.tasks.splice(branchTaskIndex, 1);
                        }

                        cleanBranchAndProject(projectName, branchName);
                        mapTaskToProject(updated);
                    }
                });
            }
        };

        $scope.editNotes = function(task) {
            task.tempNotes = task.link;
            task.editing = true;
        };

        $scope.cancelEditNotes = function(task) {
            task.tempNotes = '';
            task.editing = false;
        };

        $scope.showAddWorklist = function(task) {
            $modal.open({
                templateUrl: 'app/stories/template/add_task_to_worklist.html',
                controller: 'StoryTaskAddWorklistController',
                resolve: {
                    task: function() {
                        return task;
                    }
                }
            });
        };

        /**
         * Removes this task
         */
        $scope.removeTask = function (task, projectName, branchName) {
            var modalInstance = $modal.open({
                templateUrl: 'app/stories/template/delete_task.html',
                controller: 'StoryTaskDeleteController',
                resolve: {
                    task: function () {
                        return task;
                    },
                    params: function () {
                        return {
                            lastTask: ($scope.tasks.length === 1)
                        };
                    }
                }
            });

            modalInstance.result.then(
                function () {
                    var taskIndex = $scope.tasks.indexOf(task);
                    if (taskIndex > -1) {
                        $scope.tasks.splice(taskIndex, 1);
                    }

                    var project = $scope.projects[projectName];
                    var branch = project.branches[branchName];
                    var branchTaskIndex = branch.tasks.indexOf(task);
                    if (branchTaskIndex > -1) {
                        branch.tasks.splice(branchTaskIndex, 1);
                    }
                    cleanBranchAndProject(projectName, branchName);
                    $scope.loadEvents();
                }
            );
        };

        // ###################################################################
        // Tags Management
        // ###################################################################

        /**
         * The controller to add/delete tags from a story.
         *
         * @type {TagsController}
         */
        $scope.TagsController = new Story.TagsController({'id': story.id});

        /**
         * Show an input for a new tag
         *
         * @type {boolean}
         */
        $scope.showAddTag = false;

        $scope.toggleAddTag = function() {
            $scope.showAddTag = !$scope.showAddTag;
        };

        $scope.addTag = function (tag_name) {
            if(!!tag_name) {
                $scope.TagsController.$update({tags: [tag_name]},
                    function (updatedStory) {
                        DSCacheFactory.get('defaultCache').put(
                            storyboardApiBase + '/stories/' + story.id,
                            updatedStory);
                        $scope.showAddTag = false;
                        $scope.story.tags.push(tag_name);
                        $scope.loadEvents();
                    },
                    handleServiceError);
            }
        };

        $scope.removeTag = function (tag_name) {
            $scope.TagsController.$delete({tags: [tag_name]},
                function() {
                    var tagIndex = $scope.story.tags.indexOf(tag_name);
                    DSCacheFactory.get('defaultCache').remove(
                            storyboardApiBase + '/stories/' + story.id);
                    if (tagIndex > -1) {
                        $scope.story.tags.splice(tagIndex, 1);
                    }
                    $scope.loadEvents();
                },
                handleServiceError);
        };

        $scope.searchTags = function (value) {
            return Tags.browse({name: value, limit: 10}).$promise;
        };

        $scope.updateViewValue = function (value) {
            $scope.newTag.name = value;
        };

        $scope.newTag = {};
    });
