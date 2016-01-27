/*
 * Copyright (c) 2015 Codethink Limited
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
 * The angular resource abstraction that allows us to access projects groups.
 *
 * @see ResourceFactory
 * @author Adam Coldrick
 */
angular.module('sb.services').factory('Board',
    function (ResourceFactory, Worklist, $resource, storyboardApiBase) {
        'use strict';

        var resource = ResourceFactory.build(
            '/boards/:id',
            '/boards/search',
            {id: '@id'},
            false, true
        );

        var permissionsSignature = {
            'create': {
                method: 'POST'
            },
            'get': {
                method: 'GET',
                cache: false,
                isArray: true
            },
            'update': {
                method: 'PUT'
            }
        };

        resource.Permissions = $resource(
            storyboardApiBase + '/boards/:id/permissions',
            {id: '@id'},
            permissionsSignature
        );

        ResourceFactory.applySearch(
            'Board',
            resource,
            'title',
            {
                Text: 'title',
                Project: 'project_id',
                User: 'creator_id'
            }
        );

        return resource;
    });
