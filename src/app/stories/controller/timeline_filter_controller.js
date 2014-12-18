/*
 * Copyright (c) 2014 Mirantis Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

angular.module('sb.story').controller('TimelineFilterController',
    function($scope, $modalInstance, $http, Preference, loggedUser,
             CurrentUser) {
        'use strict';

        function init() {
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
                        $scope.enabled_event_types = null;
                    }
                );
            }
        }

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.save = function () {
            var event_str = angular.toJson($scope.enabled_event_types);
            Preference.set({id: loggedUser.id},
                {'display_events_filter': event_str}
            );
            var preferences = {'page_size': $scope.pageSize,
                           'display_events_filter': event_str};
            CurrentUser.setCacheUserPreferences(preferences);

            return $modalInstance.close($scope.enabled_event_types);
        };

        init();

    })
;
