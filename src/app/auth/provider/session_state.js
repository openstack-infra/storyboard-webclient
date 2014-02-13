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
 * A list of constants used by the session service to maintain the user's
 * current authentication state.
 */
angular.module('sb.auth').value('SessionState', {

    /**
     * Session state constant, used to indicate that the user is logged in.
     */
    LOGGED_IN: 'logged_in',

    /**
     * Session state constant, used to indicate that the user is logged out.
     */
    LOGGED_OUT: 'logged_out',

    /**
     * Session state constant, used during initialization when we're not quite
     * certain yet whether we're logged in or logged out.
     */
    PENDING: 'pending'

});