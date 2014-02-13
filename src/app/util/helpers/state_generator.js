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
 * Helper to generate a random alphanumeric string for the state parameter.
 *
 * @author Nikita Konovalov
 */

angular.module('sb.util').factory('stateGenerator',
    function() {
        'use strict';

        return {
            generate: function(state_length) {
                var text = '';
                var possible =
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
                    'abcdefghijklmnopqrstuvwxyz' +
                    '0123456789';

                for(var i=0; i < state_length; i++ ) {
                    text += possible.charAt(Math.floor(
                        Math.random() * possible.length));
                }

                return text;
            }
        };
    }
);