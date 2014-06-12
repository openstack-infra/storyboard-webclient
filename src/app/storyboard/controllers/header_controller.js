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
 * Controller for our application header.
 */
angular.module('storyboard').controller('HeaderController',
    function ($scope, $rootScope, $state, NewStoryService, Session,
              SessionState, CurrentUser) {
        'use strict';

        function resolveCurrentUser() {
            CurrentUser.resolve().then(
                function (user) {
                    $scope.currentUser = user;
                },
                function () {
                    $scope.currentUser = null;
                }
            );
        }

        resolveCurrentUser();

        /**
         * Load and maintain the current user.
         */
        $scope.currentUser = null;

        /**
         * Create a new story.
         */
        $scope.newStory = function () {
            NewStoryService.showNewStoryModal()
                .then(function (story) {
                    // On success, go to the story detail.
                    $state.go('story.detail', {storyId: story.id});
                }
            );
        };

        /**
         * Log out the user.
         */
        $scope.logout = function () {
            Session.destroySession();
        };

        /**
         * Initialize the search string.
         */
        $scope.searchString = '';

        /**
         * Send the user to search and clear the header searchstring.
         */
        $scope.search = function () {
            var q = $scope.searchString;
            $scope.searchString = '';
            $state.go('search', {name: q});
        };

        // Watch for changes to the session state.
        $rootScope.$on(SessionState.LOGGED_IN, function () {
            resolveCurrentUser();
        });
        $rootScope.$on(SessionState.LOGGED_OUT, function () {
            $scope.currentUser = null;
        });
    });
