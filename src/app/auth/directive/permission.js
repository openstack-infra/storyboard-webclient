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
 * Permission provider, which hides particular controls based on whether the
 * passed permission flag has been set.
 */
angular.module('sb.util').directive('permission',
    function ($log, PermissionManager) {
        'use strict';

        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                // Start by hiding it.
                element.hide();

                var permName = attrs.permission;
                var permValue = attrs.permissionValue || true;

                PermissionManager.listen($scope, permName,
                    function (actualValue) {

                        if (!!actualValue &&
                            actualValue.toString() === permValue.toString()) {
                            element.show();
                        } else {
                            element.hide();
                        }
                    }
                );
            }
        };
    });
