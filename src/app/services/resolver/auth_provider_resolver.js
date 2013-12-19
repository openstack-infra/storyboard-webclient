/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
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

/**
 * This collection of utility methods allow us to pre-resolve AuthProvider
 * resources before a UI route switch is completed.
 *
 * @author Michael Krotscheck
 */
angular.module('sb.services').constant('AuthProviderResolver', {

    /**
     * Resolves all available authorization providers.
     */
    resolveAuthProviders: function ($q, AuthProvider, $log) {
        'use strict';

        $log.debug('Resolving AuthProviders');

        var deferred = $q.defer();

        AuthProvider.query(
            function (result) {
                deferred.resolve(result);
            },
            function (error) {
                $log.warn('Route resolution rejected for AuthProviders');
                deferred.reject(error);
            });

        return deferred.promise;
    },

    /**
     * Resolves an AuthProvider based on the unique ID passed via the
     * stateParams.
     */
    resolveAuthProvider: function (stateParamName) {
        'use strict';

        return function ($q, AuthProvider, $stateParams, $log) {

            var deferred = $q.defer();

            if (!$stateParams.hasOwnProperty(stateParamName)) {
                $log.warn('State did not contain property of name ' +
                    stateParamName);

                deferred.reject({
                    'error': true
                });
            } else {
                var id = $stateParams[stateParamName];

                $log.debug('Resolving AuthProvider: ' + id);

                AuthProvider.get({'id': id},
                    function (result) {
                        deferred.resolve(result);
                    },
                    function (error) {
                        $log.warn('Route resolution rejected for ' +
                            'AuthProvider ' + id);
                        deferred.reject(error);
                    });

                return deferred.promise;
            }
        };
    }
});
