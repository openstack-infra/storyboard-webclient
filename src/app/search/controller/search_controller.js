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
 * This controller provides initialization logic for the generic search view.
 */
angular.module('sb.search').controller('SearchController',
    function ($log, $q, $scope, Criteria, $stateParams) {
        'use strict';

        /**
         * Default criteria, potentially populated by the q param.
         *
         * @type {Array}
         */
        $scope.defaultCriteria = [];

        /**
         * List of resource types which this view will be searching on.
         *
         * @type {string[]}
         */
        $scope.resourceTypes = ['Story', 'Project', 'User', 'Task'];

        /**
         * If a 'q' exists in the state params, go ahead and add it.
         */
        if ($stateParams.hasOwnProperty('q') && !!$stateParams.q) {
            $scope.defaultCriteria.push(
                Criteria.create('text', $stateParams.q)
            );
        }
    }
);
