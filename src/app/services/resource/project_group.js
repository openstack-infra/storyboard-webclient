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
 * The angular resource abstraction that allows us to access projects groups.
 *
 * @see storyboardApiSignature
 * @author Michael Krotscheck
 */
angular.module('sb.services').factory('ProjectGroup',
    function ($resource, storyboardApiBase, storyboardApiSignature) {
        'use strict';

        return $resource(storyboardApiBase + '/project_groups/:id',
            {id: '@id'},
            storyboardApiSignature);
    });


/*
 This is initial commit adding pecan/wsme framework.
 Example operations are:
 * GET /v1/project_groups
 * GET /v1/project_groups/<group_name>

 * GET /v1/projects
 * GET /v1/projects/<project_name>

 * GET /v1/teams
 * GET /v1/teams/<team_name>
 * POST /v1/teams

 * GET /v1/users
 * GET /v1/users/<username>
 * POST /v1/users
 * PUT /v1/users/<username>
 */