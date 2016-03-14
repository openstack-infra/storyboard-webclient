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
    function ($q, $scope, currentUser, Story, SubscriptionList,
            SubscriptionEvent, Task) {
        'use strict';

        // Load the list of current assigned tasks.

        $scope.filterTasks = Task.browse({
            assignee_id: currentUser.id
        }, function(tasks) {
            var todo = [];
            var progress = [];
            var review = [];
            var invalid = [];

            angular.forEach(tasks, function(task) {
                task.type = 'Task';
                if (task.status === 'review') {
                    review.push(task);
                }
                else if (task.status === 'todo') {
                    todo.push(task);
                }
                else if (task.status === 'inprogress') {
                    progress.push(task);
                }
                else {
                    invalid.push(task);
                }
            });

            $scope.reviewTasks = review;
            $scope.todoTasks = todo;
            $scope.progressTasks = progress;
            $scope.invalidTasks = invalid;
        });

        /**
         * Updates the task list.
         */
        $scope.updateTask = function (task, fieldName, value) {

            if(!!fieldName) {
                task[fieldName] = value;
            }

            task.$update(function () {
                $scope.showTaskEditForm = false;
            });
        };

        $scope.createdStories = Story.browse({
            creator_id: currentUser.id,
            status: 'active'
        });

        function loadEvents() {
            // Load the user's subscription events.
            $scope.subscriptionEvents = null;
            SubscriptionEvent.browse({
                subscriber_id: currentUser.id
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
                $scope.collapsedEvents = results.length > 1;
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

        $scope.storySubscriptions = SubscriptionList.subsList(
                'story', currentUser);

    });
