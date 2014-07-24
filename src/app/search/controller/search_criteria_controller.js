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
 * The sole purpose of this controller is to allow a user to search for valid
 * search/filter criteria, and expose chosen criteria to the scope. These
 * criteria may either be resources, resource identifiers (type/id pairs),
 * or plain strings.
 */
angular.module('sb.search').controller('SearchCriteriaController',
    function ($log, $q, $scope, Criteria, Browse, $stateParams) {
        'use strict';

        /**
         * Valid sets of resources that can be searched on.
         */
        var resourceTypes = ['Story', 'Project', 'User', 'Task'];

        /**
         * Managed list of active criteria tags.
         *
         * @type {Array}
         */
        $scope.criteria = [];

        /**
         * When a criteria is added, make sure we remove duplicates - the
         * control doesn't handle that for us.
         */
        $scope.addCriteria = function (item) {
            var idx = $scope.criteria.indexOf(item);

            for (var i = 0; i < $scope.criteria.length; i++) {
                var cItem = $scope.criteria[i];

                // Don't remove exact duplicates.
                if (idx === i) {
                    continue;
                }

                // We can only search for one text type at a time.
                if (item.type === 'text' &&
                    cItem.type === 'text') {
                    $scope.criteria.splice(i, 1);
                    break;
                }

                // Remove any duplicate value types.
                if (item.type === cItem.type &&
                    item.value === cItem.value) {
                    $scope.criteria.splice(i, 1);
                    break;
                }
            }
        };

        /**
         * Remove a criteria
         */
        $scope.removeCriteria = function (item) {
            var idx = $scope.criteria.indexOf(item);
            if (idx > -1) {
                $scope.criteria.splice(idx, 1);
            }
        };

        /**
         * Validate criteria when the list changes.
         */
        $scope.$watchCollection(function () {
            return $scope.criteria;
        }, function () {
            // Now, check all search resources to see if we have _any_ valid
            // criteria.
            $scope.hasSomeValidCriteria = false;
            resourceTypes.forEach(function (resourceName) {
                var validCriteria = Criteria
                    .filterCriteria(resourceName, $scope.criteria);

                if (validCriteria.length === $scope.criteria.length) {
                    $scope.hasSomeValidCriteria = true;
                }
            });
        });

        /**
         * Search for available search criteria.
         */
        $scope.searchForCriteria = function (searchString) {
            var deferred = $q.defer();

            searchString = searchString || '';

            Browse.all(searchString, 5).then(function (results) {

                // Add text.
                results.unshift(Criteria.create('text', searchString));

                deferred.resolve(results);
            });

            // Return the search promise.
            return deferred.promise;
        };

        /**
         * If a 'q' exists in the state params, go ahead and add it.
         */
        if ($stateParams.hasOwnProperty('q') && !!$stateParams.q) {
            $scope.criteria.push(
                Criteria.create('text', $stateParams.q)
            );
        }
    }
);
