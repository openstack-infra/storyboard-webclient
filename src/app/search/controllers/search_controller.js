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
 * The storyboard search controller. This implementation manages searching via
 * individual tags, which can be either a parameter or a resource type.
 * Param tags map to a resource's individual filter properties, while a
 * resource tag limits the type of resource that is searched. The controller
 * makes no assumptions about display: It merely exposes the search results
 * based on current search tags.
 *
 * Exposed search results take three values: null, when a search wasn't made,
 * [], when a search returned empty, or [{}], when results are available.
 */
angular.module('sb.search').controller('SearchController',
    function ($log, $q, $scope, $stateParams, Project, Story, Task) {
        'use strict';

        /**
         * List of valid resource types to search.
         */
        var resources = {
            'project': {
                name: 'project',
                resource: Project,
                params: ['name', 'description']
            },
            'story': {
                name: 'story',
                resource: Story,
                params: ['project_id', 'assignee_id', 'status', 'title',
                    'description']
            },
            'task': {
                name: 'task',
                resource: Task,
                params: ['story_id', 'assignee_id']
            }
        };

        /**
         * A collection of key/value pairs on which we're searching.
         */
        $scope.searchTags = [];

        /**
         * A collection of search results to render in the UI.
         */
        $scope.searchResults = {};

        /**
         * Clears our search results.
         */
        $scope.clear = function () {
            $scope.searchResults = {};
            for (var name in resources) {
                var resource = resources[name];
                $scope.searchResults[resource.name] = null;
            }
        };

        /**
         * The aggregate search promise, to indicate when we're done.
         */
        $scope.searchPromise = null;

        /**
         * Add a key/value pair on which we can search. These are passed
         * verbatim to the API.
         */
        $scope.addTag = function (type, key, value) {
            if (type === 'resource') {
                // If we're filtering on resource, check to make sure
                // it's a valid one.
                if (resources.hasOwnProperty(value)) {
                    $scope.searchTags.push({
                        'type': type,
                        'value': value
                    });
                }
                $scope.search();
            } else if (type === 'param') {
                // If we're filtering on a parameter, make sure that it's
                // a valid one.
                for (var name in resources) {

                    var resourceData = resources[name];

                    if (!resourceData.hasOwnProperty('params')) {
                        $log.debug('Resource config has no param list:', name);
                        continue;
                    }

                    // Do the defaults know about this key?
                    var params = resourceData.params;
                    if (params.indexOf(key) === -1) {
                        $log.debug('Search param not found:', name, key);
                        continue;
                    }

                    $scope.searchTags.push({
                        'type': type,
                        'key': key,
                        'value': value
                    });
                    $scope.search();
                    return;
                }
            }
        };

        /**
         * Remove a key/value pair from our search parameters.
         */
        $scope.removeTag = function (tag) {
            var idx = $scope.searchTags.indexOf(tag);
            if (idx > -1) {
                $scope.searchTags.splice(idx, 1);
                $scope.search();
            }
        };

        /**
         * Generate our search promises.
         */
        $scope.search = function () {
            // Clear previous searches.
            $scope.clear();

            // Figure out which search queries we're composing.
            var resources = getSearchResources();
            var promises = [];
            for (var i = 0; i < resources.length; i++) {
                var promise = executeQuery(
                    resources[i].name,
                    resources[i].resource,
                    resources[i].params,
                    $scope.searchTags);
                promises.push(promise);
            }

            // Wrap everything in a promise for the UI.
            $scope.searchPromise = $q.all(promises);
            $scope.searchPromise.then(function () {
                $scope.searchPromise = null;
            });
        };

        /**
         * Execute a specific search query.
         */
        function executeQuery(resourceName, resource, validParams, tags) {
            var params = {};

            // Build valid params for this resource.
            for (var i = 0; i < tags.length; i++) {
                var tag = tags[i];
                if (tag.type === 'resource') {
                    continue;
                }

                if (validParams.indexOf(tag.key) > -1) {
                    params[key] = tag.value;
                }
            }

            // add limits
            params.limit = 10;

            var result = resource.query(params);
            $scope.searchResults[resourceName] = result;

            return result.$promise;
        }

        /**
         * Extracts the active search types from the tags. If none are defined,
         * returns all types.
         */
        function getSearchResources() {
            var types = [];

            for (var i = 0; i < $scope.searchTags.length; i++) {
                var tag = $scope.searchTags[i];
                if (tag.type === 'resource') {
                    types.push(resources[tag.value]);
                }
            }

            if (types.length === 0) {
                for (var key in resources) {
                    types.push(resources[key]);
                }
            }

            return types;
        }


        // On initialization, convert the query parameters into tags.
        for (var key in $stateParams) {
            if (!!key) {
                $scope.addTag('param', key, $stateParams[key]);
            }
        }
    });
