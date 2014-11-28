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
                var defer = $q.defer();
                var current_user = CurrentUser.resolve();
                current_user.then(function(user) {
                    return user;
                })
                .then(function (user) {
                    Preference.get({id: user.id},
                        function (result) {
                            defer.resolve(result);
                        }, function() {
                            defer.resolve(null);
                        }
                    );
                });
                return defer.promise;
            }
        };
    });
