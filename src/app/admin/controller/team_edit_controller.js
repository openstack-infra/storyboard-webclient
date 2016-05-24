/*
 * Copyright (c) 2016 Codethink Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * Edit/view team controller
 */
angular.module('sb.admin').controller('TeamEditController',
    function($scope, team, members, $state, Team, User, $q) {
        'use strict';

        $scope.team = team;
        $scope.members = members;
        $scope.editing = false;
        $scope.isUpdating = false;

        $scope.save = function() {
            $scope.isUpdating = true;
            $scope.team.$update(function() {
                $scope.isUpdating = false;
                $scope.editing = false;
            });
        };

        var oldName = $scope.team.name;
        $scope.toggleEdit = function() {
            if (!$scope.editing) {
                oldName = $scope.team.name;
            } else if ($scope.editing) {
                $scope.team.name = oldName;
            }
            $scope.editing = !$scope.editing;
        };

        $scope.toggleAddMember = function() {
            $scope.adding = !$scope.adding;
        };

        $scope.addUser = function(model) {
            $scope.members.push(model);
            Team.UsersController.create({
                team_id: $scope.team.id,
                user_id: model.id
            });
        };

        $scope.removeUser = function(user) {
            var idx = $scope.members.indexOf(user);
            $scope.members.splice(idx, 1);
            Team.UsersController.delete({
                team_id: $scope.team.id,
                user_id: user.id
            });
        };

        /**
         * User typeahead search method.
         */
        $scope.searchUsers = function(value) {
            var memberIds = [];
            angular.forEach($scope.members, function(member) {
                memberIds.push(member.id);
            });
            var deferred = $q.defer();

            User.browse({full_name: value, limit: 10},
                function(searchResults) {
                    var results = [];
                    angular.forEach(searchResults, function(result) {
                        if (memberIds.indexOf(result.id) === -1) {
                            results.push(result);
                        }
                    });
                    deferred.resolve(results);
                }
            );
            return deferred.promise;
        };
    });
