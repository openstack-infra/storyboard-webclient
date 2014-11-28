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
    function($scope, $modalInstance, UserPreferences, Preference, currentUser) {
        'use strict';

        function init() {
            UserPreferences.get().then(
                function (preferences) {
                    if (preferences) {
                        $scope.enabled_event_types =
                            angular.fromJson(preferences.display_events_filter);
                    }
                }
            );

        }

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.save = function () {
            var event_str = angular.toJson($scope.enabled_event_types);
            Preference.set({id: currentUser.id},
                {'display_events_filter': event_str}
            );
            return $modalInstance.close($scope.enabled_event_types);
        };

        init();

    })
;
