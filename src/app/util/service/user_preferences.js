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
 * A service gets the value of user preferences.
 */
angular.module('sb.util')
    .factory('UserPreferences', function (Preference, CurrentUser, $q) {
        'use strict';

        // The published API.
        return {
            get: function () {
                var deferred = $q.defer();
                CurrentUser.resolve().then(
                    function (user) {
                        // have the user, check the preferences
                        Preference.get({id: user.id},
                            function (preferences) {
                                deferred.resolve(preferences);
                            }, function() {
                                deferred.resolve(null);
                            }
                        );
                    },
                    function () {
                        deferred.resolve(null);
                    }
                );
                return deferred.promise;
            },

        };
    })
    .run(function () {
        'use strict';
    });
