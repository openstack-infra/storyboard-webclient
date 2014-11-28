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
    function ($scope, Preference, loggedUser, $http, CurrentUser) {
        'use strict';

        var cache = $http.defaults.cache.get('userPreferences');
        if (cache) {
            $scope.pageSize = cache.page_size;
            $scope.enabled_event_types = angular.fromJson(
                    cache.display_events_filter);
        }
        else {
            // get from current user
            CurrentUser.getUserPreferences(loggedUser.id).then(
                function(preferences) {
                    $scope.pageSize = preferences.page_size;
                    $scope.enabled_event_types = angular.fromJson(
                        preferences.display_events_filter);
                    CurrentUser.setCacheUserPreferences(preferences);
                }, function() {
                    $scope.pageSize = null;
                    $scope.enabled_event_types = null;
                }
            ); 
        }

        $scope.save = function () {
            var event_str = angular.toJson($scope.enabled_event_types);
            var preferences = {'page_size': $scope.pageSize,
                           'display_events_filter': event_str};
            Preference.set({id: loggedUser.id}, preferences);
            CurrentUser.setCacheUserPreferences(preferences);

            $scope.message = 'Preferences Saved!';
        };
    });
