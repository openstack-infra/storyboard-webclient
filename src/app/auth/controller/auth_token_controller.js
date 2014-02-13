/*
 * Copyright (c) 2014 Mirantis Inc.
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

/*
 * This controller is responsible for getting an access_token and
 * a refresh token having an authorization_code.
 *
 * @author Nikita Konovalov
 */

angular.module('sb.auth').controller('AuthTokenController',
    function ($scope, $state, $location, $window, storyboardApiBase) {
        'use strict';

        var code = $location.search().code;

        function redirect_to_access_token() {
            var state = $location.search().state;
            var openid = localStorage.getItem('openid');
            var local_state = localStorage.getItem('state');

            if (state !== local_state) {
                // Something is going wrong
                // Todo: handle that
                return;
            }

            localStorage.clear();

            $window.location.href = storyboardApiBase + '/auth/token' +
                '?grant_type=authorization_code' +
                '&code=' + encodeURIComponent(code) +
                '&client_id=1' +
                '&openid=' + encodeURIComponent(openid);
        }

        function process_access_token() {
            var access_token = $location.search().access_token;
            var expires_in = $location.search().expires_in;
            var refresh_token = $location.search().refresh_token;

            localStorage.setItem('access_token', access_token);
            var expires_in_int = parseInt(expires_in);
            localStorage.setItem('expires_in', expires_in_int);
            localStorage.setItem('expires_at',
                new Date(new Date().getTime() + expires_in_int * 1000));
            localStorage.setItem('refresh_token', refresh_token);
        }

        if (code) {
            // Let's get an access_token
            redirect_to_access_token();
        } else {
            // It's a response with an access_token and everything else
            process_access_token();

            $state.go('index');
        }
    });