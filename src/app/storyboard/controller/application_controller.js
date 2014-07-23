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
 * Application controller, which keeps track of our active state chain and
 * sets global scope variable accordingly.
 */
angular.module('storyboard').controller('ApplicationController',
    function ($scope, $state, $rootScope) {
        'use strict';

        /**
         * This method traverses the current active state tree to see if the
         * current state, or any of its parents, have a submenu declared.
         *
         * @param state
         */
        function hasSubmenu(state) {
            for (var stateName in state.views) {
                if (!!stateName.match(/^submenu@/)) {
                    return true;
                }
            }

            if (!!state.parent) {
                return hasSubmenu(state.parent);
            } else {
                return false;
            }
        }

        /**
         * Listen to changes in the state machine to trigger our submenu
         * scan.
         */
        $rootScope.$on('$stateChangeSuccess',
            function () {
                $scope.hasSubmenu = hasSubmenu($state.$current);
            });

        // Set a sane default.
        $scope.hasSubmenu = false;

    });
