/*
 * Copyright (c) 2014 Mirantis Inc.
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

/*
 * A collection of string utilities.
 *
 * @author Nikita Konovalov
 */

angular.module('sb.util').factory('StringUtil',
    function () {
        'use strict';

        return {
            /**
             * Helper to generate a random alphanumeric string for the state
             * parameter.
             *
             * @param length The length of the string to generate.
             * @returns {string} A random alphanumeric string.
             */
            randomAlphaNumeric: function (length) {
                var possible =
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
                    'abcdefghijklmnopqrstuvwxyz' +
                    '0123456789';

                return this.random(length, possible);
            },

            /**
             * Helper to generate a random string of specified length, using a
             * provided list of characters.
             *
             * @param length The length of the string to generate.
             * @param characters The list of valid characters.
             * @returns {string} A random string composed of provided
             * characters.
             */
            random: function (length, characters) {
                var text = '';

                for (var i = 0; i < length; i++) {
                    text += characters.charAt(Math.floor(
                        Math.random() * characters.length));
                }

                return text;
            }
        };
    }
);