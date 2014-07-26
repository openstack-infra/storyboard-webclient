/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
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
 * The angular resource abstraction that allows us to create and modify tasks.
 *
 * @see storyboardApiSignature
 * @author Michael Krotscheck
 */
angular.module('sb.services').factory('Task',
    function ($q, $resource, storyboardApiBase, storyboardApiSignature,
              Criteria, Story, User) {
        'use strict';

        var parameters = {
            story: 'story_id',
            user: 'assignee_id'
        };

        // Build the resource off of our global API signature.
        var resource = $resource(storyboardApiBase + '/tasks/:id',
            {id: '@id'},
            storyboardApiSignature);

        /**
         * This method will resolve the project as a search criteria type.
         */
        resource.criteriaResolver = function () {
            var deferred = $q.defer();
            deferred.resolve([]);
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
                Story.criteriaResolver,
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