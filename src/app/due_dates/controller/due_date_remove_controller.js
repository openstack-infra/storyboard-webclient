/*
 * Copyright (c) 2015 Codethink Limited
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
 * Controller for "archive board" modal
 */
angular.module('sb.board').controller('DueDateRemoveController',
    function ($log, $scope, $state, board, dueDate, $modalInstance, DueDate) {
        'use strict';

        $scope.board = board;
        $scope.dueDate = dueDate;

        // Set our progress flags and clear previous error conditions.
        $scope.isUpdating = true;
        $scope.error = {};

        $scope.remove = function () {
            DueDate.delete({
                    id: dueDate.id,
                    board_id: board.id
                },
                function () {
                    $modalInstance.close('success');
                }
            );
        };

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    });
