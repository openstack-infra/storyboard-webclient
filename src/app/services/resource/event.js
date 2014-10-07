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
 * A events service, that returns related events from a given story,
 * allowing to be reused between controllers. In the future it could
 * be reused by events belonging to different entities, not only
 * to stories.
 */
angular.module('sb.services').factory('Event',
    function ($q, $log, TimelineEvent, User) {
        'use strict';

        return {

            /**
             * Return events belonging to an story
             *
             * @param storyId   The id of the story to return events for.
             * @return An array with the matching events.
             */
            search: function (storyId) {
                var params = {};
                params.sort_field = 'id';
                params.sort_dir = 'asc';
                params.story_id = storyId;

                var deferred = $q.defer();

                TimelineEvent.query(params,
                    function (result) {
                        var eventResults = [];
                        result.forEach(function (item) {
                            item.author = User.get({id: item.author_id});
                            item.event_info = JSON.parse(item.event_info);

                            eventResults.push(item);
                        });
                        deferred.resolve(eventResults);
                    }, function() {
                        deferred.resolve([]);
                    }
                );
                return deferred.promise;
            }

        };
    });
