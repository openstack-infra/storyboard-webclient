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
 * The angular resource abstraction that allows us to search, access, and
 * modify users.
 *
 * @see ResourceFactory
 * @author Michael Krotscheck
 */
angular.module('sb.services').factory('User',
    function (ResourceFactory, $resource, DSCacheFactory, storyboardApiBase) {
        'use strict';

        var signature = {
            'create': {
                method: 'POST'
            },
            'get': {
                method: 'GET'
            },
            'update': {
                method: 'PUT',
                interceptor: {
                    response: function(response) {
                        console.log(response);
                        var user = response.resource;
                        DSCacheFactory.get('defaultCache').put(
                            storyboardApiBase + '/user/' + user.id,
                            user);
                    }
                }
            },
            'delete': {
                method: 'DELETE'
            },
            'browse': {
                method: 'GET',
                isArray: true,
                responseType: 'json',
                cache: false
            },
            'search': {
                method: 'GET',
                url: storyboardApiBase + '/users/search',
                isArray: true,
                responseType: 'json',
                cache: false
            }
        };
        var resource = $resource(
            storyboardApiBase + '/users/:id',
            {id: '@id'},
            signature
        );

        ResourceFactory.applySearch(
            'User',
            resource,
            'full_name',
            {Text: 'q'}
        );

        return resource;
    });
