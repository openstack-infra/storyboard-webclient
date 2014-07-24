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
 * A service which centralizes management of search criteria: Creation,
 * validation, filtering, criteria-to-parameter mapping, and more.
 */
angular.module('sb.services').service('Criteria',
    function ($q, $log, $injector, Preference) {
        'use strict';

        return {

            /**
             * This method takes a set of criteria, and filters out the
             * ones not valid for the passed resource.
             *
             * @param resourceName The name of the resource to filter for.
             * @param criteria The list of criteria.
             * @return {Array} A map of URL parameters.
             */
            filterCriteria: function (resourceName, criteria) {

                var resource = $injector.get(resourceName);

                // Sanity check: If we don't have this resource, wat?
                if (!resource || !resource.hasOwnProperty('criteriaFilter')) {
                    $log.warn('Attempting to filter criteria for unknown ' +
                        'resource "' + resourceName + '"');
                    return [];
                }

                return resource.criteriaFilter(criteria);
            },

            /**
             * This method takes a set of criteria, and maps them against the
             * query parameters available for the provided resource. It will
             * skip any items not valid for this resource, and return an
             * array of criteria that are valid
             *
             * @param resourceName
             * @param criteria
             * @return A map of URL parameters.
             */
            mapCriteria: function (resourceName, criteria) {
                var resource = $injector.get(resourceName);

                // Sanity check: If we don't have this resource, wat?
                if (!resource || !resource.hasOwnProperty('criteriaMap')) {
                    $log.warn('Attempting to map criteria for unknown ' +
                        'resource "' + resourceName + '"');
                    return {};
                }

                return resource.criteriaMap(criteria);
            },

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
            },

            /**
             * Rather than actually performing a search, this method returns a
             * customized lambda that will perform our browse search for us.
             *
             * @param types An array of resource types to browse.
             * @param pageSize An optional page size for the criteria. Defaults
             * to the global page_size preference.
             */
            buildCriteriaSearch: function (types, pageSize) {
                pageSize = pageSize || Preference.get('page_size');

                var resolvers = [];
                types.forEach(function (type) {
                    // Retrieve an instance of the declared resource.
                    var resource = $injector.get(type);

                    if (!resource.hasOwnProperty('criteriaResolvers')) {
                        $log.warn('Resource type "' + type +
                            '" does not implement criteriaResolvers.');
                        return;
                    }

                    resource.criteriaResolvers().forEach(function (resolver) {
                        if (resolvers.indexOf(resolver) === -1) {
                            resolvers.push(resolver);
                        }
                    });
                });

                /**
                 * Construct the search lambda that issues the search
                 * and assembles the results.
                 */
                return function (searchString) {
                    var deferred = $q.defer();

                    // Clear the criteria
                    var promises = [];

                    resolvers.forEach(function (resolver) {
                        promises.push(resolver(searchString, pageSize));
                    });

                    // Wrap everything into a collective promise
                    $q.all(promises).then(function (results) {
                        var criteria = [];

                        results.forEach(function (result) {
                            result.forEach(function (item) {
                                criteria.push(item);
                            });
                        });
                        deferred.resolve(criteria);
                    });

                    // Return the search promise.
                    return deferred.promise;
                };
            },

            /**
             * This method takes a set of criteria, and filters out the
             * ones not valid for the passed resource.
             *
             * @param parameterMap A map of criteria types and parameters
             * in the search query they correspond to.
             * @return {Function} A criteria filter for the passed parameters.
             */
            buildCriteriaFilter: function (parameterMap) {
                return function (criteria) {
                    var filteredCriteria = [];

                    criteria.forEach(function (item) {
                        if (parameterMap.hasOwnProperty(item.type)) {
                            filteredCriteria.push(item);
                        }
                    });
                    return filteredCriteria;
                };
            },

            /**
             * This method takes a set of criteria, and maps them against the
             * query parameters available for the provided resource. It will
             * skip any items not valid for this resource, and return an
             * array of criteria that are valid
             *
             * @param parameterMap A map of criteria types and parameters
             * in the search query they correspond to.
             * @return {Function} A criteria mapper for the passed parameters.
             */
            buildCriteriaMap: function (parameterMap) {
                return function (criteria) {
                    var params = {};

                    criteria.forEach(function (item) {
                        if (parameterMap.hasOwnProperty(item.type)) {
                            params[parameterMap[item.type]] = item.value;
                        }
                    });
                    return params;
                };
            }
        };
    }
);
