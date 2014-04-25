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
    .factory('LastLocation', function ($rootScope, $location) {
        'use strict';

        /**
         * The last detected length of the history
         */
        var lastLocation = $location.path();

        // When the location changes, store the new one. Since the $location
        // object changes too quickly, we instead extract the hash manually.
        function onLocationChange(event, toLocation, fromLocation) {
            var url = new URL(fromLocation);
            var hash = url.hash || '#!/';
            lastLocation = hash.slice(2);
        }

        // The published API.
        return {

            /**
             * Get the recorded history path at the provided index.
             */
            get: function () {
                return lastLocation;
            },

            /**
             * Initialize this service.
             */
            _initialize: function () {
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
        LastLocation._initialize();
    });
