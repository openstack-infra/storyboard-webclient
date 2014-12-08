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
 * Issue token controller.
 */
angular.module('sb.profile').controller('ProfileTokenNewController',
    function ($q, $log, $scope, $modalInstance, UserToken, user) {
        'use strict';

        /**
         * Flag for the UI to indicate that we're saving.
         *
         * @type {boolean}
         */
        $scope.isSaving = false;

        /**
         * The new token.
         *
         * @type {UserToken}
         */
        $scope.token = new UserToken({
            user_id: user.id,
            expires_in: 3600
        });

        /**
         * Saves the project group
         */
        $scope.save = function () {
            $scope.isSaving = true;
            $scope.token.$create(
                function (token) {
                    $modalInstance.close(token);
                    $scope.isSaving = false;
                },
                function () {
                    $scope.isSaving = false;
                }
            );
        };

        /**
         * Close this modal without saving.
         */
        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    });