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
 * Project detail &  manipulation controller. Usable for any view that wants to
 * view, edit, or delete a project, though views don't have to use all the
 * functions therein. Includes flags for busy time, error responses and more.
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
angular.module('sb.projects').controller('ProjectDetailController',
    function ($scope, $rootScope, $state, $stateParams, Project, Story,
              Session, isSuperuser, CurrentUser, Subscription) {
        'use strict';

        // Parse the ID
        var id = $stateParams.hasOwnProperty('id') ?
            parseInt($stateParams.id, 10) :
            null;

        /**
         * The project we're manipulating right now.
         *
         * @type Project
         */
        $scope.project = loadProject();

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

        /**
         * Resets our loading flags.
         */
        $scope.projectSubscription = {};
        $scope.resolvedUser = false;
        function handleServiceSuccess() {
            $scope.isLoading = false;
            $scope.isUpdating = false;
            // Get subscriptions
            var cuPromise = CurrentUser.resolve();

            cuPromise.then(function(user){
                $scope.projectSubscription = Subscription.browse({
                    target_type: 'project',
                    target_id: $scope.project.id,
                    user_id: user.id
                });
                $scope.resolvedUser = true;
            });
        }

        /**
         * Load the project
         */
        function loadProject() {
            return Project.get(
                {'id': id},
                function (result) {
                    handleServiceSuccess();
                    return result;
                },
                handleServiceError
            );
        }

        /**
         * Toggles the form back.
         */
        $scope.cancel = function () {
            loadProject();
            $scope.showEditForm = false;
        };

        /**
         * Toggle/display the edit form
         */
        $scope.toggleEditMode = function () {
            if (isSuperuser) {
                $scope.showEditForm = !$scope.showEditForm;

                // Deferred timeout request for a re-rendering of elastic
                // text fields, since the size calculation breaks when
                // visible: false
                setTimeout(function () {
                    $rootScope.$broadcast('elastic:adjust');
                }, 1);
            } else {
                $scope.showEditForm = false;
            }
        };

        /**
         * Scope method, invoke this when you want to update the project.
         */
        $scope.update = function () {
            // Set our progress flags and clear previous error conditions.
            $scope.isUpdating = true;
            $scope.error = {};

            // Invoke the save method and wait for results.
            $scope.project.$update(
                function () {
                    // Unset our loading flag and navigate to the detail view.
                    $scope.isUpdating = false;
                    $scope.showEditForm = false;
                    handleServiceSuccess();
                },
                handleServiceError
            );
        };
    });
