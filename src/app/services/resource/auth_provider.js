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
 * This resource exposes authorization providers to our angularjs environment,
 * allowing us to manage & control them. It's also used during the
 * authorization/login process to determine how we're going to allow users to
 * log in to storyboard.
 *
 * @author Michael Krotscheck
 */

angular.module('sb.services').factory('AuthProvider',
    function ($resource, storyboardApiBase, storyboardAuthApiSignature) {
        'use strict';

        var authProviderFactory = $resource();



        var authorizeEndpoint = $resource(
            storyboardApiBase + '/auth/authorize/' +
                '?grant_type=code' +
                '&state=:state',
            {
                state: "qwe"
            },
            storyboardAuthApiSignature);

        var tokenEndpoint = $resource(
            storyboardApiBase + '/auth/token', {},
            storyboardAuthApiSignature);

        authProviderFactory.authorizeEndpoint = authorizeEndpoint;
        authProviderFactory.tokenEndpoint = tokenEndpoint;
        return  authProviderFactory;
    });