/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 * Copyright (c) 2016 Codethink Ltd.
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
 * The angular resource abstraction that allows us to access teams and their
 * details.
 *
 * @see storyboardApiSignature
 * @see ResourceFactory
 * @author Michael Krotscheck
 * @author Adam Coldrick
 */
angular.module('sb.services').factory('Team',
    function (ResourceFactory, $resource, storyboardApiBase) {
        'use strict';

        var resource = ResourceFactory.build(
            '/teams/:team_id',
            '/teams/search', // Not implemented.
            {
                team_id: '@team_id'
            }
        );

        var usersSignature = {
            'create': {
                method: 'PUT'
            },
            'get': {
                method: 'GET',
                isArray: true
            },
            'delete': {
                method: 'DELETE',
                transformRequest: function() {
                    return '';
                }
            }
        };

        resource.UsersController = $resource(
            storyboardApiBase + '/teams/:team_id/users',
            {team_id: '@team_id'},
            usersSignature);

        return resource;
    });
