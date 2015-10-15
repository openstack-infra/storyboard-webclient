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
 * A controller for a kanban board.
 */
angular.module('sb.board').controller('BoardDetailController',
    function ($scope, Worklist, $modal, Board, Project, $stateParams,
              BoardHelper, $document, User, $q) {
        'use strict';

        /**
         * Load the board. If onlyContents is true then assume $scope.board
         * is a board and reload its contents.
         */
        function loadBoard(onlyContents) {
            var params = {id: $stateParams.boardID};
            if (onlyContents) {
                Board.loadContents($scope.board, true, true);
            } else {
                Board.Permissions.get(params, function(perms) {
                    $scope.permissions = {
                        editBoard: perms.indexOf('edit_board') > -1,
                        moveCards: perms.indexOf('move_cards') > -1
                    };
                });
                Board.get(params, function(board) {
                    $scope.board = board;
                    Board.loadContents(board, true, true);
                    $scope.owners = [];
                    $scope.users = [];
                    angular.forEach(board.owners, function(id) {
                        $scope.owners.push(User.get({id: id}));
                    });
                    angular.forEach(board.users, function(id) {
                        $scope.users.push(User.get({id: id}));
                    });
                });
            }
        }

        /**
         * Show a modal to handle adding cards to a lane. Pass a validation
         * function to this modal which returns `false` if the card is already
         * in one of the lanes of the board.
         */
        function showAddItemModal(worklist) {
            var modalInstance = $modal.open({
                templateUrl: 'app/worklists/template/additem.html',
                controller: 'WorklistAddItemController',
                resolve: {
                    worklist: function() {
                        return worklist;
                    },
                    valid: function() {
                        var board = $scope.board;
                        return function(item) {
                            var valid = true;
                            angular.forEach(board.worklists, function(list) {
                                angular.forEach(list.items, function(listItem) {
                                    var type = item.type.toLowerCase();
                                    if (item.value === listItem.id &&
                                        type === listItem.type) {
                                        valid = false;
                                    }
                                });
                            });
                            return valid;
                        };
                    }
                }
            });

            return modalInstance.result;
        }

        /**
         * Add a card to a lane.
         */
        $scope.addItem = function(worklist) {
            showAddItemModal(worklist)
                .finally(function() {
                    Worklist.loadContents(worklist, true);
                });
        };

        /**
         * Toggle the edit form for the board title and description.
         */
        $scope.toggleEditMode = function() {
            if ($scope.showEditForm) {
                loadBoard();
            }
            $scope.showEditForm = !$scope.showEditForm;
        };

        /**
         * Save changes to the board.
         */
        $scope.update = function() {
            var params = {id: $scope.board.id};
            var owners = {
                codename: 'edit_board',
                users: $scope.board.owners
            };
            var users = {
                codename: 'move_cards',
                users: $scope.board.users
            };
            $scope.board.$update().then(function() {
                var updating = [
                    Board.Permissions.update(params, owners).$promise,
                    Board.Permissions.update(params, users).$promise
                ];
                $q.all(updating).then(function() {
                    $scope.toggleEditMode();
                });
            });
        };

        /**
         * Open a modal to handle archiving the board.
         */
        $scope.remove = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/boards/template/archive.html',
                controller: 'BoardArchiveController',
                resolve: {
                    board: function() {
                        return $scope.board;
                    }
                }
            });

            return modalInstance.result;
        };

        /**
         * Add a lane to the board.
         */
        $scope.addLane = function () {
            $scope.board.worklists.push(new Worklist({
                id: null,
                title: '',
                editing: true
            }));
        };

        /**
         * Remove a lane from the board.
         */
        $scope.removeLane = function (worklist) {
            var idx = $scope.board.worklists.indexOf(worklist);
            $scope.board.worklists.splice(idx, 1);
            worklist.$delete();
        };

        /**
         * Remove a card from a lane.
         */
        $scope.removeCard = function (worklist, item) {
            Worklist.ItemsController.delete({
                id: worklist.id,
                item_id: item.list_item_id
            }).$promise.then(function() {
                var idx = worklist.items.indexOf(item);
                worklist.items.splice(idx, 1);
            });
        };

        /**
         * Save changes to the ordering of and additions to the lanes.
         */
        function updateBoardLanes(newList) {
            for (var i = 0; i < $scope.board.worklists.length; i++) {
                var lane = Board.getLane($scope.board,
                                         $scope.board.worklists[i].id);
                if (!lane) {
                    $scope.board.lanes.push({
                        list_id: newList.id,
                        board_id: $scope.board.id,
                        position: i
                    });
                } else {
                    lane.position = i;
                }
            }
            $scope.board.$update().then(function() {
                Board.loadContents($scope.board, true, true);
            });
        }

        /**
         * Toggle edit mode on a lane. Save changes if toggling on->off, and
         * create a worklist to represent the lane if one doesn't exist
         * already.
         */
        $scope.toggleEditLane = function(worklist) {
            if (worklist.editing) {
                if (worklist.id === null) {
                    worklist.$create().then(updateBoardLanes);
                } else {
                    worklist.$update().then(function(list) {
                        Worklist.loadContents(list, true);
                    });
                }
            }
            worklist.editing = !worklist.editing;
        };

        /**
         * User typeahead search method.
         */
        $scope.searchUsers = function (value, array) {
            var deferred = $q.defer();

            User.browse({full_name: value, limit: 10},
                function(searchResults) {
                    var results = [];
                    angular.forEach(searchResults, function(result) {
                        if (array.indexOf(result.id) === -1) {
                            results.push(result);
                        }
                    });
                    deferred.resolve(results);
                }
            );
            return deferred.promise;
        };

        /**
         * Formats the user name.
         */
        $scope.formatUserName = function (model) {
            if (!!model) {
                return model.name;
            }
            return '';
        };

        /**
         * Add a new user to one of the permission levels.
         */
        $scope.addUser = function (model, modelArray, idArray) {
            idArray.push(model.id);
            modelArray.push(model);
        };

        /**
         * Remove a user from one of the permission levels.
         */
        $scope.removeUser = function (model, modelArray, idArray) {
            var idIdx = idArray.indexOf(model.id);
            idArray.splice(idIdx, 1);

            var modelIdx = modelArray.indexOf(model);
            modelArray.splice(modelIdx, 1);
        };

        /**
         * Config for the lanes sortable.
         */
        $scope.lanesSortable = {
            orderChanged: updateBoardLanes,
            dragMove: BoardHelper.maybeScrollContainer('kanban-board'),
            accept: function (sourceHandle, dest) {
                return sourceHandle.itemScope.sortableScope.$id === dest.$id;
            }
        };

        /**
         * Config for the cards sortable.
         */
        $scope.cardsSortable = {
            orderChanged: BoardHelper.moveCardInLane,
            itemMoved: BoardHelper.moveCardBetweenLanes,
            dragMove: BoardHelper.maybeScrollContainer('kanban-board'),
            accept: function (sourceHandle, dest) {
                var srcParent = sourceHandle.itemScope.sortableScope.$parent;
                var dstParentSortable = dest.$parent.sortableScope;
                if (!$scope.permissions.edit_board) {
                    return true;
                }
                if (!srcParent.sortableScope) {
                    return false;
                }
                return srcParent.sortableScope.$id === dstParentSortable.$id;
            }
        };

        /**
         * Add an event listener to prevent default dragging behaviour from
         * interfering with dragging items around.
         */
        $document[0].ondragstart = function (event) {
            event.preventDefault();
        };

        // Load the board and permissions on page load.
        loadBoard();
        $scope.showEditForm = false;
        $scope.showAddOwner = false;
    });
