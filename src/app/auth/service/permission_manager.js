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
 * This service maintains our permission state while the client is running.
 * Rather than be based on a per-request basis whose responses can quickly
 * become stale, it broadcasts events which views/directives can use to
 * update their permissions.
 *
 * At the moment this is a fairly naive implementation, which assumes that
 * permissions are defined as key/value pairs, and are globally scoped.
 * For example, this is possible:
 *
 *      isSuperuser: true
 *
 * But this is not.
 *
 *      Project ID 4, canEdit: false
 *
 * We'll need to update this once we know what our permission structure
 * looks like.
 */
angular.module('sb.auth').factory('PermissionManager',
    function ($log, $q, $rootScope, Session, SessionState, CurrentUser) {
        'use strict';

        // Our permission resolution cache.
        var permCache = {};
        var NOTIFY_PERMISSIONS = 'notify_permissions';

        /**
         * Resolve a permission.
         */
        function resolvePermission(permName) {
            var deferred = $q.defer();

            if (permCache.hasOwnProperty(permName)) {
                deferred.resolve(permCache[permName]);
            } else {
                CurrentUser.resolve().then(
                    function (user) {
                        permCache[permName] = user[permName];
                        deferred.resolve(permCache[permName]);
                    },
                    function (error) {
                        deferred.reject(error);
                    }
                );
            }

            return deferred.promise;
        }

        /**
         * Clear the permission cache and notify the system that it needs
         * to re-resolve the permissions.
         */
        function clearPermissionCache() {
            $log.debug('Resetting permission cache.');
            permCache = {};
            $rootScope.$broadcast(NOTIFY_PERMISSIONS);
        }

        /**
         * Wrapper function which resolves the permission we're looking
         * for and then invokes the passed handler.
         */
        function permissionListenHandler(permName, handler) {
            return function () {
                resolvePermission(permName).then(
                    function (value) {
                        handler(value);
                    },
                    function () {
                        handler(null);
                    }
                );
            };
        }

        return {
            /**
             * Initialize the permission manager on the passed scope.
             */
            initialize: function () {
                $log.debug('Initializing permissions');

                $rootScope.$on('$destroy',
                    $rootScope.$on(SessionState.LOGGED_IN,
                        clearPermissionCache)
                );
                $rootScope.$on('$destroy',
                    $rootScope.$on(SessionState.LOGGED_OUT,
                        clearPermissionCache)
                );

                // Run update if the session state has already resolved.
                // Otherwise wait for the above listeners.
                if (Session.getSessionState() !== SessionState.PENDING) {
                    clearPermissionCache();
                }
            },

            /**
             * Convenience method which allows a
             * @param scope The view scope that wants to listen to permission
             * changes.
             * @param permName The name of the permission.
             * @param handler The response handler
             */
            listen: function (scope, permName, handler) {
                var messageHandler = permissionListenHandler(permName, handler);

                scope.$on('$destroy',
                    $rootScope.$on(NOTIFY_PERMISSIONS, messageHandler)
                );

                // Trigger the handler once.
                messageHandler();
            },

            /**
             * Resolve a specific permission. Loads from a resolution cache
             * if this permission is currently unknown.
             */
            resolve: function (permName) {
                return resolvePermission(permName);
            }
        };
    });