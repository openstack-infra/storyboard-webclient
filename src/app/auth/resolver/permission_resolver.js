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
 * The permission resolver allows us to require certain permissions for specific
 * UI routes.
 */
angular.module('sb.auth').constant('PermissionResolver',
    {
        /**
         * Rejects the route if the current user does not have the required
         * permission.
         */
        requirePermission: function (permName, requiredValue) {
            'use strict';

            return function ($q, $log, PermissionManager) {
                var deferred = $q.defer();

                PermissionManager.resolve(permName).then(
                    function (value) {
                        $log.debug('permission:', permName, requiredValue,
                            value);
                        if (value === requiredValue) {
                            deferred.resolve(value);
                        } else {
                            deferred.reject(value);
                        }
                    },
                    function (error) {
                        $log.debug('permission:', error);
                        deferred.reject(error);
                    }
                );

                return deferred.promise;
            };

        },

        /**
         * Resolves the value of the provided permission.
         */
        resolvePermission: function (permName) {
            'use strict';

            return function ($q, $log, PermissionManager) {
                var deferred = $q.defer();

                PermissionManager.resolve(permName).then(
                    function (value) {
                        deferred.resolve(value);
                    },
                    function (error) {
                        deferred.reject(error);
                    }
                );

                return deferred.promise;
            };

        }
    });
