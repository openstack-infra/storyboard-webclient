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
 * URL and location manipulation utilities.
 *
 * @author Nikita Konovalov
 */
angular.module('sb.util').factory('UrlUtil',
    function ($location) {
        'use strict';

        return {
            /**
             * Return the full URL prefix of the application, without the #!
             * component.
             */
            getFullUrlPrefix: function () {
                var protocol = $location.protocol();
                var host = $location.host();
                var port = $location.port();

                return protocol + '://' + host + ':' + port;
            },

            /**
             * Build a HashBang url for this application given the provided
             * fragment.
             */
            buildApplicationUrl: function (fragment) {
                return this.getFullUrlPrefix() + '/#!' + fragment;
            },

            /**
             * Serialize an object into HTTP parameters.
             */
            serializeParameters: function (params) {
                var pairs = [];
                for (var prop in params) {
                    // Filter out system params.
                    if (!params.hasOwnProperty(prop)) {
                        continue;
                    }
                    pairs.push(
                        encodeURIComponent(prop) +
                            '=' +
                            encodeURIComponent(params[prop])
                    );
                }
                return pairs.join('&');
            }
        };
    }
);