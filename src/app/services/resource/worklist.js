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
    function (ResourceFactory, $resource, storyboardApiBase, Task, Story) {
        'use strict';

        var resource = ResourceFactory.build(
            '/worklists/:id',
            '/worklists/search',
            {id: '@id'},
            false, true
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

        ResourceFactory.applySearch(
            'Worklist',
            resource,
            'title',
            {
                Text: 'title',
                Project: 'project_id',
                User: 'creator_id'
            }
        );

        function addItem(list, listitem) {
            return function(item) {
                item.list_item_id = listitem.id;
                item.type = listitem.item_type;
                item.position = listitem.list_position;
                list.push(item);
                list.sort(function(a, b) {
                    return a.position - b.position;
                });
            };
        }

        resource.resolveContents = function(worklist, items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.item_type === 'task') {
                    Task.get({
                        id: item.item_id
                    }).$promise.then(
                        addItem(worklist.items, item));
                } else if (item.item_type === 'story') {
                    Story.get({
                        id: item.item_id
                    }).$promise.then(
                        addItem(worklist.items, item));
                }
            }
        };

        resource.loadContents = function (worklist, resolveContents) {
            resource.ItemsController.get({
                id: worklist.id
            }).$promise.then(function(items) {
                if (resolveContents) {
                    worklist.items = [];
                    resource.resolveContents(worklist, items);
                } else {
                    worklist.items = items;
                }
            });
        };


        return resource;
    });
