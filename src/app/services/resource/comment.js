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
 * The angular resource abstraction that allows us to access discussions that
 * are surrounding stories.
 *
 * @see storyboardApiSignature
 */
angular.module('sb.services').factory('Comment',
    function (ResourceFactory, $resource, storyboardApiBase) {
        'use strict';

        var resource = ResourceFactory.build(
            '/stories/:story_id/comments/:id',
            '/stories/0/search',
            {
                id: '@id',
                story_id: '@story_id'
            }
        );

        var historySignature = {
            'get': {
                method: 'GET',
                isArray: true
            }
        }

        resource.History = $resource(
            storyboardApiBase + '/stories/:story_id/comments/:id/history',
            {
                id: '@id',
                story_id: '@story_id'
            },
            historySignature
        );

        return resource;
    });
