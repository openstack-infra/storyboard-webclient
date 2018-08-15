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
 * Administration controller for users.
 */
angular.module('sb.admin').controller('UserAdminController',
    function ($scope, $modal, User, Preference) {
        'use strict';

        /**
         * The project groups.
         *
         * @type {Array}
         */
        $scope.users = [];

        /**
         * The search filter query string.
         *
         * @type {string}
         */
        $scope.filterQuery = '';

        /**
         * Launches the add-add-user modal.
         */
        $scope.addUser = function () {
            $modal.open(
                {
                    templateUrl: 'app/admin/template/user_new.html',
                    backdrop: 'static',
                    controller: 'UserNewController'
                }).result.then(function () {
                    // On success, reload the page.
                    $scope.search();
                });
        };

        /**
         * Execute a search.
         */
        var pageSize = Preference.get('page_size');
        $scope.searchOffset = 0;
        $scope.search = function () {
            var searchQuery = $scope.filterQuery || '';

            $scope.users = User.browse({
                full_name: searchQuery,
                offset: $scope.searchOffset,
                limit: pageSize
            }, function(results, headers) {
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
