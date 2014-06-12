/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * The StoryBoard search module, providing both generic and advanced
 * discovery mechanisms.
 */
angular.module('sb.search',
    ['ui.router', 'sb.services', 'sb.util', 'sb.auth'])
    .config(function ($stateProvider) {
        'use strict';

        // Set our page routes.
        $stateProvider
            .state('search', {
                url: '/search?q',
                templateUrl: 'app/templates/search/index.html'
            });
    });
