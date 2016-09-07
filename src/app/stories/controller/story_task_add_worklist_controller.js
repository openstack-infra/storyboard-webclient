/*
 * Copyright (c) 2016 Codethink Ltd.
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
 * Controller for "Add task to worklist" modal.
 */
angular.module('sb.story').controller('StoryTaskAddWorklistController',
    function ($log, $scope, $state, task, $modalInstance, Worklist) {
        'use strict';

        $scope.task = task;
        $scope.defaultCriteria = [];

        $scope.selected = 'none';

        $scope.select = function(worklist) {
            $scope.selected = worklist;
        };

        $scope.add = function() {
            var params = {
                item_id: task.id,
                id: $scope.selected.id,
                list_position: $scope.selected.items.length,
                item_type: 'task'
            };

            Worklist.ItemsController.create(params, function(item) {
                $modalInstance.dismiss(item);
            });
        };

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    }
);
