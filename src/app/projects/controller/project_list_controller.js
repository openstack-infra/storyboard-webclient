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
    function ($scope, CurrentUser, isSuperuser, Session, Subscription) {
        'use strict';

        // inject superuser flag to properly adjust UI.
        $scope.is_superuser = isSuperuser;

        // search results must be of type "project"
        $scope.resourceTypes = ['Project'];

        // Projects have no default criteria
        $scope.defaultCriteria = [];

        /**
        * TODO: The following is all subscriptions code. It should
        * be moved into its own area when possible.
        */

        /**
        * When we start, create a promise for the current user.
        */
        var cuPromise = CurrentUser.resolve();

        /**
        * The current user.
        *
        * @param currentUser
        */

        $scope.currentUser = null;

        cuPromise.then(function (user) {
            $scope.currentUser = user;
        });

        $scope.subscriptions = [];

        //GET list of project subscriptions
        if (!Session.isLoggedIn()) {
            $scope.subscriptions = null;
        }
        else {
            cuPromise.then(
                function(user) {
                    $scope.subscriptions = Subscription.browse({
                        user_id: user.id,
                        target_type: 'project',
                        limit: 100
                    });
                }
            );
        }
    });
