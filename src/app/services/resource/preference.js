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
 * A simple preferences service, backed by localStorage.
 */
angular.module('sb.services').provider('Preference',
    function () {
        'use strict';

        /**
         * Our preference defaults. We're using underscore naming here in
         * anticipation of these keys living on the python side of things.
         */
        var defaults = { };

        /**
         * Preference name key generator. Basically it's poor man's
         * namespacing.
         */
        function preferenceName(key) {
            return 'pref_' + key;
        }

        /**
         * Each module can manually declare its own preferences that it would
         * like to keep track of, as well as set a default. During the config()
         * phase, inject the Preference Provider and call 'addPreference()' to
         * do so. An example is available at the bottom of this file.
         */
        this.addPreference = function (preferenceName, preferenceDefault) {
            defaults[preferenceName] = preferenceDefault;
        };

        /**
         * The actual preference implementation.
         */
        function Preference($log, localStorageService) {
            /**
             * Get a preference.
             */
            this.$get = function (key) {

                // Is this a valid preference?
                if (!defaults.hasOwnProperty(key)) {
                    $log.warn('Attempt to get unregistered preference: ' +
                        key);
                    return null;
                }

                var value = localStorageService.get(preferenceName(key));

                // If the value is unset, and we have a default, set and use
                // that.
                if (value === null && defaults.hasOwnProperty(key)) {
                    var defaultValue = defaults[key];
                    this.$set(key, defaultValue);
                    return defaultValue;
                }

                return value;
            };

            /**
             * Set a preference.
             */
            this.$set = function (key, value) {

                // Is this a valid preference?
                if (!defaults.hasOwnProperty(key)) {
                    $log.warn('Attempt to set unregistered preference: ' +
                        key);
                    return null;
                }

                return localStorageService.set(preferenceName(key), value);
            };
        }

        /**
         * Factory getter - returns a configured instance of preference
         * provider, as needed.
         */
        this.$get = function ($log, localStorageService) {
            return new Preference($log, localStorageService);
        };
    })
    .config(function (PreferenceProvider) {
        'use strict';

        // WARNING: In all modules OTHER than the services module, this config
        // block can appear anywhere as long as this module is listed as a
        // dependency. In the services module, the config() block must appear
        // AFTER the provider block. For more information,
        // @see https://github.com/angular/angular.js/issues/6723

        // Let our preference provider know about page_size.
        PreferenceProvider.addPreference('page_size', 10);

    })
;