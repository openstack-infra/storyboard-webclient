/*
 * Copyright (c) 2014 Mirantis Inc.
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

/*
 * Helper for extracting a path form $location
 *
 * @author Nikita Konovalov
 */

angular.module('sb.util', []).factory('pathHelper',
    function($location) {
        'use strict';

        return {
            get_full_url_prefix: function() {
                var protocol = $location.protocol();
                var host = $location.host();
                var port = $location.port();

                return protocol + '://' + host + ':' + port;
            }
        };
    });