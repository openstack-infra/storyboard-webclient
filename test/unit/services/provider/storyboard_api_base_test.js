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
 * This test suite verifies that our API base URI is detected and deferred
 * as expected.
 */
describe('storyboardApiBase', function () {
    'use strict';

    it('should default to /v1', function () {
        module('sb.services');

        inject(function (storyboardApiBase) {
            expect(storyboardApiBase).toEqual('/v1');
        });
    });

    it('should detect a value in window.ENV', function () {
        window.ENV = {
            storyboardApiBase: 'https://localhost:8080/v1'
        };

        module('sb.services');

        inject(function (storyboardApiBase) {
            expect(storyboardApiBase).toEqual('https://localhost:8080/v1');
        });

        delete window.ENV;
    });

    it('should defer to properties injected at the parent level.', function () {
        angular.module('testModule', ['sb.services'])
            .config(function ($provide) {
                $provide.constant('storyboardApiBase', 'spam.eggs.com');
            });

        module('testModule');

        inject(function (storyboardApiBase) {
            expect(storyboardApiBase).toEqual('spam.eggs.com');
        });
    });

});
