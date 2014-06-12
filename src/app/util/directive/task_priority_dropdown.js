/*
 * Copyright (c) 2013 Hewlett-Packard Development Company, L.P.
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
 * A convenience directive that allows us to bind the current task priority onto
 * a control. This control will automatically render itself either as a
 * dropdown (if editable) or as a label (if not).
 *
 */
angular.module('sb.util').directive('taskPriorityDropdown',
    function () {
        'use strict';

        return {
            restrict: 'E',
            templateUrl: 'app/templates/util/task_priority_dropdown.html',
            scope: {
                priority: '@',
                onChange: '&',
                editable: '@'
            },
            link: function ($scope) {

                // Initialize the style.
                $scope.style = 'default';

                // Make sure our scope can set its own priority
                $scope.setPriority = function (newPriority) {
                    if (newPriority !== $scope.priority) {
                        $scope.priority = newPriority;
                        $scope.onChange({priority: newPriority});
                    }
                };
            }
        };
    });
