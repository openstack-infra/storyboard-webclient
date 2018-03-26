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
 * A convenience directive that allows us to bind the current task status onto
 * a control. This control will automatically render itself either as a
 * dropdown (if editable) or as a label (if not). It will also automatically
 * color itself based on the status.
 *
 * TODO(krotscheck): Once we can load task status types from the database,
 * allow binding that to this control. At that point we can revisit the color
 * mapping too, because it might be possible to genericize this.
 */
angular.module('sb.util').directive('taskStatusDropdown',
    function (TaskStatus) {
        'use strict';


        /**
         * Map our task status to a display style.
         */
        function setStyle(status) {
            switch (status) {
                case 'invalid':
                    return 'default';
                case 'resolved':
                    return 'success';
                case 'inprogress':
                    return 'info';
                case 'review':
                    return 'warning';
                case 'todo':
                    return 'default';
                default:
                    return 'default';
            }
        }

        return {
            restrict: 'E',
            templateUrl: 'app/util/template/task_status_dropdown.html',
            scope: {
                status: '@',
                onChange: '&',
                editable: '@'
            },
            link: function ($scope) {
                TaskStatus.query({}, function (items) {
                        $scope.taskStatuses = items;
                        $scope.statusName = $scope.status;

                        // check if we can set current status name
                        for (var i = 0;i < items.length; i++) {
                            if (items[i].key === $scope.status) {
                                $scope.statusName = items[i].name;
                            }
                        }
                    }
                );

                // Initialize the style.
                $scope.style = setStyle($scope.status);

                // Make sure our scope can set its own status
                $scope.setStatus = function (newStatus) {
                    if (newStatus !== $scope.status) {
                        $scope.style = setStyle(newStatus);
                        $scope.status = newStatus;

                        // update status name as well
                        for (var i = 0;i < $scope.taskStatuses.length; i++) {
                            if ($scope.taskStatuses[i].key === $scope.status) {
                                $scope.statusName = $scope.taskStatuses[i].name;
                            }
                        }

                        $scope.onChange({status: newStatus});
                    }
                };
            }
        };
    });
