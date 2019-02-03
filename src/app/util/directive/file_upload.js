/*
 * Copyright (c) 2019 Adam Coldrick
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
 * A directive to use a file input element to upload files.
 */
angular.module('sb.util').directive('fileSelector', function() {
    'use strict';

    return {
        require: '',
        restrict: 'E',
        templateUrl: 'app/util/template/file_selector.html',
        scope: {
            onCancel: '&',
            onSave: '&',
            saveText: '@'
        },
        link: function(scope, element, attrs) {
            scope.files = [];
            scope.selectedFiles = function() {
                return scope.files.map(function(f) {
                    return f.name;
                }).join(', ');
            };
        }
    };
});
