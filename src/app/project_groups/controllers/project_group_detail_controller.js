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
 * Project group detail &  manipulation controller. Usable for any view that
 * wants to view, edit, or delete a project group, though views don't have to
 * use all the functions therein. Includes flags for busy time, error responses
 * and more.
 *
 * This controller assumes that the $stateParams object is both injectable and
 * contains an ":id" property that indicates which project should be loaded. At
 * the moment it will only set a 'isLoading' flag to indicate that data is
 * loading. If loading the data is anticipated to take longer than 3 seconds,
 * this will need to be updated to display a sane progress.
 *
 * Do not allow loading of this (or any) controller to take longer than 10
 * seconds. 3 is preferable.
 */
angular.module('sb.project_groups').controller('ProjectGroupDetailController',
    function ($scope, $state, $stateParams, ProjectGroup) {
        'use strict';

        // Parse the ID
        var id = $stateParams.hasOwnProperty('id') ?
            parseInt($stateParams.id, 10) :
            null;

        /**
         * The project group we're manipulating right now.
         *
         * @type ProjectGroup
         */
        $scope.projectGroup = {};

        /**
         * UI flag for when we're initially loading the view.
         *
         * @type {boolean}
         */
        $scope.isLoading = true;

        /**
         * UI view for when a change is round-tripping to the server.
         *
         * @type {boolean}
         */
        $scope.isUpdating = false;

        /**
         * Any error objects returned from the services.
         *
         * @type {{}}
         */
        $scope.error = {};

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


        // Sanity check, do we actually have an ID? (zero is falsy)
        if (!id && id !== 0) {
            // We should never reach this, however that logic lives outside
            // of this controller which could be unknowningly refactored.
            $scope.error = {
                error: true,
                error_code: 404,
                error_message: 'You did not provide a valid ID.'
            };
            $scope.isLoading = false;
        } else {
            // We've got an ID, so let's load it...
            ProjectGroup.read(
                {'id': id},
                function (result) {
                    // We've got a result, assign it to the view and unset our
                    // loading flag.
                    $scope.projectGroup = result;
                    $scope.isLoading = false;
                },
                handleServiceError
            );
        }

        /**
         * Scope method, invoke this when you want to update the project.
         */
        $scope.update = function () {
            // Set our progress flags and clear previous error conditions.
            $scope.isUpdating = true;
            $scope.error = {};

            // Invoke the save method and wait for results.
            $scope.projectGroup.$update(
                function () {
                    // Unset our loading flag and navigate to the detail view.
                    $scope.isUpdating = false;
                    $state.go('project_groups.detail', {
                        id: $scope.projectGroup.id
                    });
                },
                handleServiceError
            );
        };


        /**
         * Scope method, invoke this when you'd like to delete this project.
         */
        $scope.remove = function () {
            // Set our progress flags and clear previous error conditions.
            $scope.isUpdating = true;
            $scope.error = {};

            // Try to delete.
            $scope.projectGroup.$delete(
                function () {
                    // The deletion was successful, so head back to the list
                    // view.
                    $scope.isUpdating = false;
                    $state.go('project_groups.list');
                },
                handleServiceError
            );
        };
    });
