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
 * A Project
 */
angular.module('sb.project_group').controller('ProjectGroupListController',
    function ($scope, $modal, SubscriptionList, CurrentUser) {
        'use strict';

        // search results must be of type "ProjectGroup"
        $scope.resourceTypes = ['ProjectGroup'];

        // Projects have no default criteria
        $scope.defaultCriteria = [];

        /**
         * Create a new project-group.
         */
        $scope.newProjectGroup = function () {
            $scope.modalInstance = $modal.open(
                {
                    templateUrl: 'app/project_group/template/new.html',
                    controller: 'ProjectGroupNewController'
                });

            $scope.modalInstance.result.then(function (projectGroup) {
                    // On success, go to the project group detail.
                    $scope.showMobileNewMenu = false;
                    $state.go(
                        'sb.project_group.detail',
                        {id: projectGroup.id}
                    );
                });
        };

        //GET list of project group subscriptions
        var cuPromise = CurrentUser.resolve();

        cuPromise.then(function(user){
            $scope.projectGroupSubscriptions =
            SubscriptionList.subsList(
                'project_group', user);
        });

    });
