/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * This module acts as the central routing point for all errors that occur
 * within storyboard.
 */
angular.module('sb.notification').controller('NotificationsController',
    function ($scope, Notification) {
        'use strict';

        var defaultDisplayCount = 5;

        $scope.displayCount = defaultDisplayCount;

        $scope.notifications = [];

        /**
         * Remove a notification from the display list.
         *
         * @param notification
         */
        $scope.remove = function (notification) {
            var idx = $scope.notifications.indexOf(notification);
            if (idx > -1) {
                $scope.notifications.splice(idx, 1);
            }

            // If the notification list length drops below default, make
            // sure we reset the limit.
            if ($scope.notifications.length <= defaultDisplayCount) {
                $scope.displayCount = defaultDisplayCount;
            }
        };

        /**
         * Reveal more notifications, either current count + 5 or the total
         * number of messages, whichever is smaller.
         */
        $scope.showMore = function () {
            // Set this to something big.
            $scope.displayCount = Math.min($scope.notifications.length,
                    $scope.displayCount + 5);
        };

        /**
         * Set up a notification subscriber, and make sure it's removed when
         * the scope is destroyed.
         */
        $scope.$on('$destroy', Notification.subscribe(
                function (notification) {
                    $scope.notifications.push(notification);
                }
            )
        );
    });
