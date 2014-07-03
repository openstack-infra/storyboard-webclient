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
 * Session Modal service, which provides us with some session/auth related
 * modals.
 */
angular.module('sb.auth')
    .factory('SessionModalService', function ($modal) {
        'use strict';

        return {

            /**
             * Show a modal that kindly tells our user that they should
             * log in first.
             */
            showLoginRequiredModal: function () {
                var modalInstance = $modal.open(
                    {
                        templateUrl: 'app/auth/template' +
                            '/modal/login_required.html',
                        controller: 'LoginRequiredModalController'
                    }
                );

                // Return the modal's promise.
                return modalInstance.result;
            }
        };
    }
);
