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

    var notification, $httpBackend, $resource, MockResource;

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
            notification = $injector.get('Notification');
            $httpBackend = $injector.get('$httpBackend');
            $resource = $injector.get('$resource');
            MockResource = $resource('/foo/:id', {id: '@id'});
        });

    });


    it('should dispatch events to the Notification framework',
        function () {
            // Start listening to the broadcast method.
            spyOn(notification, 'send').and.callFake(
                function(type, code, severity) {
                    expect(type).toEqual('http');
                    expect(code).toEqual(553);
                    expect(severity).toEqual('error');
                }
            );

            // Prepare the HTTP Backend
            $httpBackend.when('GET', '/foo/99')
                .respond(553, JSON.stringify(errorResponse));

            MockResource.get({'id': 99});
            $httpBackend.flush();
        });
});
