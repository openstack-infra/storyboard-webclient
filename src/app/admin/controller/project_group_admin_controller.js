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
angular.module('sb.admin').controller('ProjectGroupAdminController',
    function ($scope, $modal, ProjectGroup) {
        'use strict';

        // Preload our project groups.
        $scope.projectGroups = [];

        $scope.addProjectGroup = function () {
            $modal.open(
                {
                    templateUrl: 'app/admin/template/project_group_new.html',
                    controller: 'ProjectGroupNewController'
                }).result.then(function (projectGroup) {
                    // On success, go to the project group detail.
                    console.warn(projectGroup);
                });
        };

        $scope.deleteProjectGroup = function (projectGroup) {
            var modalInstance = $modal.open({
                templateUrl: 'app/admin/template/project_group_delete.html',
                controller: 'ProjectGroupDeleteController',
                resolve: {
                    projectGroup: function () {
                        return projectGroup;
                    }
                }
            });

            // Search after a successful completion.
            modalInstance.result.then(
                function () {
                    $scope.search();
                }
            );
        };

        $scope.search = function () {
            $scope.projectGroups = ProjectGroup.query({});

        };

        // Initialize
        $scope.search();
    });