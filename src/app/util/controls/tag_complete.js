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
 * A tag-input control that autocompletes based on a fixed (non-autoloading)
 * set of source data, and restricts inputs to items in that list.
 */
angular.module('sb.util').directive('tagComplete',
    function () {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            require: 'ngModel',
            scope: {
                selectedTags: '=ngModel',
                validTags: '=',
                tagLabelField: '@'
            },
            controller: 'TagCompleteController',
            templateUrl: 'app/templates/util/tag_complete.html'
        };
    });

/**
 * The controller for the above referenced Tag Complete control.
 */
angular.module('sb.util').controller('TagCompleteController',
    function ($element, $scope) {
        'use strict';

        /**
         * Variable for the input field that triggers our filter.
         */
        $scope.newTagName = '';

        /**
         * List of filtered tags.
         */
        $scope.filteredTags = [];

        /**
         * The cursor.
         */
        $scope.selectedIndex = 0;

        /**
         * Apply the filter.
         */
        function applyFilter() {
            var newFilteredTags = [];
            var selectedTags = $scope.selectedTags || [];

            $scope.validTags.forEach(
                function (tag) {
                    var searchIndex = (tag[$scope.tagLabelField] || '')
                        .toLowerCase()
                        .indexOf($scope.newTagName.toLowerCase());

                    if (searchIndex > -1 &&
                        selectedTags.indexOf(tag) === -1) {

                        newFilteredTags.push(tag);
                    }
                });

            $scope.filteredTags = newFilteredTags;
            $scope.selectedIndex = 0;

            updateDropdownAppearance();
        }

        /**
         * Toggle the appearance of the dropdown.
         */
        function updateDropdownAppearance() {
            if ($scope.newTagName.length === 0 ||
                $scope.filteredTags.length === 0) {
                $element.find('.dropdown-menu').hide();
            } else {
                $element.find('.dropdown-menu').show();
            }
        }

        /**
         * Dumb filter of our valid tag array.
         */
        $scope.onKeyUp = function (event) {
            // Trap the arrow keys explicitly so they don't trigger a filter.
            if (event.which === 38 || event.which === 40) {
                return;
            }

            applyFilter();
        };

        /**
         * Traps the arrow keys for filter navigation.
         */
        $scope.onKeyDown = function (event) {
            var newIndex = $scope.selectedIndex;
            if (event.which === 38) {
                newIndex = Math.max(0, newIndex - 1);
            } else if (event.which === 40) {
                newIndex = Math.min($scope.filteredTags.length, newIndex + 1);
            }

            if (newIndex !== $scope.selectedIndex) {
                $scope.selectedIndex = newIndex;
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        };

        /**
         * Event handler when delete is pressed inside the input field. Pops
         * the last item off the selected list.
         */
        $scope.deletePressed = function () {
            var selectedTags = $scope.selectedTags || [];

            if (selectedTags.length > 0 && $scope.newTagName.length === 0) {
                selectedTags.pop();
                return true;
            }
            return false;
        };

        /**
         * Adds a tag.
         */
        $scope.addTag = function () {
            if ($scope.newTagName.length === 0) {
                return;
            }

            if (!$scope.selectedTags) {
                $scope.selectedTags = [];
            }

            var selectedTag = $scope.filteredTags[$scope.selectedIndex];

            if (!!selectedTag && $scope.selectedTags &&
                $scope.selectedTags.indexOf(selectedTag) === -1) {

                $scope.selectedTags.push(selectedTag);
                $scope.newTagName = '';
                applyFilter();
            }

        };

        /**
         * Removes a tag.
         */
        $scope.removeTag = function (tag) {
            if (!$scope.selectedTags) {
                return;
            }
            var idx = $scope.selectedTags.indexOf(tag);
            if (idx > -1) {
                $scope.selectedTags.splice(idx, 1);
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