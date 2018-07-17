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
    function ($log, $parse, Criteria, $injector, Preference, User) {
        'use strict';

        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, $element, args) {

                // Extract the resource type.
                var resourceName = args.searchResource;
                var pageSize = args.searchPageSize ||
                    Preference.get('page_size');
                var searchWithoutCriteria =
                    args.searchWithoutCriteria === 'true';
                var criteria = [];

                $scope.isSearching = false;
                $scope.searchResults = [];
                $scope.users_ids = [];
                $scope.users = [];

                /**
                 * The field to sort on.
                 *
                 * @type {string}
                 */
                $scope.sortField = 'id';

                /**
                 * The direction to sort on.
                 *
                 * @type {string}
                 */
                $scope.sortDirection = 'desc';

                /**
                 * Handle error result.
                 */
                function handleErrorResult() {
                    $scope.isSearching = false;
                }

                /**
                 * Handle search result.
                 *
                 * @param results
                 */
                function handleSearchResult(results, headers) {
                    $scope.searchTotal =
                        parseInt(headers('X-Total')) || results.length;
                    $scope.searchOffset = parseInt(headers('X-Offset')) || 0;
                    $scope.searchLimit = parseInt(headers('X-Limit')) || 0;
                    $scope.searchResults = results;
                    getTasksCreators(results);
                    $scope.isSearching = false;
                }

                /**
                 * Get tasks Users names
                 */
                function getTasksCreators(searchResults) {
                    for (const element in searchResults) {
                        if(element.status) {
                            if(!$scope.users_ids.includes(element.creator_id)) {
                                $scope.users_ids.push(element.creator_id);
                                User.get({id:element.creator_id}).$promise.then(function(user) {
                                    $scope.users[element.creator_id] = user.full_name;                                   
                                });
                            }
                        }
                    }
                }

                /**
                 * Update the results when the criteria change
                 */
                function updateResults() {

                    // Extract the valid criteria from the provided ones.
                    $scope.validCriteria = Criteria
                        .filterCriteria(resourceName, criteria);

                    // You have criteria, but they may not be valid.
                    $scope.hasCriteria = criteria.length > 0;

                    // You have criteria, and all of them are valid for
                    // this resource.
                    $scope.hasValidCriteria =
                        searchWithoutCriteria ||
                        ($scope.validCriteria.length === criteria.length &&
                        $scope.hasCriteria);

                    // No need to search if our criteria aren't valid.
                    if (!$scope.hasValidCriteria) {
                        $scope.searchResults = [];
                        $scope.isSearching = false;
                        return;
                    }

                    var params = Criteria.mapCriteria(resourceName,
                        $scope.validCriteria);
                    var resource = $injector.get(resourceName);

                    if (!resource) {
                        $log.error('Invalid resource name: ' +
                        resourceName);
                        return;
                    }

                    // Apply paging.
                    params.limit = pageSize;
                    params.offset = $scope.searchOffset;

                    // If we don't actually have search criteria, issue a
                    // browse. Otherwise, issue a search.
                    $scope.isSearching = true;
                    if (!params.hasOwnProperty('q')) {
                        params.sort_field = $scope.sortField;
                        params.sort_dir = $scope.sortDirection;

                        resource.browse(params,
                            handleSearchResult,
                            handleErrorResult);
                    } else {
                        resource.search(params,
                            handleSearchResult,
                            handleErrorResult);
                    }
                }

                /**
                 * Allowing sorting stories in search results by certain fields.
                 */
                $scope.stories_sort_field = 'Sort Field';
                $scope.sort_stories_by_field = function(selected){
                    $scope.stories_sort_field = selected.toString();
                    var res = $scope.searchResults;
                    switch(selected) {
                        case 'Title':
                            res.sort(function compare(a, b){
                                if (a.title < b.title){
                                    return -1;
                                }
                                if (a.title > b.title){
                                    return 1;
                                }
                                return 0;
                            });
                            break;
                        case 'Tags':
                            res.sort(function compare(a, b){
                                if (a.tags < b.tags){
                                    return -1;
                                }
                                if (a.tags > b.tags){
                                    return 1;
                                }
                                return 0;
                            });
                            break;
                        case 'Status':
                            res.sort(function compare(a, b){
                                if (a.status < b.status){
                                    return -1;
                                }
                                if (a.status > b.status){
                                    return 1;
                                }
                                return 0;
                            });
                            break;
                        case 'Updated':
                            res.sort(function compare(a, b){
                                if (a.updated_at < b.updated_at){
                                    return -1;
                                }
                                if (a.updated_at > b.updated_at){
                                    return 1;
                                }
                                return 0;
                            });
                            break;
                    }
                };

                /**
                 * Allowing sorting tasks in search results by certain fields.
                 */
                $scope.tasks_sort_field = 'Sort Field';
                $scope.sort_tasks_by_field = function(selected){
                    $scope.tasks_sort_field = selected.toString();
                    var res = $scope.searchResults;
                    switch(selected) {
                        case 'Story':
                            res.sort(function compare(a, b){
                                if (a.story_id < b.story_id){
                                    return -1;
                                }
                                if (a.story_id > b.story_id){
                                    return 1;
                                }
                                return 0;
                            });
                            break;
                        case 'Status':
                            res.sort(function compare(a, b){
                                if (a.status < b.status){
                                    return -1;
                                }
                                if (a.status > b.status){
                                    return 1;
                                }
                                return 0;
                            });
                            break;
                        case 'Title':
                            res.sort(function compare(a, b){
                                if (a.title < b.title){
                                    return -1;
                                }
                                if (a.title > b.title){
                                    return 1;
                                }
                                return 0;
                            });
                            break;
                        case 'Project':
                            res.sort(function compare(a, b){
                                if (a.project_id < b.project_id){
                                    return -1;
                                }
                                if (a.project_id > b.project_id){
                                    return 1;
                                }
                                return 0;
                            });
                            break;
                        case 'Creator':
                            res.sort(function compare(a, b){
                                if ($scope.users[a.creator_id] < $scope.users[b.creator_id]){
                                    return -1;
                                }
                                if ($scope.users[a.creator_id] > $scope.users[b.creator_id]){
                                    return 1;
                                }
                                return 0;
                            });
                            break;
                        case 'Created at':
                            res.sort(function compare(a, b){
                                if (a.created_at < b.created_at){
                                    return -1;
                                }
                                if (a.created_at > b.created_at){
                                    return 1;
                                }
                                return 0;
                            });
                            break;
                        case 'Updated Since':
                            res.sort(function compare(a, b){
                                if (a.updated_at < b.updated_at){
                                    return -1;
                                }
                                if (a.updated_at > b.updated_at){
                                    return 1;
                                }
                                return 0;
                            });
                            break;
                    }
                };

                /**
                 * Update the page size preference and re-search.
                 */
                $scope.updatePageSize = function (value) {
                    Preference.set('page_size', value).then(
                        function () {
                            pageSize = value;
                            updateResults();
                        }
                    );
                };

                /**
                 * Toggle the filter ID and direction in the UI.
                 *
                 * @param fieldName
                 */
                $scope.toggleFilter = function (fieldName) {
                    if ($scope.sortField === fieldName) {
                        $scope.sortDirection =
                            $scope.sortDirection === 'asc' ? 'desc' : 'asc';
                    } else {
                        $scope.sortField = fieldName;
                        $scope.sortDirection = 'desc';
                    }
                    updateResults();
                };

                /**
                 * Next page of the results.
                 */
                $scope.nextPage = function () {
                    $scope.searchOffset += pageSize;
                    updateResults();
                };

                /**
                 * Previous page in the results.
                 */
                $scope.previousPage = function () {
                    $scope.searchOffset -= pageSize;
                    if ($scope.searchOffset < 0) {
                        $scope.searchOffset = 0;
                    }
                    updateResults();
                };

                // Watch for changing criteria
                $scope.$watchCollection(
                    $parse(args.searchCriteria),
                    function (results) {
                        criteria = results;
                        updateResults();
                    });
            }
        };
    });
