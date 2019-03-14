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
 * search/filter criteria for various resources, and expose chosen criteria
 * to the scope. These criteria may be static or asynchronously loaded, and
 * may be property filters (title = foo) or resource filters (story_id = 22).
 */
angular.module('sb.search').controller('SearchCriteriaController',
    function ($log, $q, $scope, $location, $injector, Criteria) {
        'use strict';

        /**
         * Valid sets of resources that can be searched on. The default
         * assumes no resources may be searched.
         */
        var resourceTypes = [];

        /**
         * Managed list of active criteria tags.
         *
         * @type {Array}
         */
        $scope.criteria = [];

        /**
         * Initialize this controller with different resource types and
         * default search criteria.
         *
         * @param types
         * @param defaultCriteria
         */
        $scope.init = function (types, defaultCriteria) {
            resourceTypes = types || $scope.resourceTypes || resourceTypes;
            if (!!defaultCriteria) {
                defaultCriteria.then(function(criteria) {
                    $scope.criteria = criteria;
                });
            } else {
                $scope.criteria = [];
            }
            $scope.searchForCriteria =
                Criteria.buildCriteriaSearch(resourceTypes, 5);
        };

        $scope.$on('refresh-types', function() {
            $scope.init();
        });

        $scope.rewriteQueryString = function() {
            var params = {};
            angular.forEach(resourceTypes, function(resourceName) {
                var resource = $injector.get(resourceName);
                angular.forEach($scope.criteria, function() {
                    var criteriaMap = resource.criteriaMap($scope.criteria);
                    angular.extend(params, criteriaMap);
                });
            });
            $location.search(params);
        };

        /**
         * When a criteria is added, make sure we remove all previous criteria
         * that have the same type.
         */
        $scope.addCriteria = function (item) {
            for (var i = $scope.criteria.length - 1; i >= 0; i--) {
                var cItem = $scope.criteria[i];

                // Don't remove exact duplicates.
                if (cItem === item) {
                    continue;
                }

                if (item.type === cItem.type && 
                    item.type !== 'Tags' && 
                    item.type !== 'Text') {
                    $scope.criteria.splice(i, 1);
                }
            }
            $scope.rewriteQueryString();
        };

        /**
         * Remove a criteria
         */
        $scope.removeCriteria = function (item) {
            var idx = $scope.criteria.indexOf(item);
            if (idx > -1) {
                $scope.criteria.splice(idx, 1);
            }
            $scope.rewriteQueryString();
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
        $scope.searchForCriteria = function () {
            var deferred = $q.defer();
            deferred.resolve([]);
            return deferred.promise;
        };
    }
);
