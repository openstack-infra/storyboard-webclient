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

angular.module('sb.util').directive('timelineEvent', function() {
    'use strict';

    function resolveTemplateUrl(event_type) {
        // Not sure if it's safe enough to trust the type returned for the
        // api in this way.
        return 'app/templates/story/comments/' + event_type + '.html';
    }

    return {
            restrict: 'E',
            replace: true,
            link: function(scope, element, attrs) {
                var tlEvent = JSON.parse(attrs.tlEvent);
                scope.eventTemplateUrl = resolveTemplateUrl(tlEvent.event_type);
            },
            template: '<div ng-include="eventTemplateUrl"></div>'
    };
});