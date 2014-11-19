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
 * A directive which encapsulates typeahead logic for inline user selection.
 */
angular.module('sb.util').directive('userTypeahead',
    function (User) {
        'use strict';

        return {
            require: 'ngModel',
            restrict: 'E',
            templateUrl: 'app/util/template/user_typeahead.html',
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
                 * User typeahead search method.
                 */
                $scope.searchUsers = function (value) {
                    return User.browse({full_name: value, limit: 10}).$promise;
                };

                /**
                 * Load the currently configured user.
                 */
                $scope.loadUser = function () {
                    var userId = ngModel.$viewValue || null;
                    if (!!userId) {
                        User.get({id: userId},
                            function (user) {
                                $scope.user = user;
                            }, function () {
                                $scope.user = null;
                            });
                    } else {
                        $scope.user = null;
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
                 * Formats the user name.
                 */
                $scope.formatUserName = function (model) {
                    if (!!model) {
                        return model.full_name;
                    }
                    return '';
                };

                /**
                 * Watch the ng-model controller for data changes.
                 */
                $scope.$watch(function () {
                    return ngModel.$viewValue;
                }, $scope.loadUser);
            }
        };
    });