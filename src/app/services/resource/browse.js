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
 * A browse service, which wraps common resources and their typeahead
 * resolution into a single service that returns a common result format.
 * It is paired with the Criteria service to provide a consistent data
 * format to identify resources independent of their actual schema.
 */
angular.module('sb.services').factory('Browse',
    function ($q, $log, Project, Story, User, Criteria) {
        'use strict';

        return {

            /**
             * Browse projects by search string.
             *
             * @param searchString A string to search by.
             * @return A promise that will resolve with the search results.
             */
            project: function (searchString) {
                // Search for projects...
                var deferred = $q.defer();

                Project.query({name: searchString},
                    function (result) {
                        // Transform the results to criteria tags.
                        var projResults = [];
                        result.forEach(function (item) {
                            projResults.push(
                                Criteria.create('project', item.id, item.name)
                            );
                        });
                        deferred.resolve(projResults);
                    }, function () {
                        deferred.resolve([]);
                    }
                );

                return deferred.promise;
            },

            /**
             * Browse users by search string.
             *
             * @param searchString A string to search by.
             * @return A promise that will resolve with the search results.
             */
            user: function (searchString) {

                // Search for users...
                var deferred = $q.defer();
                User.query({full_name: searchString},
                    function (result) {
                        // Transform the results to criteria tags.
                        var userResults = [];
                        result.forEach(function (item) {
                            userResults.push(
                                Criteria.create('user', item.id, item.full_name)
                            );
                        });
                        deferred.resolve(userResults);
                    }, function () {
                        deferred.resolve([]);
                    }
                );

                return deferred.promise;
            },

            /**
             * Browse stories by search string.
             *
             * @param searchString A string to search by.
             * @return A promise that will resolve with the search results.
             */
            story: function (searchString) {

                // Search for stories...
                var deferred = $q.defer();
                Story.query({title: searchString},
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
            },


            /**
             * Browse all resources by a provided search string.
             *
             * @param searchString
             * @return A promise that will resolve with the search results.
             */
            all: function (searchString) {
                var deferred = $q.defer();

                // Clear the criteria
                var criteria = [];

                // Wrap everything into a collective promise
                $q.all({
                    projects: this.project(searchString),
                    stories: this.story(searchString),
                    users: this.user(searchString)
                }).then(function (results) {
                    // Add the returned projects to the results list.
                    results.projects.forEach(function (item) {
                        criteria.push(item);
                    });
                    // Add the returned stories to the results list.
                    results.stories.forEach(function (item) {
                        criteria.push(item);
                    });
                    // Add the returned stories to the results list.
                    results.users.forEach(function (item) {
                        criteria.push(item);
                    });
                    deferred.resolve(criteria);
                });

                // Return the search promise.
                return deferred.promise;
            }
        };
    });
