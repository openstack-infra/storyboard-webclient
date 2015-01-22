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
 * A controller that manages our logged-in dashboard
 */
angular.module('sb.dashboard').controller('DashboardController',
    function ($scope, currentUser, Story, SubscriptionEvent, $q) {
        'use strict';

        // Load the list of current assigned stories.
        $scope.assignedStories = Story.browse({
            assignee_id: currentUser.id,
            status: 'active'
        });

        function loadEvents() {
            // Load the user's subscription events.
            $scope.subscriptionEvents = null;
            SubscriptionEvent.browse({
                subscriber_id: currentUser.id
            }, function (results) {
                var story_event_map = {};
                var events = [];

                // First go through the results and decode the event info.
                results.forEach(function (row) {
                    if (row.hasOwnProperty('event_info')) {
                        row.event_info = JSON.parse(row.event_info);
                    } else {
                        row.event_info = {};
                    }
                });

                // Pull out individual story ID's.
                results.forEach(function (row) {
                    // Sort by story_id found in the event info.
                    if (row.event_info.hasOwnProperty('story_id')) {
                        var story_id = row.event_info.story_id;
                        if (!story_event_map.hasOwnProperty(story_id)) {
                            story_event_map[story_id] = {
                                story_id: story_id,
                                story_title: row.event_info.story_title,
                                event_type: 'story_events',
                                events: []
                            };
                            events.push(story_event_map[story_id]);
                        }
                        story_event_map[story_id].events.push(row);
                    } else {
                        events.push(row);
                    }
                });

                $scope.subscriptionEvents = events;
            });
        }

        $scope.removeEvent = function (event) {
            var deferred = $q.defer();
            deferred.resolve([
                event.$delete(function () {
                    var idx = $scope.subscriptionEvents.indexOf(event);
                    $scope.subscriptionEvents.splice(idx, 1);
                })]);
            return deferred.promise;
        };

        $scope.removeAllEvents = function () {
            // delete all events
            var promises = [];
            for (var i = 0; i < $scope.subscriptionEvents.length; i++) {
                var event = $scope.subscriptionEvents[i];
                var promise = $scope.removeEvent(event);
                promises.push(promise);
            }

            // reload new events
            $q.all(promises).then(loadEvents);
        };
    });
