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
 * The angular resource abstraction that allows us to access children of
 * project groups.
 *
 * @author Michael Krotscheck
 */
angular.module('sb.services').factory('ProjectGroupItem',
    function ($resource, storyboardApiBase) {
        'use strict';
        return $resource(storyboardApiBase +
                '/project_groups/:projectGroupId/projects/:id',
            {
                projectGroupId: '@projectGroupId',
                id: '@id'
            },
            {
                'create': {
                    method: 'PUT',
                    transformRequest: function () {
                        // The API endpoint takes no payload.
                        return '';
                    }
                },
                'delete': {
                    method: 'DELETE'
                },
                'query': {
                    method: 'GET',
                    isArray: true,
                    responseType: 'json'
                }
            }
        );
    });
