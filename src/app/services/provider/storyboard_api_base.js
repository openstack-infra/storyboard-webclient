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
 * This provider attempts to discover the API URI base for storyboard, by
 * checking various expected configuration parameters.
 *
 * @author Michael Krotscheck
 */
angular.module('sb.services')
    .config(function ($provide, $injector) {
        'use strict';

        var propertyName = 'storyboardApiBase';

        // First to see whether something's already been injected.
        if ($injector.has(propertyName)) {
            // We've already got one, exit.
            return;
        }

        // Do we have a global ENV property with something we can use?
        if (window.hasOwnProperty('ENV')) {
            var ENV = window.ENV;
            if (ENV !== null && ENV.hasOwnProperty(propertyName)) {
                $provide.constant(propertyName, ENV[propertyName]);
                return;
            }
        }

        // If there is a <base> tag, then we can use that.
        if ($('base').length > 0) {
            $provide.constant(propertyName, '');
            return;
        }

        // Neither of those work, so default to something sane on the current
        // domain
        $provide.constant(propertyName, '/v1');
    });
