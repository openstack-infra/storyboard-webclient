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
 * Unit test for the util framework.
 */
describe('StringUtil', function () {
    'use strict';

    beforeEach(function () {

        // Load the module
        module('sb.util');
    });

    // Make sure the utilities exist.
    it('should exist', function () {
        inject(function (StringUtil) {
            expect(StringUtil).toBeDefined();
        });
    });

    // Test random() method.
    it('should have a random() method', function () {
        inject(function (StringUtil) {
            var len = 10;
            var chars = 'abcde';

            // The method must exist.
            expect(StringUtil.random).toBeDefined();

            // Invoking the method, with no parameters, should work.
            var result = StringUtil.random();
            expect(result).toBeDefined();
            expect(result.length).toEqual(32); // MD5 length
            expect(result).not.toEqual(StringUtil.random());

            // Invoking the method, with a length but no characters,
            // should work
            var result2 = StringUtil.random(len);
            expect(result2).toBeDefined();
            expect(result2.length).toEqual(len);
            expect(result2).not.toEqual(StringUtil.random(len));

            // Invoking the method, with a length and characters, should work.
            var result3 = StringUtil.random(len, chars);
            expect(result3).toBeDefined();
            expect(result3.length).toEqual(len);
            expect(result3).not.toEqual(StringUtil.random(len, chars));
            expect(result3).toOnlyContain(chars);
        });
    });

    // Test randomAlphaNumeric
    it('should have a randomAlphaNumeric() method', function () {
        inject(function (StringUtil) {
            var len = 10;
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
                'abcdefghijklmnopqrstuvwxyz' +
                '0123456789';

            // The method must exist.
            expect(StringUtil.randomAlphaNumeric).toBeDefined();

            // Invoking the method, with no parameters, should work.
            var result = StringUtil.randomAlphaNumeric();
            expect(result).toBeDefined();
            expect(result.length).toEqual(32); // MD5 length
            expect(result).not.toEqual(StringUtil.random());
            expect(result).toOnlyContain(chars);

            // Invoking the method, with a length, should work
            var result2 = StringUtil.random(len);
            expect(result2).toBeDefined();
            expect(result2.length).toEqual(len);
            expect(result2).not.toEqual(StringUtil.random(len));
            expect(result2).toOnlyContain(chars);
        });
    });
});
