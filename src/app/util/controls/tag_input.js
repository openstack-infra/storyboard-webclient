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
 * A tag-input control that allows free form input of tags.
 */
angular.module('sb.util').directive('tagInput',
    function () {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: {
                'selectedTags': '=ngModel'
            },
            require: 'ngModel',
            controller: 'TagInputController',
            templateUrl: 'app/templates/util/tag_input.html'
        };
    });

/**
 * The controller for the above referenced Tag Input control.
 */
angular.module('sb.util').controller('TagInputController',
    function ($element, $scope) {
        'use strict';

        /**
         * Variable for the input field that triggers our filter.
         */
        $scope.newTagName = '';

        /**
         * Event handler when delete is pressed inside the input field. Pops
         * the last item off the selected list.
         */
        $scope.deletePressed = function () {
            if ($scope.newTagName.length === 0) {
                $scope.selectedTags.pop();
                return true;
            }
            return false;
        };

        /**
         * Adds a tag.
         */
        $scope.addTag = function () {
            // Do we have a model?
            if (!$scope.selectedTags) {
                $scope.selectedTags = [];
            }
            if ($scope.newTagName.length > 0) {
                $scope.selectedTags.push($scope.newTagName);
                $scope.newTagName = '';
            }
        };

        /**
         * When a user clicks on the background of this control, we want to
         * focus the text input field.
         */
        $scope.focus = function () {
            $element.find('input[name=tagInputField]').focus();
        };

        /**
         * When a user clicks on the actual tag, we need to intercept the
         * mouse event so it doesn't refocus the cursor.
         */
        $scope.noFocus = function (event) {
            event.stopImmediatePropagation();
        };
    }
);