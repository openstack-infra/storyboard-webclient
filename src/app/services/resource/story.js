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
 * The angular resource abstraction that allows us to access stories.
 *
 * @see storyboardApiSignature
 */
angular.module('sb.services').factory('Story',
    function (ResourceFactory, $resource, storyboardApiBase) {
        'use strict';

        var resource = ResourceFactory.build(
            '/stories/:id',
            '/stories/search',
            {id: '@id'}
        );

        var tags_signature = {
            'update': {
                method: 'PUT',
                //delete request body
                transformRequest: function(data) {
                    return '';
                }
            },
            'delete': {
                method: 'DELETE',
                //delete request body
                transformRequest: function(data) {
                    return '';
                }
            }
        };

        resource.tagsController = $resource(
                storyboardApiBase + '/stories/:id/tags', {id: '@id'},
                tags_signature);

        ResourceFactory.applySearch(
            'Story',
            resource,
            'title',
            {
                Text: 'q',
                StoryStatus: 'status',
                ProjectGroup: 'project_group_id',
                Project: 'project_id',
                User: 'assignee_id'
            }
        );

        return resource;
    });
