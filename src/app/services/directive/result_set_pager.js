/*
 * Copyright (c) 2015 Hewlett-Packard Development Company, L.P.
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
 * A directive which displays a responsive result set size :
 * (showing x to y of z)
 */
angular.module('sb.services').directive('resultSetPager',
    function () {
        'use strict';

        return {
            restrict: 'E',
            templateUrl: 'app/services/template/result_set_pager.html',
            scope: {
                total: '=',
                offset: '=',
                limit: '=',
                listType: '=',
                minimalPager: '=',
                pageSize: '&onPageSize',
                nextPage: '&onNextPage',
                previousPage: '&onPreviousPage'
            }
        };
    });
