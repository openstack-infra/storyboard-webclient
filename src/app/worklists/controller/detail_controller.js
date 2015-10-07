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
    function ($scope, $modal, $timeout, $stateParams, Worklist) {
        'use strict';

        /**
         * Load the worklist and its contents.
         */
        function loadWorklist() {
            var params = {id: $stateParams.worklistID};
            Worklist.get(params).$promise.then(function(result) {
                $scope.worklist = result;
                Worklist.loadContents(result, true);
            });
        }

        /**
         * Save the worklist.
         */
        function saveWorklist() {
            $scope.worklist.$update().then(function() {
                Worklist.loadContents($scope.worklist, true);
            });
        }

        /**
         * Toggle edit mode on the worklist. If going on->off then
         * save changes.
         */
        $scope.toggleEditMode = function() {
            if (!$scope.worklist.editing) {
                $scope.worklist.editing = true;
            } else {
                $scope.worklist.editing = false;
                saveWorklist();
            }
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
        $scope.removeItem = function(item) {
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
         * Config for worklist sortable.
         */
        $scope.sortableOptions = {
            accept: function (sourceHandle, dest) {
                return sourceHandle.itemScope.sortableScope.$id === dest.$id;
            },
            orderChanged: function(result) {
                var list = result.source.sortableScope.$parent.worklist;
                for (var i = 0; i < list.items.length; i++) {
                    var item = list.items[i];
                    item.position = i;
                    Worklist.ItemsController.update({
                        id: list.id,
                        item_id: item.list_item_id,
                        list_position: item.position
                    });
                }
            }
        };

        // Load the worklist.
        loadWorklist();
    });
