/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * A service which centralizes construction of search criteria.
 */
angular.module('sb.services').service('Criteria',
    function () {
        'use strict';

        return {

            /**
             * Create a new build criteria object.
             *
             * @param type The type of the criteria tag.
             * @param value Value of the tag. Unique DB ID, or text string.
             * @param title The title of the criteria tag.
             * @returns {Criteria}
             */
            create: function (type, value, title) {
                title = title || value;
                return {
                    'type': type,
                    'value': value,
                    'title': title
                };
            }
        };
    }
);
