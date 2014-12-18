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
 * Controller for items in the story list.
 */
angular.module('sb.story').controller('StoryListItemController',
    function ($scope, TaskStatusResource) {
        'use strict';

        /**
         * Gets the status for the task count texts
         */
        function getStatusClass(status) {
            var className = '';
            switch(status) {
                case 'inprogress':
                    className = 'text-info';
                    break;
                case 'review':
                    className = 'text-warning';
                    break;
                case 'merged':
                    className = 'text-success';
                    break;
                case 'invalid':
                    className = 'muted';
                    break;
                default:
                    className = '';
                    break;
            }
            return className;
        }

        /**
         * UI toggle, show row details?
         */
        $scope.expandRow = false;

        $scope.status_texts = [];
        $scope.status_classes = [];
        TaskStatusResource.getall({}, function (items) {
            for (var i = 0;i < items.length; i++) {
                $scope.status_texts[items[i].key] = items[i].name;
                $scope.status_classes[items[i].key] = getStatusClass(
                    items[i].key);
            }
        });

        /**
         * Figure out what color we're labeling ourselves as...
         */
        switch ($scope.story.status) {
            case 'active':
                $scope.statusLabelStyle = 'label-info';
                break;
            case 'merged':
                $scope.statusLabelStyle = 'label-success';
                break;
            case 'invalid':
                $scope.statusLabelStyle = 'label-default';
                break;
            default:
                $scope.statusLabelStyle = 'label-default';
                break;
        }
    });
