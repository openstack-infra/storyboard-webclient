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
 * A controller that manages the worklist detail page.
 */
angular.module('sb.worklist').controller('WorklistDetailController',
    function ($scope, $modal, $timeout, $stateParams, Worklist, BoardHelper,
              $document, User, $q) {
        'use strict';

        function resolvePermissions() {
            $scope.owners = [];
            $scope.users = [];
            angular.forEach($scope.worklist.owners, function(id) {
                $scope.owners.push(User.get({id: id}));
            });
            angular.forEach($scope.worklist.users, function(id) {
                $scope.users.push(User.get({id: id}));
            });
        }

        /**
         * Load the worklist and its contents.
         */
        function loadWorklist() {
            var params = {id: $stateParams.worklistID};
            Worklist.Permissions.get(params, function(perms) {
                $scope.permissions = {
                    editWorklist: perms.indexOf('edit_worklist') > -1,
                    moveItems: perms.indexOf('move_items') > -1
                };
            });
            Worklist.get(params, function(result) {
                $scope.worklist = result;
                Worklist.loadContents(result, true);
                resolvePermissions();
            });
        }

        /**
         * Save the worklist.
         */
        $scope.update = function() {
            var params = {id: $scope.worklist.id};
            var owners = {
                codename: 'edit_worklist',
                users: $scope.worklist.owners
            };
            var users = {
                codename: 'move_items',
                users: $scope.worklist.users
            };
            $scope.worklist.$update().then(function() {
                var updating = [
                    Worklist.Permissions.update(params, owners).$promise,
                    Worklist.Permissions.update(params, users).$promise
                ];
                $q.all(updating).then(function() {
                    $scope.toggleEditMode();
                });
            });
        };

        /**
         * Toggle edit mode on the worklist. If going on->off then
         * save changes.
         */
        $scope.toggleEditMode = function() {
            if ($scope.editing) {
                loadWorklist();
            }
            $scope.editing = !$scope.editing;
        };

        /**
         * Show a modal to handle adding items to the worklist.
         */
        function showAddItemModal() {
            var modalInstance = $modal.open({
                templateUrl: 'app/worklists/template/additem.html',
                controller: 'WorklistAddItemController',
                resolve: {
                    worklist: function() {
                        return $scope.worklist;
                    },
                    valid: function() {
                        return function() {
                            // No limit on the contents of worklists
                            return true;
                        };
                    }
                }
            });

            return modalInstance.result;
        }

        /**
         * Display the add-item modal and reload the worklist when
         * it is closed.
         */
        $scope.addItem = function() {
            showAddItemModal().finally(loadWorklist);
        };

        /**
         * Remove an item from the worklist.
         */
        $scope.removeListItem = function(item) {
            Worklist.ItemsController.delete({
                id: $scope.worklist.id,
                item_id: item.list_item_id
            }).$promise.then(function() {
                var idx = $scope.worklist.items.indexOf(item);
                $scope.worklist.items.splice(idx, 1);
            });
        };

        /**
         * Show a modal to handle archiving the worklist.
         */
        $scope.remove = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/worklists/template/delete.html',
                controller: 'WorklistDeleteController',
                resolve: {
                    worklist: function() {
                        return $scope.worklist;
                    }
                }
            });
            return modalInstance.result;
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
         * Config for worklist sortable.
         */
        $scope.sortableOptions = {
            accept: function (sourceHandle, dest) {
                return sourceHandle.itemScope.sortableScope.$id === dest.$id;
            },
            orderChanged: BoardHelper.moveCardInLane
        };

        /**
         * Add an event listener to prevent default dragging behaviour from
         * interfering with dragging items around.
         */
        $document[0].ondragstart = function (event) {
            event.preventDefault();
        };

        // Load the worklist.
        loadWorklist();
    });
