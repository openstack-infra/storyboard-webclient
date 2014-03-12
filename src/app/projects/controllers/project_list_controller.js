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
 * The project list controller handles discovery for all projects, including
 * search. Note that it is assumed that we implemented a search (inclusive),
 * rather than a browse (exclusive) approach.
 */
angular.module('sb.projects').controller('ProjectListController',
    function ($scope, Project, CurrentUser) {
        'use strict';

        // Variables and methods available to the template...

        function resetScope() {
            $scope.projectCount = 0;
            $scope.projectOffset = 0;
            $scope.projectLimit = 10;
            $scope.projects = [];
            $scope.error = {};
        }

        $scope.searchQuery = '';
        $scope.isSearching = false;

        $scope.allowCreate = function() {
            var currentUser = CurrentUser.get();
            if (currentUser !== null) {
                return currentUser.is_superuser;
            }

            return false;
        };

        /**
         * The search method.
         */
        $scope.search = function () {
            // Clear the scope and set the progress flag.
            resetScope();
            $scope.isSearching = true;

            // Execute the project query.
            Project.query(
                // Enable this once the API accepts search queries.
                { /*q: $scope.searchQuery || ''*/},
                function (result, headers) {

                    // Extract metadata from returned headers.
                    var projectCount = headers('X-List-Total') || result.length;
                    var projectOffset = headers('X-List-Offset') || 0;
                    var projectLimit = headers('X-List-Limit') || result.length;

                    // Successful search results, apply the results to the
                    // scope and unset our progress flag.
                    $scope.projectCount = projectCount;
                    $scope.projectOffset = projectOffset;
                    $scope.projectLimit = projectLimit;
                    $scope.projects = result;
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
        $scope.search();
    });
