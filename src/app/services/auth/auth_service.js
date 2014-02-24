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

angular.module('sb.services').service('authService',
        function ($location, $rootScope, $window,
                  localStorageService, pathHelper, storyboardApiBase,
                  stateGenerator) {
            'use strict';
            this.loginHandler = function() {
                var randomState = stateGenerator.generate(10);
                localStorageService.set('state', randomState);
                $window.location.href = storyboardApiBase +
                    '/auth/login_redirect' +
                    '?state=' + encodeURIComponent(randomState);

            };

            this.authCodeHandler = function() {
                var state = localStorageService.get('state');

                if (!state) {
                    // This should not happens is the flow goes as designed
                    // Todo: handle this somehow
                    return;
                }

                var openid = $location.search().openid;
                var email = $location.search().email;
                var fullname = $location.search().fullname;

                localStorageService.set('openid', openid);
                localStorageService.set('email', email);
                localStorageService.set('fullname', fullname);

                $window.location.href = storyboardApiBase + '/auth/authorize' +
                    '?grant_type=authorization_code' +
                    '&response_type=code' +
                    '&scope=user' +
                    '&redirect_uri=' + encodeURIComponent(
                    pathHelper.getFullUrlPrefix() +
                        '/api/v1/auth/token_return') +
                    '&client_id=1' +
                    '&state=' + encodeURIComponent(state) +
                    '&openid=' + encodeURIComponent(openid) +
                    '&email=' + encodeURIComponent(email) +
                    '&fullname=' + encodeURIComponent(fullname);
            };

            this.tokenHandler = function() {
                var code = $location.search().code;

                function redirectToAccessToken() {
                    var state = $location.search().state;
                    var openid = localStorageService.get('openid');
                    var localState = localStorageService.get('state');

                    if (state !== localState) {
                        // Something is going wrong
                        // Todo: handle that
                        return;
                    }

                    $window.location.href = storyboardApiBase + '/auth/token' +
                        '?grant_type=authorization_code' +
                        '&code=' + encodeURIComponent(code) +
                        '&client_id=1' +
                        '&openid=' + encodeURIComponent(openid);
                }

                function processAccessToken() {
                    var accessToken = $location.search().access_token;
                    var expiresIn = $location.search().expires_in;
                    var refreshToken = $location.search().refresh_token;

                    localStorageService.set('access_token', accessToken);
                    var expiresInInt = parseInt(expiresIn);
                    localStorageService.set('expires_in', expiresInInt);
                    localStorageService.set('expires_at',
                        new Date(new Date().getTime() + expiresInInt * 1000));
                    localStorageService.set('refresh_token', refreshToken);
                }

                if (code) {
                    // Let's get an access_token
                    redirectToAccessToken();
                } else {
                    // It's a response with an access_token and everything else
                    processAccessToken();
                    this.updateRootScope();

                    $location.path('/').search('').hash('').replace();
                }

            };

            this.updateRootScope = function() {
                var fullname = localStorageService.get('fullname');

                if (fullname) {
                    $rootScope.isLoggedIn = true;
                    $rootScope.currentUser = {};
                    $rootScope.currentUser.firstName = fullname.split()[0];
                    $rootScope.currentUser.lastName = fullname.split()[1];
                } else {
                    $rootScope.isLoggedIn = false;
                    localStorageService.clearAll();
                }
            };

            this.logoutHandler = function() {
                localStorageService.clearAll();
                this.updateRootScope();

                $location.path('/').search('').hash('').replace();
            };

        }
);