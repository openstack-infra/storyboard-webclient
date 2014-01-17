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
 * Mock resource responses for the Project resource.
 */

angular.module('sb.services')
    .run(function (mock) {
        'use strict';

        var projects = [
            {
                'id': 0,
                'created_at': 12000000,
                'updated_at': 12000000,
                'name': 'Test Project 1',
                'description': 'Let\'s make orange juice',
                'team_id': null
            },
            {
                'id': 1,
                'created_at': 12000000,
                'updated_at': 12000000,
                'name': 'Test Project 2',
                'description': 'Let\'s make apple juice',
                'team_id': null
            },
            {
                'id': 2,
                'created_at': 12000000,
                'updated_at': 12000000,
                'name': 'Test Project 3',
                'description': 'Let\'s make lemonade',
                'team_id': null
            }
        ];

        mock.api('/api/v1/projects',
            '/api/v1/projects/:id',
            'id',
            projects);
    }
)
;