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
 * Story detail &  manipulation controller.
 */
angular.module('sb.story').controller('StoryDetailController',
    function ($log, $rootScope, $scope, $state, $stateParams, $modal, Session,
              Preference, TimelineEvent, Comment, TimelineEventTypes, story,
              Story, creator, tasks, Task, DSCacheFactory, User,
              storyboardApiBase, SubscriptionList, CurrentUser) {
        'use strict';

        var pageSize = Preference.get('story_detail_page_size');

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
        $scope.tasks = tasks;

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

        $scope.searchOffset = 0;
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
            params.offset = $scope.searchOffset;
            params.limit = pageSize;

            TimelineEvent.browse(params,
                function (result, headers) {
                    var eventResults = [];
                    result.forEach(function (item) {
                        item.author = User.get({id: item.author_id});
                        item.event_info = JSON.parse(item.event_info);

                        eventResults.push(item);
                    });
                    $scope.searchTotal = parseInt(headers('X-Total'));
                    $scope.searchOffset = parseInt(headers('X-Offset'));
                    $scope.searchLimit = parseInt(headers('X-Limit'));
                    $scope.events = eventResults;
                    $scope.isSearching = false;
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
        $scope.newComment = new Comment({story_id: $scope.story.id});

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

        /**
         * Delete method.
         */
        $scope.remove = function () {
            var modalInstance = $modal.open({
                templateUrl: 'app/stories/template/delete.html',
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
                controller: 'TimelineFilterController'
            });

            modalInstance.result.then(reloadPagePreferences);
            $scope.searchLimit = Preference.get('story_detail_page_size');
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

            // Author ID will be automatically attached by the service, so
            // don't inject it into the conversation until it comes back.
            $scope.newComment.$create(
                function () {
                    $scope.newComment = new Comment({
                        story_id: $scope.story.id
                    });
                    resetSavingFlag();
                    $scope.loadEvents();
                }
            );
        };

        // ###################################################################
        // Task Management
        // ###################################################################

        /**
         * The new task for the task form.
         */
        $scope.newTask = new Task({
            story_id: $scope.story.id,
            status: 'todo',
            priority: 'medium'
        });

        /**
         * Adds a task.
         */
        $scope.createTask = function () {
            // Make a copy to save, so that the next task retains the
            // old information (for easier continuous editing).
            var savingTask = new Task(angular.copy($scope.newTask));
            savingTask.$save(function (savedTask) {
                $scope.tasks.push(savedTask);
                $scope.loadEvents();
            });
        };

        /**
         * Updates the task list.
         */
        $scope.updateTask = function (task, fieldName, value) {

            if(!!fieldName) {
                task[fieldName] = value;
            }

            task.$update(function () {
                $scope.showTaskEditForm = false;
                $scope.loadEvents();
            });
        };


        /**
         * Removes this task
         */
        $scope.removeTask = function (task) {
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

        //GET subscriptions
        var cuPromise = CurrentUser.resolve();

        cuPromise.then(function(user){
            $scope.storySubscriptions = SubscriptionList.subsList(
                'story', user);
        });
    });
