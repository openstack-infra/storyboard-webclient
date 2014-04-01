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
 * This directive, when attached to an input field, will detect
 * keystrokes and automatically resize the width of the control.
 *
 * Due to browser differences, we do not have access to a consistent text
 * measurement API. Therefore, we have to maintain a 'shadow' DOM element
 * that mirrors our existing one, dump our current text into that one, and then
 * measure the results.
 */
angular.module('sb.util')
    .directive('autoresizeWidth', function ($document) {
        'use strict';

        return {
            link: function ($scope, $element) {
                // Clone the created element and attach it to our DOM.
                var shadow = angular.element('<span></span>');
                shadow.attr('class', $element.attr('class'));
                shadow.css('display', 'none')
                    .css('white-space', 'pre')
                    .css('width', 'auto')
                    .css('visibility', 'hidden');

                // Sane attach/detach
                $document.find('body').append(shadow);
                $scope.$on('$destroy', function () {
                    $document.find('body').remove(shadow);
                });

                /**
                 * Recalculate size. We're binding this both to keypress and
                 * keyup, because the former allows us to trap regular
                 * keystrokes, while the latter allows us to capture copy,
                 * paste, etc. Note that this isn't perfect.
                 */
                function recalculateSize(event) {

                    var value = $element.val() || 'M'; // At least one
                    if (event && event.type === 'keypress') {
                        value += String.fromCharCode(event.which);
                    }

                    // Apply the value, trigger a rerender and then hide
                    // the control again. YES it's hacky. No, there's no better
                    // way to do this.
                    shadow.text(value);
                    shadow.css('display', 'inline-block');
                    try {
                        $element.width(shadow.width());
                    }
                    finally {
                        shadow.css('display', 'none');
                    }
                }

                $element.bind('keypress keyup', recalculateSize);
                recalculateSize();
            }
        };
    });