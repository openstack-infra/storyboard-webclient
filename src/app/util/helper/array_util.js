/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * Array utilities.
 */
angular.module('sb.util').factory('ArrayUtil',
    function () {
        'use strict';

        return {

            /**
             * Performs a logical intersection on two arrays. Given A, and B,
             * returns A∩B, the set of all objects that are in both A and B.
             *
             * @param A
             * @param B
             */
            intersection: function (A, B) {
                var result = [];
                A.forEach(function (item) {
                    if (B.indexOf(item) > -1) {
                        result.push(item);
                    }
                });

                return result;
            },

            /**
             * Performs a logical difference operation on the two
             * arrays. Given sets U and A it will return U\A, the set of all
             * members of U that are not members of A.
             *
             * @param U
             * @param A
             */
            difference: function (U, A) {
                var result = [];
                U.forEach(function (item) {
                    if (A.indexOf(item) === -1) {
                        result.push(item);
                    }
                });

                return result;
            }
        };
    }
);
