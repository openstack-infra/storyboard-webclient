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
 * New User modal controller.
 */
angular.module('sb.profile').controller('UserNewController',
    function ($log, $scope, $modalInstance, User) {
        'use strict';

        /**
         * Flag for the UI to indicate that we're saving.
         *
         * @type {boolean}
         */
        $scope.isSaving = false;

        /**
         * The new user.
         *
         * @type {User}
         */
        $scope.user = new User();

        /**
         * Saves the user group
         */
        $scope.save = function () {
            $scope.isSaving = true;

            // Create a new user group
            $scope.user.$create(function (user) {
                $modalInstance.close(user);
            }, function (error) {
                $scope.isSaving = false;
                $log.error(error);
                $modalInstance.dismiss(error);
            });
        };

        /**
         * Close this modal without saving.
         */
        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    });