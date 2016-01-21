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
 * Utility injector, injects the query parameters from the NON-hashbang URL as
 * $searchParams.
 */
angular.module('sb.util').provider('$searchParams',
    function ($windowProvider) {
        'use strict';

        var pageParams = {};

        this.extractSearchParameters = function () {
            var window = $windowProvider.$get();
            var search = window.location.search;
            if (search.charAt(0) === '?') {
                search = search.substr(1);
            }
            var queryComponents = search.split('&');
            for (var i = 0; i < queryComponents.length; i++) {
                var parts = queryComponents[i].split('=');
                var key = decodeURIComponent(parts[0]) || null;
                var value = decodeURIComponent(parts[1]) || null;

                if (!!key && !!value) {
                    pageParams[key] = value;
                }
            }
        };
        this.$get = function () {
            return angular.copy(pageParams);
        };
    })
    .config(function ($searchParamsProvider, $windowProvider) {
        'use strict';

        // Make sure we save the search parameters so they can be used later.
        $searchParamsProvider.extractSearchParameters();

        // Overwrite the URL's current state.
        var window = $windowProvider.$get();
        var url = new URL(window.location.toString());
        url.search = '';
        if (window.location.toString() !== url.toString()) {
            window.history.replaceState({},
                window.document.title,
                url.toString());
        }
    });
