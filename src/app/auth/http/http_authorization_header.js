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
 * An HTTP request interceptor that attaches an authorization to every HTTP
 * request, assuming it exists and isn't expired.
 */
angular.module('sb.auth').factory('httpAuthorizationHeader',
    function (AccessToken) {
        'use strict';

        return {
            request: function (request) {

                // TODO(krotscheck): Only apply the token to requests to
                // storyboardApiBase.
                var token = AccessToken.getAccessToken();
                var type = AccessToken.getTokenType();
                if (!!token) {
                    request.headers.Authorization = type + ' ' + token;
                }
                return request;
            }
        };
    })
    // Attach the HTTP interceptor.
    .config(function ($httpProvider) {
        'use strict';

        $httpProvider.interceptors.push('httpAuthorizationHeader');
    });
