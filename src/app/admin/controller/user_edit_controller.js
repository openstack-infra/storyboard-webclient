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
 * Edit user Controller.
 */
angular.module('sb.admin').controller('UserEditController',
    function ($scope, user, $state, storyboardApiBase) {
        'use strict';

        $scope.user = user;

        $scope.save = function () {
            /**
             * Delete the email field to avoid trying to save a
             * user with a blank email address.
             */
            if (!$scope.user.email) {
                delete $scope.user.email;
            }
            $scope.user.$update(function () {
                $state.go('sb.admin.user');
            });
        };

        $scope.cancel = function () {
            $state.go('sb.admin.user');
        };
    });
