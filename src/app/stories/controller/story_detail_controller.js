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
    function ($log, $rootScope, $scope, $state, $stateParams, $modal, Story,
              Session, User, Preference, Event, Comment) {
        'use strict';

        // Parse the ID
        var id = $stateParams.hasOwnProperty('storyId') ?
            parseInt($stateParams.storyId, 10) :
            null;

        $scope.enabled_event_types = Preference.get('display_events_filter');

        /**
         * The story we're manipulating right now.
         */
        $scope.loadEvents = function() {
            Event.search(id).then(function(events) {
                  $scope.events = events;
            });
        };

        /**
         * The new comment backing the input form.
         */
        $scope.newComment = new Comment({story_id: id});

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
         * Load the story
         */
        function loadStory() {
            Story.get(
                {'id': id},
                function (story) {
                    $scope.story = story;

                    // Load the creator if one exists.
                    if (!!story.creator_id) {
                        $scope.creator = User.get({id: story.creator_id});
                    }
                    $scope.loadEvents();
                    handleServiceSuccess();
                },
                handleServiceError
            );
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
        * Formats the user name.
        */
        $scope.formatUserName = function (model) {
            if (!!model) {
                return model.full_name;
            }
            return '';
        };

        /**
        * User typeahead search method.
        */
        $scope.searchUsers = function (value) {
            return User.query({full_name: value, limit: 10}).$promise;
        };

        /**
         * UI Flag for when we're in edit mode.
         */
        $scope.showEditForm = false;

        /**
         * The user record for the author
         */
        $scope.creator = null;

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
            loadStory(); // Reload.
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

            modalInstance.result.then(function(enabled_event_types) {
                $scope.enabled_event_types = enabled_event_types;
            });
            // Return the modal's promise.
            return modalInstance.result;
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
                    $scope.newComment = new Comment({story_id: id});
                    resetSavingFlag();
                    $scope.loadEvents();
                }
            );
        };


        /**
         * Initialize
         */
        loadStory();
    });
