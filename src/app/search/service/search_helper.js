/*
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
  function(User, Project, ProjectGroup, Criteria, $filter) {
    'use strict';

    /**
     * Create search criteria based on some given parameters.
     */
    function parseParameters(params, criteria) {
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
          })
        } else {
          criteria.push(
            Criteria.create('Tags', params.tags, params.tags)
          );
        }
      }
      if (params.assignee_id) {
        User.get({'id': params.assignee_id}).$promise
          .then(function(result) {
            criteria.push(
              Criteria.create('User', params.assignee_id,
                              result.full_name)
            );
          }
        );
      }
      if (params.project_id) {
        Project.get({'id': params.project_id}).$promise
          .then(function(result) {
            criteria.push(
              Criteria.create('Project', params.project_id,
                              result.name)
            );
          }
        );
      }
      if (params.project_group_id) {
        ProjectGroup.get({'id': params.project_group_id}).$promise
          .then(function(result) {
            criteria.push(
              Criteria.create('ProjectGroup',
                              params.project_group_id,
                              result.title)
            );
          }
        );
      }
    }

    return {
      parseParameters: parseParameters
    };
  }
);
