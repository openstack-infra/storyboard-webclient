/*
 * Copyright (c) 2013 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * This directive encapsulates our task edit form. Because the dropdown works
 * with objects, but the actual task only works with ID's, we have to do some
 * special object resolution so that the dropdowns behave and display properly.
 */
angular.module('sb.story').directive('taskEditForm',
    function () {
        'use strict';


        return {
            restrict: 'E',
            templateUrl: 'app/stories/template/task_edit_form.html',
            scope: {
                task: '=',
                onButtonClick: '&',
                buttonLabel: '@'
            },
            controller: function ($scope, Project, User) {

                var task = $scope.task;

                // Preload the project
                if (!!task.project_id) {
                    Project.get({
                        id: $scope.task.project_id
                    }, function (project) {
                        $scope.asyncProject = project;
                    });
                }

                // Preload the user
                if (!!task.assignee_id) {
                    User.get({
                        id: $scope.task.assignee_id
                    }, function (user) {
                        $scope.asyncUser = user;
                    });
                }

                /**
                 * Select a new project.
                 */
                $scope.selectNewProject = function (model) {
                    task.project_id = model.id;
                };

                /**
                 * Select a new user.
                 */
                $scope.selectNewUser = function (model) {
                    task.assignee_id = model.id;
                    if (task.status === 'todo') {
                        task.status = 'inprogress';
                    }
                };

                /**
                 * Formats the project name.
                 */
                $scope.formatProjectName = function (model) {
                    if (!!model) {
                        return model.name;
                    }
                    return '';
                };

                /**
                 * Formats the user name.
                 */
                $scope.formatUserName = function (model) {
                    if (!!model) {
                        return model.full_name;
                    }
                    return '';
                };

                /**
                 * User typeahead search method.
                 */
                $scope.searchUsers = function (value) {
                    return User.browse({full_name: value, limit: 10}).$promise;
                };

                /**
                 * Project typeahead search method.
                 */
                $scope.searchProjects = function (value) {
                    return Project.browse({name: value, limit: 10}).$promise;
                };
            }
        };
    });