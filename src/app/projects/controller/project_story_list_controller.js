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
 * This controller manages stories within the scope of a particular project.
 */
angular.module('sb.projects').controller('ProjectStoryListController',
    function ($scope, $state, $stateParams, Story, NewStoryService,
              Preference, SubscriptionList, CurrentUser) {
        'use strict';

        // Parse the ID. Since we're in a nested state, we don't really need
        // to sanity check here, but in case of a future refactor we'll
        // go ahead and do so anyway.
        var id = $stateParams.hasOwnProperty('id') ?
            parseInt($stateParams.id, 10) :
            null;

        if (id === null) {
            $state.go('sb.index');
            return;
        }

        var pageSize = Preference.get('project_detail_page_size');

        // Variables and methods available to the template...
        function resetScope() {
            $scope.storyCount = 0;
            $scope.stories = [];
            $scope.error = {};
        }

        $scope.searchQuery = '';
        $scope.isSearching = false;
        $scope.filter = 'active';

        /**
         * Set the filter and refresh the search.
         */
        $scope.setFilter = function (state) {
            $scope.filter = state;
            $scope.search();
        };

        /**
         * The search method.
         */
        $scope.search = function () {
            // Clear the scope and set the progress flag.
            resetScope();
            $scope.isSearching = true;

            // Execute the story query.
            Story.browse({
                    project_id: id,
                    status: $scope.filter || null,
                    offset: $scope.searchOffset,
                    limit: pageSize
                },
                function (result, headers) {

                    // Successful search results, apply the results to the
                    // scope and unset our progress flag.
                    $scope.storyCount =
                        parseInt(headers('X-Total')) || result.length;
                    $scope.searchOffset = parseInt(headers('X-Offset')) || 0;
                    $scope.searchLimit = parseInt(headers('X-Limit')) || 0;
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

        /**
         * Update the page size preference and re-search.
         */
        $scope.updatePageSize = function (value) {
            Preference.set('page_size', value).then(
                function () {
                    pageSize = value;
                    $scope.search();
                }
            );
        };

        /**
         * Next page of the results.
         */
        $scope.nextPage = function () {
            $scope.searchOffset += pageSize;
            $scope.search();
        };

        /**
         * Previous page of the results.
         */
        $scope.previousPage = function () {
            $scope.searchOffset -= pageSize;
            if ($scope.searchOffset < 0) {
                $scope.searchOffset = 0;
            }
            $scope.search();
        };

        $scope.newStory = function () {
            NewStoryService.showNewStoryModal(id)
                .then(function (createdStory) {
                    // On success, go to the story detail
                    $state.go('sb.story.detail', {storyId: createdStory.id});
                }
            );
        };

        // Initialize the view with a default search.
        resetScope();
        $scope.search();

        // GET list of story subscriptions
        var cuPromise = CurrentUser.resolve();

        cuPromise.then(function(user){
            $scope.storySubscriptions = SubscriptionList.subsList(
                'story', user);
        });
    });
