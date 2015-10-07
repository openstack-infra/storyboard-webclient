/*
 * Copyright (c) 2015 Codethink Limited.
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


angular.module('sb.worklist').factory('NewWorklistService',
    function ($modal, $log, Session, SessionModalService) {
        'use strict';

        return {
            showNewWorklistModal: function (userId) {
                if (!Session.isLoggedIn()) {
                    return SessionModalService.showLoginRequiredModal();
                } else {
                    var modalInstance = $modal.open(
                        {
                            templateUrl: 'app/worklists/template/new.html',
                            controller: 'AddWorklistController',
                            resolve: {
                                params: function () {
                                    return {
                                        userId: userId || null
                                    };
                                }
                            }
                        }
                    );

                    // Return the modal's promise.
                    return modalInstance.result;
                }
            }
        };
    }
);
