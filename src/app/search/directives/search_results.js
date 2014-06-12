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
 * A directive that displays a list of projects in a table.
 *
 * @see ProjectListController
 */
angular.module('sb.search').directive('searchResults',
    function ($parse, Criteria, $injector) {
        'use strict';

        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, $element, args) {

                // Extract the resource type.
                var resourceName = args.searchResource;
                var pageSize = args.searchPageSize || 5;

                $scope.isSearching = false;
                $scope.searchResults = [];

                // Watch for changing criteria
                $scope.$watchCollection($parse(args.searchCriteria),
                    function (criteria) {
                        // Check for the resource.
                        $scope.containsResource = Criteria
                            .containsResource(resourceName, criteria, false);

                        // Optimization: No need to keep going, just clear
                        // everything.
                        if (!$scope.containsResource) {
                            $scope.validCriteria = [];
                            $scope.hasCriteria = false;
                            $scope.searchResults = [];
                            $scope.isLoading = false;
                            return;
                        }
//                        // Check for valid criteria.
                        $scope.validCriteria = Criteria
                            .filterCriteria(resourceName, criteria);
                        $scope.hasCriteria = $scope.validCriteria.length > 0;

                        if ($scope.hasCriteria) {
                            getSearchResults();
                        }
                    });

                function getSearchResults() {
                    // Extract the params.
                    var params = Criteria.mapCriteria(resourceName,
                        $scope.validCriteria);
                    var resource = $injector.get(resourceName);

                    if (!!resource && !!params) {
                        // Reset our results.
                        $scope.isSearching = true;
                        $scope.searchResults = [];

                        // Apply paging.
                        params.limit = pageSize;

                        resource.query(params,
                            function (results) {
                                $scope.searchResults = results;
                                $scope.isSearching = false;
                            },
                            function () {
                                $scope.isSearching = false;
                            }
                        );
                    }
                }

//                $scope.$watchCollection($scope.validCriteria,
//                    function () {
//                        console.warn('change');
//                    });

            }
        };
    });