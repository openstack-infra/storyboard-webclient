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
angular.module('sb.services').factory('Worklist',
    function (ResourceFactory, $resource, storyboardApiBase) {
        'use strict';

        var resource = ResourceFactory.build(
            '/worklists/:id',
            '/worklists/search',
            {id: '@id'},
            false, true //turn off 'cache search results', and turn on 'disable
//                        cached GETs', respectively
        );

        var items_signature = {
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
            },
            'delete': {
                method: 'DELETE',
                transformRequest: function() {
                    return '';
                }
            }
        };

        resource.ItemsController = $resource(
            storyboardApiBase + '/worklists/:id/items/:item_id',
            {id: '@id', item_id: '@item_id'},
            items_signature);

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
            storyboardApiBase + '/worklists/:id/permissions',
            {id: '@id'},
            permissionsSignature
        );

        var filtersSignature = {
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
            },
            'delete': {
                method: 'DELETE',
                transformRequest: function() {
                    return '';
                }
            }
        };

        resource.Filters = $resource(
            storyboardApiBase + '/worklists/:id/filters/:filter_id',
            {id: '@id'},
            filtersSignature
        );

        ResourceFactory.applySearch(
            'Worklist',
            resource,
            'title',
            {
                Text: 'title',
                Project: 'project_id',
                Story: 'story_id',
                Task: 'task_id',
                User: 'creator_id'
            }
        );

        return resource;
    });
