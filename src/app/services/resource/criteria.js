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
    function ($log) {
        'use strict';

        var resourceParams = {
            Project: {
                text: 'name'
            },
            Story: {
                project: 'project_id',
                text: 'title',
                user: 'assignee_id'
            },
            Task: {
                story: 'story_id',
                user: 'assignee_id'
            },
            User: {
                text: 'full_name'
            }
        };

        return {

            /**
             * Is this resource name valid?
             *
             * @param resourceName
             * @returns {boolean}
             */
            isValidResource: function (resourceName) {
                return resourceParams.hasOwnProperty(resourceName);
            },


            /**
             * This method takes a set of criteria, and filters out the
             * ones not valid for the passed resource.
             *
             * @param resourceName The name of the resource to filter for.
             * @param criteria The list of criteria.
             * @return {Array} A map of URL parameters.
             */
            filterCriteria: function (resourceName, criteria) {

                // Sanity check: If we don't have this resource, wat?
                if (!this.isValidResource(resourceName)) {
                    $log.warn('Attempting to filter criteria for unknown ' +
                        'resource "' + resourceName + '"');
                    return [];
                }

                var filteredCriteria = [];
                var mapping = resourceParams[resourceName];

                criteria.forEach(function (item) {
                    if (mapping.hasOwnProperty(item.type)) {
                        filteredCriteria.push(item);
                    }
                });
                return filteredCriteria;
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
                // Sanity check: If we don't have this resource, wat?
                if (!this.isValidResource(resourceName)) {
                    $log.warn('Attempting to filter criteria for unknown ' +
                        'resource "' + resourceName + '"');
                    return [];
                }

                var params = {};
                var mapping = resourceParams[resourceName];

                criteria.forEach(function (item) {
                    if (mapping.hasOwnProperty(item.type)) {
                        params[mapping[item.type]] = item.value;
                    }
                });
                return params;
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
            }
        };
    }
);
