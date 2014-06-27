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
    function ($q, $parse, $position, typeaheadParser) {
        'use strict';

        var HOT_KEYS = [9, 13, 27, 38, 40];

        return {
            restrict: 'EAo',
            replace: true,
            scope: {
                tagCompleteTags: '=',
                tagCompleteLabelField: '@',
                tagCompleteTagTemplateUrl: '=',
                tagCompleteOptionTemplateUrl: '=',
                tagCompleteVerify: '&',
                tagCompleteOnSelect: '&',
                tagCompleteLoading: '&'
            },
            templateUrl: 'app/util/template/tag_complete.html',
            link: function ($scope, $element, attrs) {
                /**
                 * Grab our input.
                 */
                var $input = $element.find('input');

                /**
                 * The typeahead query parser, used for our selection syntax.
                 */
                var parserResult = typeaheadParser.parse(attrs.tagComplete);

                /**
                 * A setter that simplifies setting a property in the original
                 * scope when an async load is kicked off.
                 *
                 * @type {Function}
                 */
                var isLoadingSetter = function (isLoading) {
                    if (!!$scope.tagCompleteLoading) {
                        $scope.tagCompleteLoading({isLoading: isLoading});
                    }
                };

                /**
                 * URL for the template to use for the dropdown rendering.
                 *
                 * @type {String}
                 */
                $scope.tagCompleteTemplateUrl =
                    $parse(attrs.tagCompleteTemplateUrl);

                /**
                 * Are we focused?
                 * @type {Boolean}
                 */
                var hasFocus = false;

                /**
                 * Reset the matches on the scope.
                 */
                var resetMatches = function () {
                    $scope.matches = [];
                    $scope.activeIdx = -1;
                };

                /**
                 * Search for matches...
                 *
                 * @param inputValue
                 */
                var getMatchesAsync = function (inputValue) {

                    if (!hasFocus || !inputValue) {
                        return;
                    }

                    var locals = {$viewValue: inputValue};
                    isLoadingSetter(true);

                    $q.when(parserResult.source($scope.$parent, locals))
                        .then(function (matches) {


                            // Make sure that the returned query equals what's
                            // currently being searched for: It could be that
                            // we have multiple queries in flight...
                            if (inputValue === $scope.newTagName && hasFocus) {

                                // Transform Matches
                                $scope.matches = [];
                                for (var i = 0; i < matches.length; i++) {
                                    $scope.matches.push({
                                        label: parserResult
                                            .viewMapper($scope.$parent, locals),
                                        model: matches[i]
                                    });
                                }

                                if (matches.length > 0) {
                                    $scope.activeIdx = 0;
                                    $scope.query = inputValue;
                                } else {
                                    resetMatches();
                                }
                                isLoadingSetter(false);

                                // Position pop-up with matches - we need to
                                // re-calculate its position each time we are
                                // opening a window with matches due to other
                                // elements being rendered
                                $scope.position = $position.position($element);
                                $scope.position.top = $scope.position.top +
                                    $element.prop('offsetHeight');
                            }
                        }, function () {
                            resetMatches();
                            isLoadingSetter(false);
                        });
                };

                // Watch the model and trigger searches when the value changes.
                $scope.$watch(function () {
                    return $scope.newTagName;
                }, getMatchesAsync);

                /**
                 * Focus when the input gets focus.
                 */
                $input.on('focus', function () {
                    hasFocus = true;
                });

                /**
                 * Blur when the input gets blurred.
                 */
                $input.on('blur', function () {
                    resetMatches();
                    $scope.newTagName = '';
                    hasFocus = false;
                    $scope.$digest();
                });

                /**
                 * Bind to arrow controls, escape, and return.
                 */
                $input.on('keydown', function (evt) {

                    // Make sure we have something to react to.
                    if ($scope.matches.length === 0 ||
                        HOT_KEYS.indexOf(evt.which) === -1) {
                        return;
                    }

                    evt.preventDefault();

                    if (evt.which === 40) {
                        $scope.activeIdx = ($scope.activeIdx + 1) %
                            $scope.matches.length;
                        $scope.$digest();
                    } else if (evt.which === 38) {
                        $scope.activeIdx = ($scope.activeIdx ? $scope.activeIdx
                            : $scope.matches.length) - 1;
                        $scope.$digest();
                    } else if (evt.which === 13 || evt.which === 9) {
                        $scope.$apply(function () {
                            $scope.select($scope.activeIdx);
                        });
                    } else if (evt.which === 27) {
                        evt.stopPropagation();

                        resetMatches();
                        $scope.$digest();
                    }
                });

                /**
                 * Event handler when delete is pressed inside the input field.
                 * Pops the last item off the selected list.
                 */
                $scope.deletePressed = function () {
                    var selectedTags = $scope.tagCompleteTags || [];

                    if (selectedTags.length > 0 && !$scope.newTagName) {
                        selectedTags.pop();
                        return true;
                    }
//                    return false;
                };

                /**
                 * When a user clicks on the background of this control, we want
                 * to focus the text input field.
                 */
                $scope.focus = function () {

                    $input[0].focus();
                };

                /**
                 * When a user clicks on the actual tag, we need to intercept
                 * the mouse event so it doesn't refocus the cursor.
                 */
                $scope.noFocus = function (event) {
                    event.stopImmediatePropagation();
                };

                /**
                 * Called when something's selected
                 */
                $scope.select = function (idx) {
                    var item = $scope.matches[idx].model;

                    $scope.tagCompleteTags.push(item);

                    $scope.newTagName = '';
                    resetMatches();

                    if (!!$scope.tagCompleteOnSelect) {
                        $scope.tagCompleteOnSelect({tag: item});
                    }
                };

                /**
                 * Removes a tag.
                 */
                $scope.removeTag = function (tag) {
                    if (!$scope.tagCompleteTags) {
                        return;
                    }
                    var idx = $scope.tagCompleteTags.indexOf(tag);
                    if (idx > -1) {
                        $scope.tagCompleteTags.splice(idx, 1);
                    }
                };

                resetMatches();
            }
        };
    })
    .directive('tagCompleteTag',
    function ($http, $templateCache, $compile, $parse) {
        'use strict';

        return {
            restrict: 'EA',
            scope: {
                index: '=',
                tag: '=',
                labelField: '=',
                removeTag: '&'
            },
            link: function (scope, element, attrs) {
                var tplUrl = $parse(attrs.templateUrl)(scope.$parent) ||
                    '/tag_complete/default_tag_template.html';

                $http.get(tplUrl, {cache: $templateCache})
                    .success(function (tplContent) {
                        element.replaceWith($compile(tplContent.trim())(scope));
                    });
            }
        };
    });
