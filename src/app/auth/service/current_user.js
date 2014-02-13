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
 * The current user service. It pays attention to changes in the application's
 * session state, and loads the user found in the AccessToken when a valid
 * session is detected.
 */
angular.module('sb.auth').factory('CurrentUser',
    function (SessionState, Session, AccessToken, $rootScope, $log, $q, User) {
        'use strict';

        /**
         * The current user
         */
        var currentUser = null;

        /**
         * Load the current user, if such exists.
         */
        function loadCurrentUser() {
            if (Session.getSessionState() === SessionState.LOGGED_IN) {
                var userId = AccessToken.getIdToken();

                $log.debug('Loading Current User ' + userId);
                currentUser = User.get({id: userId});
            } else {
                currentUser = null;
            }
        }

        $rootScope.$on(SessionState.LOGGED_IN, loadCurrentUser);
        $rootScope.$on(SessionState.LOGGED_OUT, loadCurrentUser);

        loadCurrentUser();

        // Expose the methods for this service.
        return {
            /**
             * Retrieve the current user.
             */
            get: function () {
                return currentUser;
            }
        };
    });