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
 * set of source data.
 */
angular.module('sb.util').directive('tagInput',
    function () {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/templates/util/tag_input.html',
            link: function ($scope, element, attrs) {
                console.warn($scope, element, attrs);

                $scope.newTagName = '';
                $scope.focus = function () {

                };

                $scope.addTag = function (tagName) {
                    $scope.tags.push({
                        name: tagName
                    });
                    $scope.newTagName = '';
                };

                $scope.removeTag = function (tag) {
                    var idx = $scope.tags.indexOf(tag);
                    if (idx > -1) {
                        $scope.tags.splice(idx, 1);
                    }
                };


                $scope.tags = [
                    {
                        name: 'One'
                    },
                    {
                        name: 'Two'
                    }
                ];
            }
        };
    });