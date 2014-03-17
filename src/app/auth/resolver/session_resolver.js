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
 * A set of utility methods that may be used during state declaration to enforce
 * session state. They return asynchronous promises which will either resolve
 * or reject the state change, depending on what you're asking for.
 */
angular.module('sb.auth').constant('SessionResolver',
    (function () {
        'use strict';

        /**
         * Resolve the promise based on the current session state. We can't
         * inject here, since the injector's not ready yet.
         */
        function resolveSessionState(deferred, desiredSessionState, Session) {
            return function () {
                var sessionState = Session.getSessionState();
                if (sessionState === desiredSessionState) {
                    deferred.resolve(sessionState);
                } else {
                    deferred.reject(sessionState);
                }
            };
        }

        return {
            /**
             * This resolver asserts that the user is logged
             * out before allowing a route. Otherwise it fails.
             */
            requireLoggedOut: function ($q, $log, Session, SessionState) {

                $log.debug('Resolving logged-out-only route...');
                var deferred = $q.defer();
                var resolveLoggedOut = resolveSessionState(deferred,
                    SessionState.LOGGED_OUT, Session);

                // Do we have to wait for state resolution?
                if (Session.getSessionState() === SessionState.PENDING) {
                    Session.resolveSessionState().then(resolveLoggedOut);
                } else {
                    resolveLoggedOut();
                }

                return deferred.promise;
            },

            /**
             * This resolver asserts that the user is logged
             * in before allowing a route. Otherwise it fails.
             */
            requireLoggedIn: function ($q, $log, Session, $rootScope,
                                       SessionState) {

                $log.debug('Resolving logged-in-only route...');
                var deferred = $q.defer();
                var resolveLoggedIn = resolveSessionState(deferred,
                    SessionState.LOGGED_IN, Session);

                // Do we have to wait for state resolution?
                if (Session.getSessionState() === SessionState.PENDING) {
                    Session.resolveSessionState().then(resolveLoggedIn);
                } else {
                    resolveLoggedIn();
                }

                return deferred.promise;
            },

            /**
             * This resolver ensures that the currentUser has been resolved
             * before the route resolves.
             */
            requireCurrentUser: function ($q, $log, CurrentUser) {
                $log.debug('Resolving current user...');
                return CurrentUser.resolve();
            }
        };
    })());
