/*
 * Copyright (c) 2016 Hewlett Packard Enterprise Development Company, L.P.
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
 * This $http interceptor ensures that the OAuth Token is always valid, fresh,
 * and reissued when needed.
 */
angular.module('sb.auth').factory('httpOAuthTokenInterceptor',
    function (AccessToken, $injector, $q, $log, $window) {

        'use strict';

        /**
         * Promise deferral for when we're in-flight of a refresh token request.
         *
         * @type {Promise}
         */
        var refreshPromise = null;

        /**
         * Returns the current access token, if available.
         * @returns {*} The access token.
         */
        function getCurrentToken() {
            return $q.when({
                type: AccessToken.getTokenType() || null,
                value: AccessToken.getAccessToken() || null,
                expired: AccessToken.isExpired() || AccessToken.expiresSoon(),
                refresh: AccessToken.getRefreshToken() || null
            });
        }

        /**
         * This method checks a token (see above) to see whether it needs to
         * be refreshed. If yes, it will refresh that token, and return a
         * promise that will update the token in the promise chain.
         * Otherwise, it will simply pass the token along to the header
         * decorator.
         *
         * @param {{}} token The token to check.
         * @returns {Promise}
         */
        function refreshIfNeeded(token) {
            // If it's not expired, just pass it on.
            if (!token.expired) {
                return $q.when(token);
            }

            // If we don't have a refresh token, pass it on.
            if (!token.refresh) {
                return $q.when(token);
            }

            // If the refresh promise is already in flight, return that. We
            // don't want to get caught in a situation where we try to refresh
            // more than once.
            if (refreshPromise) {
                $log.debug('Returning in-flight refresh promise.');
                return refreshPromise;
            }

            // We have to refresh.
            $log.debug('Attempting to refresh auth token.');
            var deferred = $q.defer();
            refreshPromise = deferred.promise;

            // Issue a refresh token request. We have to manually grab the
            // service from the injector here, because else we'd have a
            // circular injection dependency.
            var OpenId = $injector.get('OpenId');
            OpenId.token({
                grant_type: 'refresh_token',
                refresh_token: token.refresh
            }).then(
                function (data) {
                    AccessToken.setToken(data);
                },
                function () {
                    AccessToken.clear();
                    $window.location.reload();
                }
            ).finally(function () {
                // Inject the token, whether or not it exists, back into the
                // promise chain.
                deferred.resolve(getCurrentToken());

                // Clear the promise;
                refreshPromise = null;
            });

            return deferred.promise;
        }

        return {
            /**
             * The request interceptor ensures that the OAuth token, if
             * available, is attached to the HTTP request.
             *
             * @param request The request.
             * @returns {*} A promise that will resolve once we're sure we
             *              have a good token.
             */
            request: function (httpConfig) {
                /**
                 * Decorate the request with the header token, IFF it's
                 * available.
                 *
                 * @param token The token received from the promise chain.
                 * @returns {Promise} A promise that resolves the httpconfig
                 */
                function decorateHeader(token) {
                    if (token.type && token.value) {
                        httpConfig.headers.Authorization =
                            token.type + ' ' + token.value;
                    }
                    return $q.when(httpConfig);
                }

                // Are we an OpenID request? These get skipped.
                if(httpConfig.url.indexOf('/openid/') > -1) {
                    return $q.when(httpConfig);
                }

                // Build the interceptor promise chain for each request.
                return $q.when(getCurrentToken())
                    .then(refreshIfNeeded)
                    .then(decorateHeader);
            }
        };
    })
    // Attach the HTTP interceptor.
    .config(function ($httpProvider) {
        'use strict';

        $httpProvider.interceptors.unshift('httpOAuthTokenInterceptor');
    });
