/*
 * Copyright (c) 2016 Codethink Ltd
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
 * New Team modal controller.
 */
angular.module('sb.admin').controller('TeamNewController',
    function ($log, $scope, $modalInstance, Team, User, Project, $q) {
        'use strict';

        /**
         * Flag for the UI to indicate that we're saving.
         *
         * @type {boolean}
         */
        $scope.isSaving = false;

        /**
         * The new team.
         *
         * @type {Team}
         */
        $scope.team = new Team();

        /**
         * The members of the new team.
         *
         * @type {[User]}
         */
        $scope.members = [];

        /**
         * The projects related to the new team.
         *
         * @type {[Project]}
         */
        $scope.projects = [];

        /**
         * Saves the team
         */
        $scope.save = function () {
            $scope.isSaving = true;

            // Create a new team
            $scope.team.$create(function(team) {
                var users = [];
                angular.forEach($scope.members, function(member) {
                    users.push(Team.UsersController.create({
                        team_id: team.id,
                        user_id: member.id
                    }).$promise);
                });
                $q.all(users).then(function() {
                    $modalInstance.close(team);
                });
            }, function (error) {
                $scope.isSaving = false;
                $log.error(error);
                $modalInstance.dismiss(error);
            });
        };

        /**
         * Close this modal without saving.
         */
        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

        /**
         * Toggle the "Add Member" text box.
         */
        $scope.toggleAddMember = function() {
            $scope.addingMember = !$scope.addingMember;
        };

        /**
         * Add a user to the list of members.
         */
        $scope.addUser = function(model) {
            $scope.members.push(model);
        };

        /**
         * Remove a user from the list of members.
         */
        $scope.removeUser = function(user) {
            var idx = $scope.members.indexOf(user);
            $scope.members.splice(idx, 1);
        };

        /**
         * User typeahead search method.
         */
        $scope.searchUsers = function(value) {
            var memberIds = $scope.members.map(function(user) {
                return user.id;
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

        $scope.toggleAddProject = function() {
            $scope.addingProject = !$scope.addingProject;
        };

        $scope.addProject = function(model) {
            $scope.projects.push(model);
        };

        $scope.removeProject = function(project) {
            var idx = $scope.projects.indexOf(project);
            $scope.projects.splice(idx, 1);
        };

        /**
         * Project typeahead search method.
         */
        $scope.searchProjects = function(value) {
            var projectIds = $scope.projects.map(function(project) {
                return project.id;
            });
            var deferred = $q.defer();

            Project.browse({name: value, limit: 10},
                function(searchResults) {
                    var results = [];
                    angular.forEach(searchResults, function(result) {
                        if (projectIds.indexOf(result.id) === -1) {
                            results.push(result);
                        }
                    });
                    deferred.resolve(results);
                }
            );
            return deferred.promise;
        };
    });
