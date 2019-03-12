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
 * A service that keeps track of the last page we visited.
 */
angular.module('sb.util').factory('LastLocation',
    function ($rootScope, localStorageService, $state) {
        'use strict';

        // The published API.
        return {

            /**
             * Navigate to the last recorded state.
             *
             * @param defaultStateName A fallback state.
             * @param defaultStateParams Default state parameters.
             */
            go: function (defaultStateName, defaultStateParams) {
                var last = localStorageService.get('lastLocation');
                if (!last) {
                    $state.go(defaultStateName, defaultStateParams);
                } else {
                    last = angular.fromJson(last);
                    $state.go(last.name, last.params);
                }
            },

            /**
             * onStateChange handler. Stores the next destination state, and its
             * parameters, so we can keep revisit the history after bouncing out
             * for authentication.
             *
             * @param transition The transition to record the destination state of.
             */
            onStateChange: function(transition) {
                if (transition.$to().name.indexOf('sb.auth') === -1) {
                    var data = {
                        'name': transition.$to().name,
                        'params': transition.params()
                    };
                    localStorageService.set('lastLocation',
                        angular.toJson(data));
                }
            }
        };
    });
