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
 * This directive may be attached to input elements, and calls the 'focus()'
 * method on that element whenever it is added to the DOM (whenever the link())
 * phase is run)
 */
angular.module('sb.util').directive('focus',
    function ($timeout) {
        'use strict';

        return {
            link: function ($scope, $element, $attrs) {

                var focus = $scope.$eval($attrs.focus);
                if (focus === undefined) {
                    focus = true;
                }

                // If focus is set to false, don't actually do anything.
                if (!focus) {
                    return;
                }

                // Extract the element...
                var e = $element[0];

                if (!!e && !!e.focus) {
                    $timeout(function () {
                        e.focus();
                    }, 10);
                }
            }
        };
    });