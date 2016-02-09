/*
 * Copyright (c) 2016 Codethink Ltd.
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
angular.module('sb.util').directive('inputOutOfLine',
    function () {
        'use strict';

        return {
            require: 'ngModel',
            restrict: 'E',
            templateUrl: 'app/util/template/input_out_of_line.html',
            scope: {
                enabled: '=',
                asInline: '=',
                autoFocus: '=',
                onChange: '&',
                emptyPrompt: '@',
                emptyDisabledPrompt: '@',
                maxLength: '='
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
                 * Updates the view value (if necessary) and notifies external
                 * event listeners.
                 *
                 * @param value
                 */
                $scope.onInputBlur = function (value) {
                    if (value !== ngModel.$viewValue) {
                        ngModel.$setViewValue(value);
                        $scope.onChange();
                    }
                    $scope.toggleForm();
                };

                /**
                 * Watch the ng-model controller for data changes.
                 */
                $scope.$watch(function () {
                    return ngModel.$viewValue;
                }, function (value) {
                    if ($scope.inputText !== value) {
                        $scope.inputText = !!value ? value : '';
                    }
                });
            }
        };
    });
