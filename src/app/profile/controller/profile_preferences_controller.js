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
 * Preferences controller for our user profile. Allows explicit editing of
 * individual preferences.
 */
angular.module('sb.profile').controller('ProfilePreferencesController',
    function ($scope, Preference, Notification, Severity) {
        'use strict';

        $scope.preferences = Preference.getAll();

        /**
         * Save all the preferences.
         */
        $scope.save = function () {
            $scope.saving = true;

            Preference.saveAll($scope.preferences).then(
                function () {
                    Notification.send(
                        'preferences',
                        'Preferences Saved!',
                        Severity.SUCCESS
                    );
                    $scope.saving = false;
                },
                function () {
                    $scope.saving = false;
                }
            );
        };
    });
