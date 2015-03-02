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
    function ($scope, $modalInstance, Preference, TimelineEventTypes) {
        'use strict';

        function init() {
            TimelineEventTypes.forEach(function (type) {
                var pref_name = 'display_events_' + type;
                $scope[pref_name] = Preference.get(pref_name);
            });
        }

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.save = function () {

            TimelineEventTypes.forEach(function (type) {
                var pref_name = 'display_events_' + type;
                var old_value = Preference.get(pref_name);
                var new_value = $scope[pref_name];

                if (old_value !== new_value) {
                    Preference.set(pref_name, new_value);
                }
            });

            return $modalInstance.close();
        };

        init();

    })
;
