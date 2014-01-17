/*
 * Copyright (c) 2013 Hewlett-Packard Development Company, L.P.
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
 * An HTTP request interceptor that broadcasts response status codes to the
 * rest of the application as events. These events are broadcast before the
 * error response itself is passed back to the receiving closure, so please
 * keep that in mind as you base your application logic on it.
 *
 * @author Michael Krotscheck
 */
angular.module('sb.services')
    // Create an HTTP Error Broadcaster that intercepts requests and lets the
    // rest of the application know about what happened.
    .factory('httpErrorBroadcaster', function ($q, $rootScope) {
        'use strict';

        function sendEvent(status, body) {
            // Only send an event if a status is passed.
            if (!!status) {
                $rootScope.$broadcast('http_' + status, body || {});
            }
        }


        return {
            /**
             * Handle a success response.
             */
            response: function (response) {
                if (!!response) {
                    sendEvent(response.status);
                }
                return response;
            },

            /**
             * Handle a fail response.
             */
            responseError: function (response) {

                if (!!response) {
                    sendEvent(response.status, response.data);
                }

                return $q.reject(response);
            }
        };
    })
    // Attach the HTTP interceptor.
    .config(function ($httpProvider) {
        'use strict';
        $httpProvider.interceptors.unshift('httpErrorBroadcaster');
    });