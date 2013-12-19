/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * Mock resource responses for the AuthProvider resource.
 *
 * @author Michael Krotscheck
 */

angular.module('sb.services')
    .run(function ($httpBackend, $injector) {
        'use strict';
        $httpBackend = $injector.get('$httpBackend');

        var authProviders = [
            {
                'id': 1,
                'type': 'openid',
                'title': 'OpenID',
                'url': 'https://www.google.com/prediscovered' +
                    '/redirection/url',
                'params': {
                    'list': 'of',
                    'additional': 'parameters',
                    'required': 'for.this.provider'
                }
            },
            {
                'id': 2,
                'type': 'openid_connect',
                'title': 'OpenID Connect',
                'url': 'https://www.google.com/prediscovered' +
                    '/redirection/url',
                'params': {
                    'list': 'of',
                    'additional': 'parameters',
                    'required': 'for.this.provider'
                }
            },
            {
                'id': 3,
                'type': 'ldap',
                'title': 'LDAP',
                'url': 'https://www.google.com/prediscovered' +
                    '/redirection/url',
                'params': {
                    'list': 'of',
                    'additional': 'parameters',
                    'required': 'for.this.provider'
                }
            }
        ];

        $httpBackend.when('GET', '/api/v1/auth/provider')
            .respond(
            {
                total: 1,
                offset: 0,
                limit: 10,
                results: authProviders
            }
        );

        $httpBackend.when('GET', '/api/v1/auth/provider/1')
            .respond(authProviders[0]);
        $httpBackend.when('GET', '/api/v1/auth/provider/2')
            .respond(authProviders[1]);
        $httpBackend.when('GET', '/api/v1/auth/provider/3')
            .respond(authProviders[2]);
    });