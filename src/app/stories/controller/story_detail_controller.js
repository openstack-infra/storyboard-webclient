/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 * Copyright (c) 2016 Codethink Ltd.
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
angular.module('sb.story').controller('StoryDetailController',
    function ($log, $rootScope, $scope, $state, $stateParams, $modal, Session,
              Preference, TimelineEvent, Comment, TimelineEventTypes, story,
              Story, Project, Branch, creator, tasks, Task, DSCacheFactory,
              User, $q, storyboardApiBase, SessionModalService, moment,
              $document, $anchorScroll, $timeout, $location, currentUser,
              enableEditableComments, Tags, worklists, Team, StoryHelper) {
        'use strict';

        var pageSize = Preference.get('story_detail_page_size');
        var firstLoad = true;

        $scope.enableEditableComments = enableEditableComments;

        // Set the yOffset to 50 because the fixed bootstrap navbar
        // is 50px high.
        $anchorScroll.yOffset = 50;
        $scope.filterMode = 'advanced';

        /**
         * The story, resolved in the state.
         *
         * @type {Story}
         */
        $scope.story = story;

        /**
         * The user record for the author, resolved in the state.
         *
         * @type {User}
         */
        $scope.creator = creator;

        /**
         * All tasks associated with this story, resolved in the state.
         *
         * @type {[Task]}
         */
        $scope.projectNames = [];
        $scope.projects = {};
        $scope.tasks = tasks;

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

        angular.forEach(tasks, mapTaskToProject);

        /**
         * All worklists containing this story or tasks within it, with
         * information about which task is relevant added.
         *
         * @type {[Worklist]}
         */
        function setWorklists() {
            function isNotArchived(card) {
                return !card.archived;
            }

            var taskIds = $scope.tasks.map(function(task) {
                return task.id;
            });
            for (var i = 0; i < worklists.length; i++) {
                var worklist = worklists[i];
                worklist.relatedItems = [];
                worklist.items = worklist.items.filter(isNotArchived);
                for (var j = 0; j < worklist.items.length; j++) {
                    var item = worklist.items[j];
                    if (item.item_type === 'story') {
                        if (item.item_id === story.id) {
                            worklist.relatedItems.push(item);
                        }
                    } else if (item.item_type === 'task') {
                        if (taskIds.indexOf(item.item_id) > -1) {
                            worklist.relatedItems.push(item);
                        }
                    }
                }
            }
            $scope.worklists = worklists.map(function(list) {
                if (list.relatedItems.length > 0) {
                    return list;
                }
            }).filter(function(list) { return list; });
        }

        setWorklists();

        $scope.showWorklistsModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/stories/template/worklists.html',
                backdrop: 'static',
                controller: 'StoryWorklistsController',
                resolve: {
                    worklists: function () {
                        return $scope.worklists;
                    }
                }
            });

            // Return the modal's promise.
            return modalInstance.result;
        };

        // Load the preference for each display event.
        function reloadPagePreferences() {
            TimelineEventTypes.forEach(function (type) {
                // Prefs are stored as strings, UI tests on booleans, so we
                // convert here.
                var pref_name = 'display_events_' + type;
                $scope[pref_name] = Preference.get(pref_name) === 'true';
            });
            pageSize = Preference.get('story_detail_page_size');
            $scope.loadEvents();
        }

        $scope.filterComments = function() {
            $scope.filterMode = 'comments';
            angular.forEach(TimelineEventTypes, function(type) {
                var pref_name = 'display_events_' + type;
                $scope[pref_name] = false;
            });
            $scope.display_events_user_comment = true;
            $scope.display_events_story_created = true;
            $scope.loadEvents();
        };

        $scope.filterAll = function() {
            $scope.filterMode = 'all';
            angular.forEach(TimelineEventTypes, function(type) {
                var pref_name = 'display_events_' + type;
                $scope[pref_name] = true;
            });
            $scope.loadEvents();
        };

        $scope.isSearching = false;

        /**
         * Load TimelineEvents related to the story.
         */
        $scope.loadEvents = function () {
            $scope.isSearching = true;
            var params = {};
            params.sort_field = 'id';
            params.sort_dir = 'asc';
            params.story_id = $scope.story.id;
            params.event_type = TimelineEventTypes.map(function(type) {
                var pref_name = 'display_events_' + type;
                if ($scope[pref_name]) {
                    return type;
                }
            }).filter(function(item) { return item; });

            TimelineEvent.browse(params,
                function (result) {
                    var eventResults = [];
                    result.forEach(function (item) {
                        item.author = User.get({id: item.author_id});
                        item.event_info = JSON.parse(item.event_info);

                        eventResults.push(item);
                    });
                    $scope.events = eventResults;
                    $scope.isSearching = false;
                    if (firstLoad) {
                        firstLoad = false;
                        // Wrap this in a timeout to make sure we don't
                        // try to scroll before the timeline is rendered.
                        $timeout(function() {
                            $anchorScroll();
                        }, 0);
                    }
                },
                function () {
                    $scope.isSearching = false;
                }
            );
        };
        reloadPagePreferences();

        /**
         * Next page of the results.
         */
        $scope.nextPage = function () {
            $scope.searchOffset += pageSize;
            $scope.loadEvents();
        };

        /**
         * Previous page of the results.
         */
        $scope.previousPage = function () {
            $scope.searchOffset -= pageSize;
            if ($scope.searchOffset < 0) {
                $scope.searchOffset = 0;
            }
            $scope.loadEvents();
        };

        /**
         * Update the page size preference and re-search.
         */
        $scope.updatePageSize = function (value) {
            Preference.set('story_detail_page_size', value).then(
                function () {
                    pageSize = value;
                    $scope.loadEvents();
                }
            );
        };

        /**
         * The new comment backing the input form.
         */
        $scope.newComment = new Comment({});

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
         * Toggle/display the edit form
         */
        $scope.toggleEditMode = function () {
            if (Session.isLoggedIn()) {
                $scope.showEditForm = !$scope.showEditForm;

                // Deferred timeout request for a re-rendering of elastic
                // text fields, since the size calculation breaks when
                // visible: false
                setTimeout(function () {
                    $rootScope.$broadcast('elastic:adjust');
                }, 1);
            } else {
                $scope.showEditForm = false;
            }
        };

        /**
         * UI Flag for when we're in edit mode.
         */
        $scope.showEditForm = false;

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
         * UI view for when we're trying to save a comment.
         *
         * @type {boolean}
         */
        $scope.isSavingComment = false;

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
         * Resets any changes and toggles the form back.
         */
        $scope.cancel = function () {
            $scope.showEditForm = false;
        };

        $scope.privacyLocked = false;

        /**
         * Handle any change to whether or not the story is security-related
         */
        $scope.updateSecurity = function(forcePrivate, update) {
            $scope.privacyLocked = StoryHelper.updateSecurity(
                forcePrivate, update, $scope.story, $scope.tasks);
        };

        /**
         * Delete method.
         */
        $scope.remove = function () {
            var modalInstance = $modal.open({
                templateUrl: 'app/stories/template/delete.html',
                backdrop: 'static',
                controller: 'StoryDeleteController',
                resolve: {
                    story: function () {
                        return $scope.story;
                    }
                }
            });

            // Return the modal's promise.
            return modalInstance.result;
        };

        $scope.updateFilter = function () {
            var modalInstance = $modal.open({
                templateUrl: 'app/stories/template/update_filter.html',
                backdrop: 'static',
                controller: 'TimelineFilterController'
            });

            $scope.filterMode = 'advanced';
            modalInstance.result.then(reloadPagePreferences);
            $scope.searchLimit = Preference.get('story_detail_page_size');
        };

        $scope.previewingComment = false;
        $scope.togglePreview = function(val) {
            $scope.previewingComment = !$scope.previewingComment;
            if (val === true || val === false) {
                $scope.previewingComment = val;
            }
        };

        /**
         * Quote a comment
         */
        $scope.quote = function(event) {
            var timestamp = moment(event.created_at);
            var reference = '<footer>'
                            + event.author.full_name
                            + ' on '
                            + timestamp.format('YYYY-MM-DD [at] HH:mm:ss')
                            + '</footer>';
            var lines = event.comment.content.split('\n');
            for (var i = 0; i < lines.length; i++) {
                lines[i] = '> ' + lines[i];
            }
            lines.push('> ' + reference);
            var quoted = lines.join('\n');
            if ($scope.newComment.content) {
                $scope.newComment.content += '\n\n' + quoted;
            } else {
                $scope.newComment.content = quoted;
            }
            $document[0].getElementById('comment').focus();
        };

        /**
         * Determine if a comment is currently being permalinked
         */
        $scope.isLinked = function(event) {
            if ($location.hash() === 'comment-' + event.comment.id) {
                return true;
            }
            return false;
        };

        /**
         * Determine if the current user is the author of a comment.
         */
        $scope.isAuthor = function(event) {
            if (currentUser.id === event.author_id) {
                return true;
            }
            return false;
        };

        /**
         * Add a comment
         */
        $scope.addComment = function () {

            function resetSavingFlag() {
                $scope.isSavingComment = false;
            }

            // Do nothing if the comment is empty
            if (!$scope.newComment.content) {
                $log.warn('No content in comment, discarding submission');
                return;
            }

            $scope.isSavingComment = true;
            $scope.togglePreview(false);

            // Author ID will be automatically attached by the service, so
            // don't inject it into the conversation until it comes back.
            $scope.newComment.$create({story_id: $scope.story.id},
                function () {
                    $scope.newComment = new Comment({});
                    resetSavingFlag();
                    $scope.loadEvents();
                }
            );
        };

        $scope.edit = function(event) {
            event.editing = true;
            event.comment.edited = angular.copy(event.comment.content);
        };

        $scope.editComment = function(event) {
            event.isUpdating = true;
            Comment.update(
                {
                    id: story.id,
                    comment_id: event.comment.id,
                    content: event.comment.edited
                },
                function(result) {
                    event.comment.content = result.content;
                    event.isUpdating = false;
                    event.editing = false;
                },
                function() {
                    event.isUpdating = false;
                    event.editing = false;
                }
            );
        };

        /**
         * View comment history
         */
        $scope.showHistory = function (event) {
            var modalInstance = $modal.open({
                size: 'lg',
                templateUrl: 'app/stories/template/comments/history.html',
                backdrop: 'static',
                controller: 'CommentHistoryController',
                resolve: {
                    history: function() {
                        if (event.comment && event.comment.updated_at) {
                            return Comment.History.get({
                                story_id: story.id,
                                id: event.comment.id
                            });
                        }
                        return [];
                    },
                    comment: function() {
                        return event.comment;
                    }
                }
            });

            // Return the modal's promise.
            return modalInstance.result;
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
            story_id: $scope.story.id,
            status: 'todo'
        });

        /**
         * Adds a task.
         */
        $scope.createTask = function (task, branch) {
            // Make a copy to save, so that the next task retains the
            // old information (for easier continuous editing).
            var savingTask = new Task(angular.copy(task));
            savingTask.$save(function (savedTask) {
                $scope.tasks.push(savedTask);
                if (branch) {
                    branch.tasks.push(savedTask);
                } else {
                    mapTaskToProject(savedTask);
                    $scope.updateSecurity(false, true);
                }
                $scope.loadEvents();
                task.title = '';
            });
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
                        $scope.updateSecurity(false, true);
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
                backdrop: 'static',
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
                backdrop: 'static',
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
