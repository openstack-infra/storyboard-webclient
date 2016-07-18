/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 * Copyright (c) 2016 Codethink Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/*
 * Automatic configuration loader. Checks the /config endpoint, and if
 * it receives a JSON hash will load all the found values into the application
 * module.
 */
angular.element(document)
    .ready(function () {
        'use strict';

        var initInjector = angular.injector(['ng']);
        var $http = initInjector.get('$http');
        var $log = initInjector.get('$log');

        function initializeApplication(config) {
            var defaults = {
                enableEditableComments: false
            };

            // Set default config values
            for (var key in defaults) {
                if (!config.hasOwnProperty(key)) {
                    config[key] = defaults[key];
                }
            }

            // Load everything we got into our module.
            for (key in config) {
                $log.debug('Configuration: ' + key + ' -> ' + config[key]);
                angular.module('storyboard').constant(key, config[key]);
            }
            angular.bootstrap(document, ['storyboard']);
        }

        $log.info('Attempting to load parameters from ./config.json');
        $http.get('./config.json').then(
            function (response) {
                initializeApplication(response.data);
            },
            function () {
                $log.warn('Cannot load ./config.json, using defaults.');
                initializeApplication({});
            }
        );
    }
);
