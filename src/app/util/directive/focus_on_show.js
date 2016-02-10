/*
 * Copyright (c) 2016 Codethink Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * Service for displaying a date/time picker.
 */
angular.module('sb.util')
    .directive('focusOnShow', function($timeout) {
        'use strict';

        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                if (attrs.ngShow) {
                    scope.$watch(attrs.ngShow, function(show) {
                        if (show) {
                            $timeout(function() {
                                element[0].focus();
                            }, 0);
                        }
                    });
                }
            }
        };
    }
);
