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
 * This controller is responsible for getting an authorization code
 * having a state and an openid.
 *
 * @author Nikita Konovalov
 */

angular.module('sb.auth').controller('AuthCodeController',
    function ($scope, $location, $window, storyboardApiBase, pathHelper) {
        'use strict';

        var state = localStorage.getItem('state');

        if (state === null) {
            // This should not happens is the flow goes as designed
            // Todo: handle this somehow
            return;
        }

        var openid = $location.search().openid;
        var email = $location.search().email;
        var fullname = $location.search().fullname;
        
        localStorage.setItem('openid', openid);
        localStorage.setItem('email', email);
        localStorage.setItem('fullname', fullname);

        $window.location.href = storyboardApiBase + '/auth/authorize' +
            '?grant_type=authorization_code' +
            '&response_type=code' +
            '&scope=user' +
            '&redirect_uri=' + encodeURIComponent(
                pathHelper.get_full_url_prefix() +
                    '/api/v1/auth/token_return') +
            '&client_id=1' +
            '&state=' + encodeURIComponent(state) +
            '&openid=' + encodeURIComponent(openid) +
            '&email=' + encodeURIComponent(email) +
            '&fullname=' + encodeURIComponent(fullname);
    });