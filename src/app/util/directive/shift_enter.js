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
 * This directive adds the ng-shift-enter directive. It intercepts keystrokes
 * and will execute the bound method if that keystroke is the enter key.
 *
 * @author Michael Krotscheck
 */
angular.module('sb.util').directive('ngShiftEnter', function () {
    'use strict';

    return function (scope, element, attrs) {

        element.bind('keydown keypress', function (event) {
            if (event.which === 13 && event.shiftKey) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngShiftEnter);
                });

                event.preventDefault();
            }
        });
    };
});
