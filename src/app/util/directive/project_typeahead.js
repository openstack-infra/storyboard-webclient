/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
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
 * A directive which encapsulates typeahead logic for inline project selection.
 */
angular.module('sb.util').directive('projectTypeahead',
    function (Project) {
        'use strict';

        return {
            require: 'ngModel',
            restrict: 'E',
            templateUrl: 'app/util/template/project_typeahead.html',
            scope: {
                enabled: '=',
                asInline: '=',
                autoFocus: '=',
                onChange: '&',
                emptyPrompt: '@',
                emptyDisabledPrompt: '@'
            },
            link: function ($scope, element, attrs, ngModel) {
                /**
                 * Flag that indicates whether the form is visible.
                 *
                 * @type {boolean}
                 */
                $scope.showForm = !$scope.asInline;

                /**
                 * Toggle the display of the form.
                 */
                $scope.toggleForm = function () {
                    if (!!$scope.asInline) {
                        $scope.showForm =
                            $scope.enabled ? !$scope.showForm : false;
                    } else {
                        $scope.showForm = true;
                    }
                };

                /**
                 * Project typeahead search method.
                 */
                $scope.searchProjects = function (value) {
                    return Project.browse({
                        name: value,
                        limit: 10
                    }).$promise;
                };

                /**
                 * Load the currently configured project.
                 */
                $scope.loadProject = function () {
                    var projectId = ngModel.$viewValue || null;
                    if (!!projectId) {
                        $scope.project = Project.get({id: projectId},
                            function (project) {
                                $scope.selectedProject = project;
                            }, function () {
                                $scope.project = null;
                                $scope.selectedProject = null;
                            });
                    } else {
                        $scope.project = null;
                        $scope.selectedProject = null;
                    }
                };

                /**
                 * Updates the view value (if necessary) and notifies external
                 * event listeners.
                 *
                 * @param value
                 */
                $scope.updateViewValue = function (value) {
                    if (value !== ngModel.$viewValue) {
                        ngModel.$setViewValue(value);
                        $scope.onChange();
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
                 * Watch the ng-model controller for data changes.
                 */
                $scope.$watch(function () {
                    return ngModel.$viewValue;
                }, $scope.loadProject);
            }
        };
    });