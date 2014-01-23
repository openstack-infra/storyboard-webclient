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
 * The projectGroup list controller handles discovery for all projectGroups,
 * including search. Note that it is assumed that we implemented a search
 * (inclusive), rather than a browse (exclusive) approach.
 */
angular.module('sb.project_groups').controller('ProjectGroupListController',
    function ($scope, ProjectGroup) {
        'use strict';

        // Variables and methods available to the template...
        $scope.projectGroups = [];
        $scope.searchQuery = '';
        $scope.isSearching = false;

        /**
         * The search method.
         */
        $scope.search = function () {
            // Clear the scope and set the progress flag.
            $scope.error = {};
            $scope.isSearching = true;
            $scope.projectGroups = [];

            // Execute the projectGroup query.
            ProjectGroup.search(
                // Enable this once the API's there, mocks don't support
                // searches yet
                {/* q: $scope.searchQuery || '' */},
                function (result) {
                    // Successful search results, apply the results to the
                    // scope and unset our progress flag.
                    $scope.projectGroups = result;
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
        $scope.search();
    });
