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
 * This test suite verifies that our default API request signature is
 * sane.
 */
describe('storyboardApiSignature', function () {
    'use strict';

    beforeEach(module('sb.services'));

    it('should exist', function () {
        inject(function (storyboardApiSignature) {
            expect(storyboardApiSignature).toBeTruthy();
        });
    });

    it('should declare CRUD methods', function () {
        inject(function (storyboardApiSignature) {
            expect(storyboardApiSignature.create).toBeTruthy();
            expect(storyboardApiSignature.read).toBeTruthy();
            expect(storyboardApiSignature.update).toBeTruthy();
            expect(storyboardApiSignature.delete).toBeTruthy();
        });
    });

    it('should declare a query method', function () {
        inject(function (storyboardApiSignature) {
            expect(storyboardApiSignature.query).toBeTruthy();
        });
    });

    it('should use POST to create', function () {
        inject(function (storyboardApiSignature) {
            expect(storyboardApiSignature.create).toBeTruthy();
            expect(storyboardApiSignature.create.method).toEqual('POST');
        });
    });
    it('should use GET to read', function () {
        inject(function (storyboardApiSignature) {
            expect(storyboardApiSignature.read).toBeTruthy();
            expect(storyboardApiSignature.read.method).toEqual('GET');
        });
    });
    it('should use PUT to update', function () {
        inject(function (storyboardApiSignature) {
            expect(storyboardApiSignature.update).toBeTruthy();
            expect(storyboardApiSignature.update.method).toEqual('PUT');
        });
    });
    it('should use DELETE to delete', function () {
        inject(function (storyboardApiSignature) {
            expect(storyboardApiSignature.delete).toBeTruthy();
            expect(storyboardApiSignature.delete.method).toEqual('DELETE');
        });
    });
    it('should use GET to query', function () {
        inject(function (storyboardApiSignature) {
            expect(storyboardApiSignature.query).toBeTruthy();
            expect(storyboardApiSignature.query.method).toEqual('GET');
        });
    });

    it('should properly construct a resource', function () {
        inject(function (storyboardApiSignature, $resource) {

            var Resource =  $resource('/path/:id',
                {id: '@id'},
                storyboardApiSignature);
            expect(Resource.query).toBeTruthy();
            expect(Resource.read).toBeTruthy();

            var resourceInstance = new Resource();
            expect(resourceInstance.$create).toBeTruthy();
            expect(resourceInstance.$update).toBeTruthy();
            expect(resourceInstance.$delete).toBeTruthy();
        });
    });
});
