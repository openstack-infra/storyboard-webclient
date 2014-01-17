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
 * In lieu of extension, here we're injecting our common API signature that
 * can be reused by all of our services.
 *
 * @author Michael Krotscheck
 */
angular.module('sb.services')
    .factory('storyboardApiSignature', function () {
        'use strict';

        return {
            'create': {
                method: 'POST'
            },
            'get': {
                method: 'GET',
                cache: false
            },
            'save': {
                method: 'PUT'
            },
            'delete': {
                method: 'DELETE'
            },
            'query': {
                method: 'GET',
                isArray: true,
                transformResponse: function (data) {
                    if (data.error) {
                        return data;
                    } else {
                        return data.results;
                    }
                }
            }
        };
    }
);