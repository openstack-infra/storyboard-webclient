/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * Administration controller for project groups.
 */
angular.module('sb.project_group').controller('ProjectGroupAdminController',
    function ($scope, $modal, ProjectGroup, Preference, isSuperuser,
             CurrentUser, SubscriptionList) {
        'use strict';

        /**
         * The project groups.
         *
         * @type {Array}
         */
        $scope.projectGroups = [];

        $scope.is_superuser = isSuperuser;

        /**
         * The search filter query string.
         *
         * @type {string}
         */
        $scope.filterQuery = '';

        //GET list of project group subscriptions
        var cuPromise = CurrentUser.resolve();

        cuPromise.then(function(user){
            $scope.projectGroupSubscriptions =
            SubscriptionList.subsList(
                'project_group', user);
        });


        /**
         * Launches the add-project-group modal.
         */
        $scope.addProjectGroup = function () {
            $scope.modalInstance = $modal.open(
                {
                    templateUrl: 'app/project_group/template/new.html',
                    controller: 'ProjectGroupNewController'
                });

            $scope.modalInstance.result.then(function () {
                    // On success, reload the page.
                    $scope.search();
                });
        };

        /**
         * Open up the delete project group modal.
         *
         * @param projectGroup
         */
        $scope.deleteProjectGroup = function (projectGroup) {
            var modalInstance = $modal.open({
                templateUrl: 'app/project_group/template/delete.html',
                controller: 'ProjectGroupDeleteController',
                resolve: {
                    projectGroup: function () {
                        return projectGroup;
                    }
                }
            });

            // Reset the view after successful completion.
            modalInstance.result.then(
                function () {
                    $scope.search();
                }
            );
        };

        /**
         * Execute a search.
         */
        $scope.searchOffset = 0;
        var pageSize = Preference.get('page_size');
        $scope.search = function () {
            var searchQuery = $scope.filterQuery || '';

            $scope.projectGroups = ProjectGroup.browse({
                title: searchQuery,
                offset: $scope.searchOffset,
                limit: pageSize
            }, function(results, headers){
                $scope.searchTotal =
                    parseInt(headers('X-Total')) || results.length;
                $scope.searchOffset = parseInt(headers('X-Offset')) || 0;
                $scope.searchLimit = parseInt(headers('X-Limit')) || 0;
            });
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

        // Initialize
        $scope.search();
    });
