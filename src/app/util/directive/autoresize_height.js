/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
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

/**
 * This directive, when attached to a textarea field, will detect
 * keystrokes and automatically resize the height to the content + 1 line.
 */
angular.module('sb.util')
    .directive('autoresizeHeight', function () {
        'use strict';

        return {
            restrict: 'A',
            controller: function ($scope, $element) {

                // Extract metrics for later calculation.
                var paddingOffset = $element.innerHeight() - $element.height();
                var lineHeight = parseInt($element.css('line-height'), 10);

                /**
                 * Recalculate what height we're supposed to be.
                 */
                function recalculateHeight() {
                    // Shrink to zero so we can tell how much content we have.
                    $element.height(0);

                    // Capture the scroll height
                    var scrollHeight = $element.prop('scrollHeight');

                    // Figure out how many lines we actually have...
                    var contentHeight = (scrollHeight - paddingOffset);
                    var contentLines = Math.max(contentHeight / lineHeight, 1);

                    // Set the new height
                    $element.height((contentLines + 1) * lineHeight);
                }

                $scope.$watch(function () {
                    return $element.val();
                }, recalculateHeight);
            }
        };
    });