/*
 * Copyright (c) 2015-2016 Codethink Limited
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
 * Controller for the "new worklist" modal popup.
 */
angular.module('sb.worklist').controller('AddWorklistController',
    function ($scope, $modalInstance, $state, params, Worklist) {
        'use strict';

        /**
         * Saves the worklist.
         */
        $scope.save = function () {
            $scope.isSaving = true;
            $scope.worklist.$create(
                function (result) {
                    $scope.isSaving = false;
                    $modalInstance.dismiss('success');
                    $state.go('sb.worklist.detail', {worklistID: result.id});
                }
            );
        };

        /**
         * Close this modal without saving.
         */
        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.isSaving = false;
        $scope.worklist = new Worklist({title: ''});
    });
