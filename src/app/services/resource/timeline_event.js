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
angular.module('sb.services').factory('TimelineEvent',
    function (storyboardApiBase, $resource, $rootScope) {
        'use strict';

        var events_signature = {
			'query': {
                method: 'GET',
                responseType: 'json',
                isArray: true,
                cache: false,
                transformResponse: function(data, headersGetter) {
                    $rootScope.event_count = parseInt(
                                                headersGetter()['x-total']);
                    return data;
                }
            }
        };

        return $resource(storyboardApiBase + '/stories/:story_id/events/:id',
                         {
                             id: '@id',
                             story_id: '@story_id'
                         },
                         events_signature
                        );
    });
