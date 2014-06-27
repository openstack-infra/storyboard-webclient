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
    function ($scope) {
        'use strict';

        /**
         * UI toggle, show row details?
         */
        $scope.expandRow = false;

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
