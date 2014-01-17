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
 * This service creates an automatic CRUD mock based on provided
 * urls and data sets.
 *
 * TODO(krotscheck): Once we have a real API, we can remove this.
 */

angular.module('sb.services')
    .factory('mock', function ($log, $urlMatcherFactory, $httpBackend) {
        'use strict';

        /**
         * URL matcher factory generator, used for testing API urls for
         * mocking.
         *
         * @param testUrl
         */
        function matchUrl(testUrl) {
            var urlMatcher = $urlMatcherFactory.compile(testUrl);

            return {
                test: function (url) {
                    return urlMatcher.exec(url);
                }
            };
        }

        /**
         * Utility method that extracts the array index from the default data
         * passed. Necessary because to simulate our mock list, we're splicing
         * all the time, so the actual indexes of the array may not match the
         * ID's of the items therein.
         */
        function getIndexById(defaultData, idParamName, id) {
            for (var i = 0; i < defaultData.length; i++) {
                var item = defaultData[i];
                if (item[idParamName] === id) {
                    return i;
                }
            }

            return false;
        }

        return {
            /**
             * This method mocks an entire RESTful api endpoint.
             */
            api: function (searchUrl, crudUrl, crudIdParamName, defaultData) {
                this.search(searchUrl, defaultData);
                this.crud(searchUrl, crudUrl, crudIdParamName, defaultData);
            },

            /**
             * This method creates a mock search service for the passed URL and
             * the provided data hash.
             */
            search: function (searchUrl, defaultData) {
                $httpBackend.when('GET', matchUrl(searchUrl))
                    .respond(function (method, url) {
                        $log.info('[mock] ' + method + ' ' + url);
                        return [200, {
                            total: defaultData.length,
                            offset: 0,
                            limit: defaultData.length,
                            results: defaultData
                        }];
                    }
                );
            },
            /**
             * This method creates a mock CRUD service for the passed URL,
             * ID parameter name, and data hash
             */
            crud: function (createUrl, crudUrl, idParamName, defaultData) {
                var crudMatcher = matchUrl(crudUrl);
                var createMatcher = matchUrl(createUrl);

                /**
                 * Mock responder for a POST action. Extracts the ID from the
                 * last item in our default data array and increments it, then
                 * adds another item with that same ID.
                 */
                var createResolver = function (method, url, body) {
                    $log.info('[mock] ' + method + ' ' + url);

                    body = JSON.parse(body);
                    var now = Math.round(new Date().getTime() / 1000);
                    body.id = defaultData[defaultData.length - 1].id + 1;
                    // jshint -W106
                    body.created_at = now;
                    body.updated_at = now;
                    // jshint +W106
                    defaultData[body.id] = body;
                    console.warn(defaultData);
                    return [201, body];
                };

                /**
                 * Mock responder for Get/Update/Delete. Given an existing ID,
                 * extracts the data from that location and either just sends
                 * it back, or manipulates it as requested.
                 */
                var rudResolver = function (method, url, body) {
                    $log.info('[mock] ' + method + ' ' + url);

                    if (!!body) {
                        body = JSON.parse(body);
                    }

                    var id = parseInt(crudMatcher.test(url).id);
                    var idx = getIndexById(defaultData, idParamName, id);
                    var now = Math.round(new Date().getTime() / 1000);

                    if (idx === false) {
                        return [404];
                    }

                    // Temporarily disable the camelcase JSHint rule.
                    // jshint -W106
                    switch (method) {
                        case 'GET':
                            return [200, defaultData[idx]];
                        case 'PUT':
                            body.id = id;
                            body.updated_at = now;
                            defaultData[idx] = body;
                            return [200, defaultData[idx]];
                        case 'DELETE':
                            defaultData.splice(idx, 1);
                            return [200];
                    }
                    // Re-enable camelcase check.
                    // jshint +W106
                };

                $httpBackend.when('POST', createMatcher)
                    .respond(createResolver);
                $httpBackend.when('GET', crudMatcher)
                    .respond(rudResolver);
                $httpBackend.when('PUT', crudMatcher)
                    .respond(rudResolver);
                $httpBackend.when('DELETE', crudMatcher)
                    .respond(rudResolver);
            }
        };
    });