/*
 * Copyright (c) 2016 Codethink Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * Controller for adding notes to tasks
 */

angular.module('sb.story').controller('StoryTaskNotesController',
    function ($log, $scope, $state, task, $modalInstance, Task) {
        'use strict';

        $scope.task = angular.copy(task);

         /**
         * Generic service error handler. Assigns errors to the view's scope,
         * and unsets our flags.
         */
        function handleServiceError(error) {
            // We've encountered an error.
            $scope.error = error;
            $scope.isLoading = false;
            $scope.isUpdating = false;
        }

        /**
         * Resets our loading flags.
         */
        function handleServiceSuccess() {
            $scope.isLoading = false;
            $scope.isUpdating = false;
            task.link = $scope.task.link;
        }


        /**
         * Resets any changes and toggles the form back.
         */
        $scope.cancel = function () {
            $modalInstance.close('cancel');
        };


        /**
         * Scope method, invoke this when you want to update the task.
         */
        $scope.update = function () {
            // Set our progress flags and clear previous error conditions.
            $scope.isUpdating = true;
            $scope.error = {};

            // Invoke the save method and wait for results.
            var params = {
                id: task.id,
                link: $scope.task.link
            }
            Task.update(params, function () {
                    $modalInstance.close('save');
                    handleServiceSuccess();
                },
                handleServiceError
            );
        };

        // Set our progress flags and clear previous error conditions.

        $scope.close = function () {
            $modalInstance.close('closed');
        };
    });
