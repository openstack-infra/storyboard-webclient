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
 * A directive that renders subscription event messages.
 *
 * @see storyboardApiSignature
 */
angular.module('sb.dashboard').directive('subscriptionEvent',
    function ($log, User) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                subscriptionEvent: '@'
            },
            link: function (scope) {
                try {
                    var evt = JSON.parse(scope.subscriptionEvent);
                    scope.evt = evt;
                    if (evt.hasOwnProperty('author_id')) {
                        scope.author = User.get({id: evt.author_id});
                    }
                    scope.event_type = evt.event_type;
                    scope.created_at = evt.created_at;
                } catch (e) {
                    $log.error(e);
                }
            },
            templateUrl: 'app/dashboard/template/subscription_event.html'
        };
    });
