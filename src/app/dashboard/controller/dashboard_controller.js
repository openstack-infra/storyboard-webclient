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
    function ($q, $scope, CurrentUser, Story, SubscriptionList,
            SubscriptionEvent) {
        'use strict';

        // Load the list of current assigned stories.
        $scope.assignedStories = Story.browse({
            assignee_id: CurrentUser.id,
            status: 'active'
        });

        function loadEvents() {
            // Load the user's subscription events.
            $scope.subscriptionEvents = null;
            SubscriptionEvent.browse({
                subscriber_id: CurrentUser.id
            }, function (results) {

                // First go through the results and decode the event info.
                results.forEach(function (row) {
                    if (row.hasOwnProperty('event_info')) {
                        row.event_info = JSON.parse(row.event_info);
                    } else {
                        row.event_info = {};
                    }
                });

                $scope.subscriptionEvents = results;
            });
        }

        loadEvents();

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

        //GET list of story subscriptions
        var cuPromise = CurrentUser.resolve();

        cuPromise.then(function(user){
            $scope.storySubscriptions = SubscriptionList.subsList(
                'story', user);
        });

    });
