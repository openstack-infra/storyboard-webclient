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
 * A controller that manages the dashboard for worklists and boards.
 */
angular.module('sb.dashboard').controller('BoardsWorklistsController',
    function ($scope, currentUser, Worklist, Board) {
        'use strict';

        var params = {creator_id: currentUser.id};

        // Load the boards belonging to the logged in user.
        Board.browse(params).$promise.then(function(boards) {
            for (var i = 0; i < boards.length; i++) {
                Board.loadContents(boards[i], true, false);
            }
            $scope.boards = boards;
        });

        // Load the worklists belonging to the logged in user.
        Worklist.browse(params).$promise.then(function(worklists) {
            for (var i = 0; i < worklists.length; i++) {
                Worklist.loadContents(worklists[i], false);
            }
            $scope.worklists = worklists;
        });
    });
