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
 * Controller for the project group member list.
 */
angular.module('sb.project_group').controller('ProjectGroupItemController',
    function ($scope, $log, ProjectGroupItem) {
        'use strict';

        $scope.projectGroupItems = [];
        $scope.loadingProjectGroupItems = false;

        if (!$scope.projectGroup) {
            return;
        }

        var id = $scope.projectGroup.id;

        $scope.loadingProjectGroupItems = true;
        ProjectGroupItem.browse({
                projectGroupId: id
            },
            function (results) {
                $scope.loadingProjectGroupItems = false;
                $scope.projectGroupItems = results;
                $scope.collapsed = results.length > 1;
            }, function (error) {
                $log.error(error);
                $scope.loadingProjectGroupItems = false;
            });
    });
