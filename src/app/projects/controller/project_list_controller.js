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
    function ($scope, $modal, isSuperuser, SubscriptionList, CurrentUser,
              $location, SearchHelper) {
        'use strict';

        // inject superuser flag to properly adjust UI.
        $scope.is_superuser = isSuperuser;

        // search results must be of type "project"
        $scope.resourceTypes = ['Project'];

        var params = $location.search();
        $scope.defaultCriteria = SearchHelper.parseParameters(params);

        /**
         * Launches the add-project modal.
         */
        $scope.addProject = function () {
            $scope.modalInstance = $modal.open({
                size: 'lg',
                templateUrl: 'app/projects/template/new.html',
                controller: 'ProjectNewController'
            });
        };

        var cuPromise = CurrentUser.resolve();

        cuPromise.then(function(user){
            $scope.projectSubscriptions = SubscriptionList.subsList(
                'project', user);
        });
    });
