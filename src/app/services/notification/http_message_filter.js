/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * Notification interceptors for this library.
 */
angular.module('sb.services')
    .run(function (Notification, Priority) {
        'use strict';

        /**
         * Template load requests are done via $http, so we need to filter
         * those out first.
         */
        function filterTemplateRequests(message) {
            if (message.type !== 'http') {
                return;
            }

            var request = message.cause;
            var url = request.config.url;

            if (url.substr(-5) === '.html') {
                return true;
            }
        }

        /**
         * A notification interceptor that filters successful HTTP requests.
         * It's registered at priority 999 (the lowest) so that other
         * interceptors can get access to this message first (ex: statistics).
         */
        function filterSuccessful(message) {
            var response = message.cause;
            if (message.type !== 'http' || !response) {
                return;
            }

            // All 200 requests are filtered out.
            if (response.status === 200) {
                return true;
            }
        }

        /**
         * A notification interceptor that rewrites HTTP status codes to
         * human readable messages.
         */
        function rewriteHttpStatus(message) {

            if (message.type !== 'http') {
                // Do nothing.
                return;
            }

            var httpStatus = message.message;
            var request = message.cause;

            if (!httpStatus || !request || !request.data) {
                return;
            }
            var data = request.data;
            var method = request.config.method;
            var url = request.config.url;

            message.message = httpStatus + ': ' + method + ' ' + url + ': ';

            if (data.hasOwnProperty('faultstring')) {
                message.message += data.faultstring;
            } else {
                message.message += 'No error details available.';
            }
        }

        // Apply the interceptors.
        Notification.intercept(filterTemplateRequests, Priority.BEFORE);
        Notification.intercept(filterSuccessful, Priority.LAST);
        Notification.intercept(rewriteHttpStatus, Priority.AFTER);
    });
