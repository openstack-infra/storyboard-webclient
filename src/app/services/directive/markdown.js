/*
 * Copyright (c) 2015 Codethink Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * Service for rendering text as markdown.
 */
angular.module('sb.services')
    .directive('insertMarkdown', function($sanitize, $window) {
        'use strict';

        var md = $window.markdownit({
            html: true,
            highlight: function(code, lang) {
                if (lang && $window.hljs.getLanguage(lang)) {
                    return $window.hljs.highlight(lang, code, true).value;
                }
                return ''; // Don't highlight if no language specified
            }
        });

        return {
            restrict: 'E',
            scope: {
                content: '='
            },
            link: function(scope, elem) {
                scope.$watch('content', function(newVal) {
                    elem.html('<div>' + $sanitize(md.render(newVal)) + '</div>');
                }, true);
            }
        };
    });
