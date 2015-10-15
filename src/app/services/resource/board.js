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
            {id: '@id'}
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

        resource.getLane = function(board, id) {
            for (var n = 0; n < board.lanes.length; n++) {
                if (board.lanes[n].list_id === id) {
                    return board.lanes[n];
                }
            }
        };

        resource.loadContents = function(board, loadContents,
                                         resolveContents) {
            // The empty string is used to pass a false value to the endpoint.
            // See: https://bugs.launchpad.net/wsme/+bug/1493982
            Worklist.browse({
                board_id: board.id,
                hide_lanes: ''
            }).$promise.then(function(worklists) {
                board.worklists = worklists.sort(function(a, b) {
                    return resource.getLane(board, a.id).position -
                           resource.getLane(board, b.id).position;
                });
            }).then(function() {
                if (loadContents) {
                    for (var i = 0; i < board.worklists.length; i++) {
                        var worklist = board.worklists[i];
                        Worklist.loadContents(worklist, resolveContents);
                    }
                }
            });
        };

        return resource;
    });
