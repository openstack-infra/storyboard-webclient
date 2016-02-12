/*
 * Copyright (c) 2016 Codethink Limited
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
 * A controller that manages a view of all worklists and boards.
 */
angular.module('sb.board').controller('BoardsListController',
    function ($scope, Worklist, Board) {
        'use strict';

        $scope.loadingBoards = true;
        $scope.loadingWorklists = true;


        $scope.browseBoards = function () {
        // Load all the boards
            Board.browse({
                    status: $scope.filter || null,
                    offset: $scope.searchOffset,
                    limit: 10,
                    sort_dir: 'desc'
                },
                function (result, headers) {

                    // Successful search results, apply the results to the
                    // scope and unset our progress flag.
                    $scope.boardCount =
                        parseInt(headers('X-Total')) || result.length;
                    $scope.searchOffset = parseInt(headers('X-Offset')) || 0;
                    $scope.searchLimit = parseInt(headers('X-Limit')) || 0;
                    $scope.boards = result;
                    $scope.loadingBoards = false;
                },
                function (error) {
                    // Error search results, show the error in the UI and
                    // unset our progress flag.
                    $scope.error = error;
                    $scope.loadingBoards = false;
                }
            );
         };

        /**
         * Next page of the results.
         */
        $scope.nextBoardsPage = function () {
            $scope.searchOffset += 10;
            $scope.browseBoards()
        };

        /**
         * Previous page of the results.
         */
        $scope.previousBoardsPage = function () {
            $scope.searchOffset -= 10;
            if ($scope.searchOffset < 0) {
                $scope.searchOffset = 0;
            }
            $scope.browseBoards()
        };

        $scope.browseWorklists = function () {
        // Load all the boards
            Worklist.browse({
                    status: $scope.filter || null,
                    offset: $scope.searchOffset,
                    limit: 10,
                    sort_dir: 'desc'
                },
                function (result, headers) {

                    // Successful search results, apply the results to the
                    // scope and unset our progress flag.
                    $scope.worklistCount =
                        parseInt(headers('X-Total')) || result.length;
                    $scope.searchOffset = parseInt(headers('X-Offset')) || 0;
                    $scope.searchLimit = parseInt(headers('X-Limit')) || 0;
                    $scope.worklists = result;
                    $scope.loadingWorklists = false;
                },
                function (error) {
                    // Error search results, show the error in the UI and
                    // unset our progress flag.
                    $scope.error = error;
                    $scope.loadingWorklists = false;
                }
            );
         };

        /**
         * Next page of the results.
         */
        $scope.nextWorklistsPage = function () {
            $scope.searchOffset += 10;
            $scope.browseWorklists()
        };

        /**
         * Previous page of the results.
         */
        $scope.previousWorklistsPage = function () {
            $scope.searchOffset -= 10;
            if ($scope.searchOffset < 0) {
                $scope.searchOffset = 0;
            }
            $scope.browseWorklists()
        };


        $scope.browseBoards();
        $scope.browseWorklists()
    });
