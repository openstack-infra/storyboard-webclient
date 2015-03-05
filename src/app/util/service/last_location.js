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
 * A service that keeps track of the last page we visited.
 */
angular.module('sb.util')
    .factory('LastLocation', function ($rootScope, localStorageService) {
        'use strict';

        /**
         * The last detected length of the history
         */

        // When the location changes, store the new one. Since the $location
        // object changes too quickly, we instead extract the hash manually.
        function onLocationChange(event, toLocation) {
            var url = new URL(toLocation);
            var hash = url.hash || '#!/';
            var trimmed_hash = hash.slice(2);
            if (trimmed_hash.indexOf('/auth') === -1) {
                localStorageService.set('lastLocation', trimmed_hash);
            }

        }

        // The published API.
        return {

            /**
             * Get the recorded history path at the provided index.
             */
            get: function () {
                return localStorageService.get('lastLocation');
            },

            /**
             * Initialize this service.
             */
            initialize: function () {
                // Register (and disconnect) our listener.
                $rootScope.$on('$destroy',
                    $rootScope.$on('$locationChangeStart', onLocationChange)
                );
            }
        };
    })
    .run(function (LastLocation) {
        'use strict';

        // Initialize this service.
        LastLocation.initialize();
    });
