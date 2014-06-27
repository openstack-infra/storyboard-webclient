/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * A collection of date utilities.
 *
 * @author Yolanda Robla
 */
angular.module('sb.util').factory('DateUtil',
    function () {
        'use strict';

        return {

            /**
             * Helper to check if a date needs to be formatted using
             * TimeAgo plugion, or displaying UTC date
             *
             * @param date The date to be checked.
             * @returns {boolean} True if time ago needs to be used.
             */
            needsTimeAgo: function (targetDate) {
                if (targetDate)
                {
                    var currentDate = new Date().getTime();
                    var daydiff = (currentDate - Date.parse(targetDate))/
                        (1000*60*60*24);
                    return (daydiff < 7);
                }
                else
                {
                    return true;
                }
            }
        };
    }
);
