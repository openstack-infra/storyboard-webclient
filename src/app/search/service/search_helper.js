/**
 * Copyright (c) 2016 Codethink Ltd
 * Copyright (c) 2017 Adam Coldrick
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
 * A service providing helper functions for search views.
 */
angular.module('sb.search').factory('SearchHelper',
    function(User, Project, ProjectGroup, Story, Task, Criteria,
             $filter, $q) {
        'use strict';

        /**
         * Create search criteria based on some given parameters.
         */
        function parseParameters(params) {
            var criteria = [];
            var promises = [];
            if (params.q) {
                criteria.push(
                    Criteria.create('Text', params.q)
                );
            }
            if (params.title) {
                criteria.push(
                    Criteria.create('Text', params.title)
                );
            }
            if (params.status) {
                criteria.push(
                    Criteria.create('StoryStatus', params.status,
                                    $filter('capitalize')(params.status))
                );
            }
            if (params.tags) {
                if (params.tags.constructor === Array) {
                    angular.forEach(params.tags, function(tag) {
                        criteria.push(
                            Criteria.create('Tags', tag, tag)
                        );
                    });
                } else {
                    criteria.push(
                        Criteria.create('Tags', params.tags, params.tags)
                    );
                }
            }
            if (params.assignee_id || params.creator_id) {
                var id = params.assignee_id || params.creator_id;
                var userPromise = User.get({'id': id}).$promise;
                promises.push(userPromise);

                userPromise.then(function(result) {
                        criteria.push(
                            Criteria.create('User',
                                            params.assignee_id,
                                            result.full_name + ' <'
                                            + result.email + '>')
                        );
                    }
                );
            }
            if (params.project_id) {
                var projectParams = {'id': params.project_id};
                var projectPromise = Project.get(projectParams).$promise;
                promises.push(projectPromise);

                projectPromise.then(function(result) {
                        criteria.push(
                            Criteria.create('Project',
                                            params.project_id,
                                            result.name)
                        );
                    }
                );
            }
            if (params.project_group_id) {
                var groupParams = {'id': params.project_group_id};
                var groupPromise = ProjectGroup.get(groupParams).$promise;
                promises.push(groupPromise);

                groupPromise.then(function(result) {
                        criteria.push(
                            Criteria.create('ProjectGroup',
                                            params.project_group_id,
                                            result.title)
                        );
                    }
                );
            }
            if (params.story_id) {
                var storyParams = {'id': params.story_id};
                var storyPromise = Story.get(storyParams).$promise;
                promises.push(storyPromise);

                storyPromise.then(function(result) {
                        criteria.push(
                            Criteria.create('Story',
                                            params.story_id,
                                            result.title)
                        );
                    }
                );
            }
            if (params.task_id) {
                var taskParams = {'id': params.task_id};
                var taskPromise = Task.get(taskParams).$promise;
                promises.push(taskPromise);

                taskPromise.then(function(result) {
                        criteria.push(
                            Criteria.create('Task',
                                            params.task_id,
                                            result.title)
                        );
                    }
                );
            }

            var deferred = $q.defer();
            $q.all(promises).then(function() {
                deferred.resolve(criteria);
            });

            return deferred.promise;
        }

        return {
            parseParameters: parseParameters
        };
    }
);
