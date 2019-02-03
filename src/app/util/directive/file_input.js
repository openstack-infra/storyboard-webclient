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
 * A directive to make ng-model work on file input elements.
 */
angular.module('sb.util').directive('fileInput', function() {
    'use strict';

    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            element.on('change', function() {
                var fileList = element[0].files;
                var files = [];

                var k = 0;
                while (k < fileList.length) {
                    files.push(fileList[k]);
                    k++;
                }
                ngModel.$setViewValue(files);
            });
        }
    };
});
