/*
 * Copyright (c) 2015 Codethink Limited
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
 * Controller for the "new board" modal popup.
 */
angular.module('sb.board').controller('AddBoardController',
    function ($scope, $modalInstance, $state, params, Board, Project,
              Worklist, $q, BoardHelper) {
        'use strict';

        /**
         * Create the new board.
         */
        function saveBoard() {
            $scope.board.$create(
                function (result) {
                    $modalInstance.dismiss('success');
                    $state.go('sb.board.detail', {boardID: result.id});
                }
            );
        }

        /**
         * Return a function which adds a "lane" to the board in the given
         * position. This lane is just a reference to the worklist used to
         * represent it.
         */
        function addLaneDetails(position) {
            return function(lane) {
                $scope.board.lanes.push({
                    board_id: $scope.board.id,
                    list_id: lane.id,
                    position: position
                });
            };
        }

        /**
         * Create worklists to represent the lanes of the board, then save
         * the board.
         */
        function saveBoardWithLanes() {
            $scope.board.lanes = [];
            var lanePromises = [];
            for (var i = 0; i < $scope.lanes.length; i++) {
                var lane = $scope.lanes[i];
                var addLane = addLaneDetails(i);
                lane.project_id = $scope.board.project_id;
                lane.private = $scope.board.private;
                lanePromises.push(lane.$create(addLane));
            }
            $q.all(lanePromises).then(saveBoard);
        }

        /**
         * Saves the board, and any worklists created to serve as lanes.
         */
        $scope.save = function() {
            if ($scope.lanes.length > 0) {
                saveBoardWithLanes();
            } else {
                saveBoard();
            }
        };

        /**
         * Close this modal without saving.
         */
        $scope.close = function() {
            $modalInstance.dismiss('cancel');
        };

        /**
         * Add a lane.
         */
        $scope.addLane = function() {
            $scope.lanes.push(new Worklist({
                title: '',
                editing: true
            }));
        };

        /**
         * Remove a lane.
         */
        $scope.removeLane = function(lane) {
            var idx = $scope.lanes.indexOf(lane);
            $scope.lanes.splice(idx, 1);
        };

        /**
         * Toggle editing of a lane title.
         */
        $scope.toggleEdit = function(lane) {
            lane.editing = !lane.editing;
        };

        /**
         * Config for the lanes sortable.
         */
        $scope.lanesSortable = {
            dragMove: BoardHelper.maybeScrollContainer('new-board')
        };

        // Create a blank Board to begin with.
        $scope.lanes = [];
        $scope.board = new Board({
            title: '',
            lanes: []
        });
    });
