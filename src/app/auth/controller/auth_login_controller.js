/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
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

/**
 * This controller handles the logic for the OpenId provider redirect.
 *
 * @author Michael Krotscheck
 */
angular.module('sb.auth').controller('AuthLoginController',
    function ($scope, storyboardApiBase, $window) {
        'use strict';

        function random_state() {
            var text = '';
            var possible =
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
                'abcdefghijklmnopqrstuvwxyz' +
                '0123456789';

            var state_length = 10;

            for(var i=0; i < state_length; i++ ) {
                text += possible.charAt(Math.floor(
                    Math.random() * possible.length));
            }

            return text;
        }

        function authorize_redirect() {
            var randomstate = random_state();
            localStorage.setItem('state', randomstate);
            $window.location.href = storyboardApiBase + '/auth/login_redirect' +
                '?state=' + encodeURIComponent(randomstate);
        }

        authorize_redirect();

    });
