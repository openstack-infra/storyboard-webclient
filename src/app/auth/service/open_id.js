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
 * Our OpenID token resource, which adheres to the OpenID connect specification
 * found here; http://openid.net/specs/openid-connect-basic-1_0.html
 */
angular.module('sb.auth').factory('OpenId',
    function ($location, $window, $log, StringUtil, UrlUtil, storyboardApiBase,
              localStorageService) {
        'use strict';

        var storageKey = 'openid_authorize_state';
        var authorizeUrl = storyboardApiBase + '/openid/authorize';
        var tokenUrl = storyboardApiBase + '/openid/token';
        var redirectUri = UrlUtil.buildApplicationUrl('/auth/token');
        var clientId = $location.host();

        return {
            /**
             * Asks the OAuth endpoint for an authorization token given
             * the passed parameters.
             */
            authorize: function () {
                // Create and store a random state parameter.
                var state = StringUtil.randomAlphaNumeric(20);
                localStorageService.set(storageKey, state);

                var openIdParams = {
                    response_type: 'code',
                    client_id: clientId,
                    redirect_uri: redirectUri,
                    scope: '',
                    state: state
                };

                $window.location.href = authorizeUrl + '?' +
                    UrlUtil.serializeParameters(openIdParams);
            },

            /**
             * Asks our OpenID endpoint to convert an authorization token to
             * an access token.
             */
            token: function (params) {
                $log.warn(params, tokenUrl);
            }
        };
    });