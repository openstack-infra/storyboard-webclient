/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * A list of custom matchers to simplify our unit tests.
 */
beforeEach(function () {
    'use strict';

    // Make sure our custom matchers are registered on every run.
    jasmine.addMatchers({

        /**
         * This custom matcher compares the actual value with a string of
         * characters, which must all be contained within the actual string. If
         * the actual value contains anything other than those characters, the
         * test will fail.
         */
        toOnlyContain: function () {

            return {
                compare: function (actual, expected) {
                    var result = {
                        pass: true,
                        message: ''
                    };

                    for (var i = 0; i < actual.length; i++) {
                        var currentChar = actual.charAt(i);
                        var charIndex = expected.indexOf(currentChar);
                        if (charIndex === -1) {
                            result.pass = false;
                            result.message = 'String "' + actual +
                                '" may only contain "' + expected + '".';
                            break;
                        }

                    }
                    return result;
                }
            };
        }
    });
});