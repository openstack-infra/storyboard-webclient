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
angular.module('sb.story').controller('StoryListController',
    function ($scope, $modal, NewStoryService, Story) {
        'use strict';

        $scope.newStory = function () {
            NewStoryService.showNewStoryModal();
        };

        $scope.page = 1;
        $scope.pageSize = 20;
        $scope.pageTotal = 1;
        $scope.total = 0;
        $scope.searchQuery = '';
        $scope.isSearching = false;

        // Variables and methods available to the template...
        function resetScope() {
            $scope.stories = [];
            $scope.error = {};
        }

        /**
         * The search method.
         */
        $scope.search = function (page) {
            // Make sure we have a sane offset
            page = Math.max(page, 1);

            // Clear the scope and set the progress flag.
            resetScope();
            $scope.isSearching = true;

            // Execute the story query.
            Story.query(
                {
                    offset: (page - 1) * $scope.pageSize,
                    limit: $scope.pageSize
                },
                function (result, headers) {

                    // Determine the actual page, in case the size has changed
                    // on the server
                    var count = headers('X-Total') || result.length;
                    var offset = headers('X-Offset') || 0;

                    $scope.total = count;
                    $scope.offset = offset;
                    $scope.pageTotal = Math.ceil(count / $scope.pageSize);
                    $scope.page = Math.floor(offset / $scope.pageSize) + 1;

                    // Successful search results, apply the results to the
                    // scope and unset our progress flag.
                    $scope.stories = result;
                    $scope.isSearching = false;
                },
                function (error) {
                    // Error search results, show the error in the UI and
                    // unset our progress flag.
                    $scope.error = error;
                    $scope.isSearching = false;
                }
            );
        };

        // Initialize the view with a default search.
        resetScope();
        $scope.search(1);
    });
