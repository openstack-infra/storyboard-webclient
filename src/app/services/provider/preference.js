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
 * Preference service, a convenience-cashing API in front of our UserPreference
 * service, with resolving/refresh functionality.
 */
angular.module('sb.services').provider('Preference',
    function () {
        'use strict';

        /**
         * Singleton preference provider.
         */
        var preferenceInstance = null;

        /**
         * Registered default preferences.
         */
        var defaults = {};

        /**
         * Each module can manually declare its own preferences that it would
         * like to keep track of, as well as set a default. During the config()
         * phase, inject the Preference Provider and call 'addPreference()' to
         * do so. An example is available at the bottom of this file.
         */
        this.addPreference = function (name, defaultValue) {
            defaults[name] = defaultValue;
        };

        /**
         * The actual preference implementation.
         */
        function Preference($q, $log, Session, AccessToken, UserPreference,
                            SessionState) {

            /**
             * The currently loaded preferences.
             */
            var preferences = {};

            /**
             * This function resolves the user preferences. If a valid session
             * is resolvable, it will load the preferences for the user.
             * Otherwise it will resolve the default preferences.
             *
             * @returns {deferred.promise|*}
             */
            this.resolveUserPreferences = function () {
                var deferred = $q.defer();

                // First resolve the session.
                var sessionPromise = Session.resolveSessionState();
                sessionPromise.then(
                    function (state) {
                        if (state === SessionState.LOGGED_IN) {
                            UserPreference.get({id: AccessToken.getIdToken()},
                                function (prefs) {
                                    deferred.resolve(prefs);
                                }, function () {
                                    deferred.resolve(defaults);
                                });
                        } else {
                            deferred.resolve(defaults);
                        }
                    },
                    function () {
                        deferred.resolve(defaults);
                    }
                );

                return deferred.promise;
            };

            /**
             * Create a composite result of preference defaults and server
             * provided defaults.
             */
            this.getAll = function () {
                var result = {};
                for (var def_key in defaults) {
                    result[def_key] = this.get(def_key);
                }

                for (var key in preferences) {
                    result[key] = preferences[key];
                }

                return result;
            };

            /**
             * Save all the preferences in the passed hash.
             */
            this.saveAll = function (newPrefs) {
                // Update the preferences.
                for (var key in defaults) {
                    if (preferences.hasOwnProperty(key)) {
                        if (preferences[key] !== newPrefs[key]) {
                            $log.debug('Preference Change: ' + key + ' -> ' +
                                newPrefs[key]);
                            preferences[key] = newPrefs[key];
                        }
                    }
                }
                return this.save();
            };

            /**
             * Returns the value for a given preference.
             */
            this.get = function (key) {

                // Is this a valid preference?
                if (!defaults.hasOwnProperty(key)) {
                    $log.warn('Attempt to get unregistered preference: ' +
                        key);
                    return null;
                }

                // If the value is unset, and we have a default,
                // set that.
                if (!preferences.hasOwnProperty(key)) {
                    $log.warn('Setting default preference: ',
                        key, defaults[key]);
                    this.set(key, defaults[key]);
                }

                return preferences[key];
            };

            /**
             * Save a preference and return the saving promise.
             */
            this.set = function (key, value) {
                // Is this a valid preference?
                if (!defaults.hasOwnProperty(key)) {
                    $log.warn('Attempt to set unregistered preference: ' +
                        key);
                    return null;
                }

                // Store the preference.
                preferences[key] = value;

                return this.save();
            };

            /**
             * Resolve the preferences.
             */
            this.refresh = function () {
                var deferred = $q.defer();

                // This should never fail, see implementation above.
                this.resolveUserPreferences().then(
                    function (newPrefs) {
                        preferences = newPrefs;
                        deferred.resolve(preferences);
                    }
                );

                return deferred.promise;
            };

            /**
             * Private save method.
             */
            this.save = function () {
                var deferred = $q.defer();

                // If preferences are defaults, they won't have a $save()
                // method.
                if (!preferences.$save) {
                    deferred.resolve();
                } else {
                    preferences.$save({id: AccessToken.getIdToken()},
                        function () {
                            deferred.resolve();
                        }, function () {
                            deferred.resolve();
                        });
                }

                return deferred.promise;
            };
        }

        /**
         * Factory getter - returns a configured instance of preference
         * provider, as needed.
         */
        this.$get =
            function ($injector) {
                if (!preferenceInstance) {
                    preferenceInstance = $injector.instantiate(Preference);
                }
                return preferenceInstance;
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
        PreferenceProvider.addPreference('story_detail_page_size', 10);
        PreferenceProvider.addPreference(
            'project_group_detail_projects_page_size', 10);
        PreferenceProvider.addPreference(
            'project_group_detail_stories_page_size', 10);
        PreferenceProvider.addPreference('project_detail_page_size', 10);

    });
