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
 * Controller for the New Story view.
 *
 * This view is accessible from /#!/story/new, and can understand the
 * following parameters in the URL:
 *
 * - title: The initial story title
 * - description: The initial content of the story description
 * - force_private: If truthy, the story will be forced to be private
 *                  (i.e. private with the option to change privacy hidden).
 * - private: If truthy, the story will begin set to private.
 *            Unlike force_private, this allows the user to change to public.
 * - tags: Tags to set on the story. Can be given multiple times.
 * - team_id: A team ID to grant permissions for this story to. Can be
 *            given multiple times.
 * - user_id: A user ID to grant permissions for this story to. Can be
 *            given multiple times.
 */
angular.module('sb.story').controller('StoryNewController',
    function ($scope, $state, $stateParams, Story, Project, Branch, Tags,
              Task, Team, User, $q, storyboardApiBase, currentUser) {
        'use strict';

        var story = new Story({
            title: $stateParams.title,
            description: $stateParams.description,
            private: !!$stateParams.private || !!$stateParams.force_private,
            users: [currentUser],
            teams: []
        });

        // Convert the user_id and team_id parameters to arrays if needed
        if (!!$stateParams.team_id
            && $stateParams.team_id.constructor !== Array) {
            $stateParams.team_id = [$stateParams.team_id];
        }
        if (!!$stateParams.user_id
            && $stateParams.user_id.constructor !== Array) {
            $stateParams.user_id = [$stateParams.user_id];
        }
        // Populate the story's permission lists as requested
        angular.forEach($stateParams.team_id, function(team_id) {
            Team.get({team_id: team_id}).$promise.then(function(team) {
                story.teams.push(team);
            });
        });
        angular.forEach($stateParams.user_id, function(user_id) {
            User.get({id: user_id}).$promise.then(function(user) {
                story.users.push(user);
            });
        });

        $scope.story = story;

        // Convert the tags parameter into an array if it isn't already
        if (!!$stateParams.tags && $stateParams.tags.constructor !== Array) {
            $stateParams.tags = [$stateParams.tags];
        }
        // List of tags to give the story
        $scope.tags = $stateParams.tags || [];

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

        $scope.isValid = function() {
            return !!$scope.tasks.length && !!$scope.story.title;
        };

        /**
         * Create the tasks for the story.
         */
        function createTasks(createdStory) {
            var resolvingTasks = $scope.tasks.length;
            angular.forEach($scope.tasks, function(task) {
                task.story_id = createdStory.id;
                task.$create(function() {
                    resolvingTasks--;
                    if (resolvingTasks === 0) {
                        // Finished, navigate to the new story
                        $state.go('sb.story.detail',
                                  {storyId: createdStory.id});
                    }
                });
            });
        }

        /**
         * Create the story.
         */
        $scope.createStory = function() {
            $scope.isUpdating = true;
            // Ensure story is private if force_private is set.
            if ($scope.forcePrivate) {
                $scope.story.private = true;
            }
            $scope.story.$create(function(createdStory) {
                var tagsController = new Story.TagsController({
                    id: createdStory.id
                });
                if ($scope.tags.length > 0) {
                    // Create tags for the story, then tasks
                    tagsController.$update({tags: $scope.tags}, createTasks);
                } else {
                    // Create tasks for the story
                    createTasks(createdStory);
                }
            }, function() {
                $scope.isUpdating = false;
            });
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
            project_id: $stateParams.project_id,
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
        $scope.createTask = function(task, branch) {
            // Make a copy to save, so that the next task retains the
            // old information (for easier continuous editing).
            var savedTask = new Task(angular.copy(task));
            if (branch) {
                branch.tasks.push(savedTask);
            } else {
                var params = {project_id: task.project_id, name: 'master'};
                Branch.browse(params).$promise.then(function(result) {
                    if (result) {
                        savedTask.branch_id = result[0].id;
                        mapTaskToProject(savedTask);
                    }
                });
            }
            $scope.tasks.push(savedTask);
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
            if (fieldName === 'project_id') {
                var project = $scope.projects[projectName];
                var branch = project.branches[branchName];

                var branchTaskIndex = branch.tasks.indexOf(task);
                if (branchTaskIndex > -1) {
                    branch.tasks.splice(branchTaskIndex, 1);
                }

                cleanBranchAndProject(projectName, branchName);
                mapTaskToProject(task);
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

        /**
         * Removes this task
         */
        $scope.removeTask = function (task, projectName, branchName) {
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
        };

        // ###################################################################
        // Tags Management
        // ###################################################################

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
                $scope.showAddTag = false;
                $scope.tags.push(tag_name);
            }
        };

        $scope.removeTag = function (tag_name) {
            var tagIndex = $scope.tags.indexOf(tag_name);
            if (tagIndex > -1) {
                $scope.tags.splice(tagIndex, 1);
            }
        };

        $scope.searchTags = function (value) {
            return Tags.browse({name: value, limit: 10}).$promise;
        };

        $scope.updateViewValue = function (value) {
            $scope.newTag.name = value;
        };

        $scope.newTag = {};
    });
