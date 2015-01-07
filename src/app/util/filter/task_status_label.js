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
 * Converts a task status label to a human readable string.
 */
angular.module('sb.util').filter('taskStatusLabel',
    function () {
        'use strict';

        return function (value) {

            switch( value ) {
                case 'invalid':
                    return 'Invalid';
                case 'todo':
                    return 'Todo';
                case 'review':
                    return 'Review';
                case 'inprogress':
                    return 'In Progress';
                case 'merged':
                    return 'Merged';
                default:
                    return 'Unknown Status';
            }
        };
    });
