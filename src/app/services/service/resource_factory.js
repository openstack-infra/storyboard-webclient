/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * Factory methods that simply construction of storyboard API resources.
 *
 * @author Michael Krotscheck
 */
angular.module('sb.services')
    .service('ResourceFactory',
    function ($q, $log, $injector, Criteria, $resource, storyboardApiBase,
              Preference) {
        'use strict';

        /**
         * This method is used in our API signature to return a recent value
         * for the user's pageSize preference.
         *
         * @returns {*}
         */
        function getLimit() {
            return $injector.get('pageSize');
        }

        /**
         * Construct a full API signature for a specific resource. Includes
         * CRUD, Browse, and Search. If the resource doesn't support it,
         * don't use it :).
         *
         * @param searchUrl
         * @returns An API signature that may be used with a $resource.
         */
        function buildSignature(searchUrl) {
            return {
                'create': {
                    method: 'POST'
                },
                'read': {
                    method: 'GET',
                    cache: false
                },
                'update': {
                    method: 'PUT'
                },
                'delete': {
                    method: 'DELETE'
                },
                'browse': {
                    method: 'GET',
                    isArray: true,
                    responseType: 'json',
                    params: {
                        limit: getLimit
                    }
                },
                'search': {
                    method: 'GET',
                    url: searchUrl,
                    isArray: true,
                    responseType: 'json',
                    params: {
                        limit: getLimit
                    }
                }
            };
        }


        return {

            /**
             * Build a resource URI.
             *
             * @param restUri
             * @param searchUri
             * @param resourceParameters
             * @returns {*}
             */
            build: function (restUri, searchUri, resourceParameters) {

                if (!restUri) {
                    $log.error('Cannot use resource factory ' +
                        'without a base REST uri.');
                    return null;
                }

                var signature = buildSignature(storyboardApiBase + searchUri);
                return $resource(storyboardApiBase + restUri,
                    resourceParameters, signature);
            },

            /**
             * This method takes an already configured resource, and applies
             * the static methods necessary to support the criteria browse API.
             * Browse parameters should be formatted as an object containing
             * 'injector name': 'param'. For example, {'Project': 'project_id'}.
             *
             * @param resourceName The explicit resource name of this resource
             * within the injection scope.
             * @param resource The configured resource.
             * @param browseParameters The browse parameters to apply.
             */
            applyBrowse: function (resourceName, resource, browseParameters) {

                // List of criteria resolvers which we're building.
                var criteriaResolvers = [];
                var browseParameter = null; // Default is ''

                for (var type in browseParameters) {

                    // Store the browse parameter for later.
                    if (type === 'Text') {
                        browseParameter = browseParameters[type];
                    }

                    // If the requested type exists and has a criteriaResolver
                    // method, add it to the list of resolvable browse criteria.
                    var typeResource = $injector.get(type);
                    if (!!typeResource &&
                        typeResource.hasOwnProperty('criteriaResolver')) {
                        criteriaResolvers.push(typeResource.criteriaResolver);
                    }
                }

                /**
                 * Return a list of promise-returning methods that, given a
                 * browse string, will provide a list of search criteria.
                 *
                 * @returns {*[]}
                 */
                resource.criteriaResolvers = function () {
                    return criteriaResolvers;
                };


                // If we found a browse parameter, add the ability to use
                // this resource as a source of criteria.
                if (!!browseParameter) {
                    /**
                     * Add the criteria resolver method.
                     */
                    resource.criteriaResolver =
                        function (searchString, pageSize) {
                            pageSize = pageSize || Preference.get('page_size');

                            var deferred = $q.defer();

                            // build the query parameters.
                            var queryParams = {};
                            queryParams[browseParameter] = searchString;
                            queryParams.limit = pageSize;

                            resource.query(queryParams,
                                function (result) {
                                    // Transform the results to criteria tags.
                                    var criteriaResults = [];
                                    result.forEach(function (item) {
                                        criteriaResults.push(
                                            Criteria.create(resourceName,
                                                item.id,
                                                item[browseParameter])
                                        );
                                    });
                                    deferred.resolve(criteriaResults);
                                }, function () {
                                    deferred.resolve([]);
                                }
                            );

                            return deferred.promise;
                        };
                }


                /**
                 * The criteria filter.
                 */
                resource.criteriaFilter = Criteria
                    .buildCriteriaFilter(browseParameters);

                /**
                 * The criteria map.
                 */
                resource.criteriaMap = Criteria
                    .buildCriteriaMap(browseParameters);

            }
        };
    });
