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
 * The angular resource abstraction that allows us to access stories.
 *
 * @see storyboardApiSignature
 */
angular.module('sb.services').factory('Story',
    function ($q, $resource, storyboardApiBase, storyboardApiSignature,
              Criteria, textCriteriaResolver, Project, User) {
        'use strict';

        var parameters = {
            project: 'project_id',
            text: 'title',
            user: 'assignee_id',
            storyStatus: 'status'
        };

        /**
         * The story resource, build on our base API signature.
         */
        var resource = $resource(storyboardApiBase + '/stories/:id',
            {id: '@id'},
            storyboardApiSignature);

        /**
         * A list of valid story status items.
         *
         * @type {*[]}
         */
        var validStatusCriteria = [
            Criteria.create('storyStatus', 'active', 'Active'),
            Criteria.create('storyStatus', 'merged', 'Merged'),
            Criteria.create('storyStatus', 'invalid', 'Invalid')
        ];

        /**
         * This function acts as a criteria "loader" for the
         * story status enum.
         *
         * @returns {*}
         */
        function storyStatusCriteriaResolver(searchString) {
            var deferred = $q.defer();
            searchString = searchString || ''; // Sanity check
            searchString = searchString.toLowerCase(); // Lowercase for search

            var criteria = [];
            validStatusCriteria.forEach(function (criteriaItem) {
                var title = criteriaItem.title.toLowerCase();

                // If we match the title, OR someone is explicitly typing in
                // 'status'
                if (title.indexOf(searchString) > -1 ||
                    'status'.indexOf(searchString) === 0) {
                    criteria.push(criteriaItem);
                }
            });
            deferred.resolve(criteria);

            return deferred.promise;
        }

        /**
         * This method will resolve the story as a search criteria type.
         */
        resource.criteriaResolver = function (searchString) {
            var deferred = $q.defer();

            resource.query({title: searchString},
                function (result) {
                    // Transform the results to criteria tags.
                    var storyResults = [];
                    result.forEach(function (item) {
                        storyResults.push(
                            Criteria.create('story', item.id, item.title)
                        );
                    });
                    deferred.resolve(storyResults);
                }, function () {
                    deferred.resolve([]);
                }
            );

            return deferred.promise;
        };

        /**
         * Return a list of promise-returning methods that, given a search
         * string, will provide a list of search criteria.
         *
         * @returns {*[]}
         */
        resource.criteriaResolvers = function () {
            return [
                textCriteriaResolver,
                storyStatusCriteriaResolver,
                Project.criteriaResolver,
                User.criteriaResolver
            ];
        };

        /**
         * The criteria filter.
         */
        resource.criteriaFilter = Criteria.buildCriteriaFilter(parameters);

        /**
         * The criteria map.
         */
        resource.criteriaMap = Criteria.buildCriteriaMap(parameters);

        return resource;
    });