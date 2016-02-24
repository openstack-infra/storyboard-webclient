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
angular.module('sb.due_date').controller('DueDateEditController',
    function ($scope, $modalInstance, $state, $q, DueDate, User,
              board, dueDate) {
        'use strict';
        $scope.owners = [];
        $scope.users = [];
        angular.forEach(dueDate.owners, function(id) {
            $scope.owners.push(User.get({id: id}));
        });
        angular.forEach(dueDate.users, function(id) {
            $scope.users.push(User.get({id: id}));
        });

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
         * Save changes to the due date.
         */
        function saveDueDate() {
            DueDate.update($scope.dueDate, function (result) {
                    var params = {id: $scope.dueDate.id};
                    var owners = {
                        codename: 'edit_date',
                        users: $scope.dueDate.owners
                    };
                    var users = {
                        codename: 'assign_date',
                        users: $scope.dueDate.users
                    };
                    DueDate.Permissions.update(params, users)
                        .$promise.then(function() {
                            DueDate.Permissions.update(params, owners)
                                .$promise.then(function() {
                                    $scope.isSaving = false;
                                    $modalInstance.close(result);
                                });
                        });
                }
            );
        }

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

        // Create a blank DueDate to begin with.
        $scope.isSaving = false;
        $scope.dueDate = dueDate;
        $scope.modalTitle = 'Edit Due Date';
    });
