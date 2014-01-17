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
 */

angular.module('sb.services')
    .run(function (mock) {
        'use strict';

        var authProviders = [
            {
                'id': 0,
                'type': 'openid',
                'title': 'OpenID',
                'url': 'https://login.launchpad.net/+openid',
                'params': {
                    'openid.ns': 'http://specs.openid.net/auth/2.0',
                    'openid.claimed_id': 'http://specs.openid.net/auth' +
                        '/2.0/identifier_select',
                    'openid.identity': 'http://specs.openid.net/auth' +
                        '/2.0/identifier_select',
//                    'openid.return_to': 'https://review.openstack.org/
// openid?gerrit.mode=SIGN_IN&gerrit.token=%2Fq%2Fstatus%3Aopen%2Cn%2Cz',
//                    'openid.realm': 'https://review.openstack.org/',
                    'openid.assoc_handle': '{HMAC-SHA256}{52c79079}{z+v4vA==}',
                    'openid.mode': 'checkid_setup',
                    'openid.ns.sreg': 'http://openid.net/sreg/1.0',
                    'openid.sreg.required': 'fullname,email',
                    'openid.ns.ext2': 'http://openid.net/srv/ax/1.0',
                    'openid.ext2.mode': 'fetch_request',
                    'openid.ext2.type.FirstName': 'http://schema.openid.net/' +
                        'namePerson/first',
                    'openid.ext2.type.LastName': 'http://schema.openid.net/' +
                        'namePerson/last',
                    'openid.ext2.type.Email': 'http://schema.openid.net/' +
                        'contact/email',
                    'openid.ext2.required': 'FirstName,LastName,Email'
                }
            },
            {
                'id': 1,
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
                'id': 2,
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

        mock.api('/api/v1/auth/provider',
            '/api/v1/auth/provider/:id',
            'id',
            authProviders);

    });