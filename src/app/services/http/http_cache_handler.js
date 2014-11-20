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
 * An HTTP request interceptor that pays attention to POST/PUT/DELETE operations
 * on specific resources, and replaces the local cached data with the resulting
 * value.
 */
angular.module('sb.services').factory('httpCacheHandler',
    function ($q, $cacheFactory) {
        'use strict';

        var $httpDefaultCache = $cacheFactory.get('$http');

        return {
            /**
             * Handle a success response.
             */
            response: function (response) {
                var method = response.config.method;
                var url = response.config.url;
                var obj = response.data;

                // Ignore GET methods.
                switch (method) {
                    case 'POST':
                        if (obj.hasOwnProperty('id')) {
                            $httpDefaultCache.put(url + '/' + obj.id, obj);
                        }
                        break;
                    case 'PUT':
                        $httpDefaultCache.put(url, obj);
                        break;
                    case 'DELETE':
                        $httpDefaultCache.remove(url);
                        break;
                    default:
                        break;
                }

                return response;
            },

            /**
             * Handle a fail response.
             */
            responseError: function (response) {
                return $q.reject(response);
            }
        };
    })
    // Attach the HTTP interceptor.
    .config(function ($httpProvider) {
        'use strict';
        $httpProvider.interceptors.push('httpCacheHandler');
    });