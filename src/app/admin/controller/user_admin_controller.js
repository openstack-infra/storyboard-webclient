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
    function ($scope, $modal, User) {
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
                    controller: 'UserNewController'
                }).result.then(function () {
                    // On success, reload the page.
                    $scope.search();
                });
        };

        /**
         * Execute a search.
         */
        $scope.search = function () {
            var searchQuery = $scope.filterQuery || '';

            $scope.users = User.browse({
                full_name: searchQuery
            });
        };

        // Initialize
        $scope.search();
    });