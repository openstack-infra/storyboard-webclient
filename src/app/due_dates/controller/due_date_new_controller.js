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
 * Controller for the "new due date" modal popup.
 */
angular.module('sb.due_date').controller('DueDateNewController',
    function ($scope, $modalInstance, $state, $q, DueDate, board, CurrentUser,
              User) {
        'use strict';

        var currentUser = CurrentUser.resolve();
        $scope.owners = [];
        $scope.users = [];
        angular.forEach(board.owners, function(id) {
            $scope.owners.push(User.get({id: id}));
        });
        angular.forEach(board.users, function(id) {
            $scope.users.push(User.get({id: id}));
        });

        /**
         * Create the new due date.
         */
        function saveDueDate() {
            if ($scope.mode === 'edit') {
                $scope.dueDate.$create(
                    function (result) {
                        $scope.isSaving = false;
                        $modalInstance.close(result);
                    }
                );
            } else if ($scope.mode === 'find') {
                DueDate.update({
                    id: $scope.selected.id,
                    board_id: board.id
                }, function (result) {
                    $scope.isSaving = false;
                    $modalInstance.close(result);
                });
            }
        }

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
         * Saves the due date.
         */
        $scope.save = function() {
            $scope.isSaving = true;
            $scope.dueDate.date.second(0);
            saveDueDate();
        };

        /**
         * Close this modal without saving.
         */
        $scope.close = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.setMode = function(mode) {
            $scope.mode = mode;
        };

        $scope.searchDueDates = function() {
            DueDate.browse($scope.criteria, function(results) {
                var existing = [];
                angular.forEach(board.due_dates, function(date) {
                    existing.push(date.id);
                });
                $scope.results = results;
                angular.forEach(results, function(result) {
                    if (existing.indexOf(result.id) !== -1) {
                        var idx = $scope.results.indexOf(result);
                        $scope.results.splice(idx, 1);
                    }
                });
            });
        };

        $scope.select = function(dueDate) {
            $scope.selected = dueDate;
        };

        $scope.selected = {};
        $scope.criteria = {};
        currentUser.then(function(result) {
            currentUser = result;
            $scope.criteria = {
                user: currentUser.id
            };
        });

        // Create a blank DueDate to begin with.
        $scope.isSaving = false;
        $scope.newDueDate = true;
        $scope.modalTitle = 'New Due Date';
        $scope.mode = 'edit';
        $scope.dueDate = new DueDate({
            name: ''
        });
        if (!!board) {
            $scope.dueDate.board_id = board.id;
            $scope.dueDate.owners = board.owners;
            $scope.dueDate.users = board.users;
        }
    });
