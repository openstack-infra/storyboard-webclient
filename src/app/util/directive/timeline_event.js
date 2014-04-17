/*
 * Copyright (c) 2014 Mirantis Inc.
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

angular.module('sb.util').directive('timelineEvent', function($log) {
    'use strict';

    return {
            restrict: 'E',
            replace: true,
            link: function(scope, element, attrs) {
                var tlEvent;
                try {
                    tlEvent = JSON.parse(attrs.tlEvent);
                    scope.event_type = tlEvent.event_type;
                } catch (error) {
                    $log.warn(error);
                    scope.event_type = 'unknown';
                }
            },
            templateUrl: 'app/templates/story/comments/template_switch.html'
        };
});