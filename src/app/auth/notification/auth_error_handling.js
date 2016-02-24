/*
 * Copyright (c) 2014 Mirantis Inc.
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

angular.module('sb.auth').run(
    function($log, $modal, Notification, Session, Priority) {
        'use strict';

        function handle_403() {
            var modalInstance = $modal.open({
                templateUrl: 'app/auth/template/modal/superuser_required.html',
                controller: function($modalInstance, $scope) {
                    $scope.close = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }
            });
            return modalInstance.result;
        }


        // We're using -1 as the priority, to ensure that this is
        // intercepted before anything else happens.
        Notification.intercept(function (message) {
            if (message.type === 'http') {
                if (message.message === 403) {
                    // Forbidden error. A user should be warned tha he is
                    // doing something wrong.
                    handle_403();
                }

                return false; // Stop processing this notifications.
            }
        }, Priority.BEFORE);

    }
);
