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
 * This test suite ensures that HTTP response codes are successfully captured
 * and broadcast to the system
 */
describe('httpErrorBroadcaster', function () {
    'use strict';

    var $rootScope, $httpBackend, $http, $resource, MockResource,
        storyboardApiBase;

    var errorResponse = {
        error_code: 404,
        error_message: 'This is an error message'
    };

    // Setup
    beforeEach(function () {
        // Load the module under test
        module('sb.services');

        inject(function ($injector) {
            // Capture various providers for later use.
            $rootScope = $injector.get('$rootScope');
            $http = $injector.get('$http');
            $httpBackend = $injector.get('$httpBackend');
            $resource = $injector.get('$resource');
            MockResource = $resource('/foo/:id', {id: '@id'});
            storyboardApiBase = $injector.get('storyboardApiBase');
        });

        // Start listening to the broadcast method.
        spyOn($rootScope, '$broadcast');
    });

    // Teardown
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    it('should capture events on the $rootScope', function () {

        $httpBackend.when('GET', '/foo/99')
            .respond(553, JSON.stringify(errorResponse));

        var complete = false;

        runs(function () {
            MockResource.get({'id': 99},
                function () {
                    complete = true;
                },
                function () {
                    complete = true;
                });

            $httpBackend.flush();
        });

        waitsFor(function () {
            return complete;
        }, 'query to complete', 5000);

        runs(function () {
            expect($rootScope.$broadcast)
                .toHaveBeenCalledWith('http_553', errorResponse);
        });
    });
});
