/*
 * Copyright (c) 2015 Hewlett-Packard Development Company, L.P.
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
 * A resource to our neutral system_info endpoint.
 */
angular.module('sb.services').factory('SystemInfo',
    function ($resource, storyboardApiBase) {
        'use strict';

        return $resource(storyboardApiBase + '/systeminfo', {},
            {
                'get': {
                    method: 'GET',
                    cache: true
                }
            }
        );
    }
);
