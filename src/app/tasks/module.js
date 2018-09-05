/*
 * Copyright (c) 2018 Adam Coldrick
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
 * A tiny submodule for handling task navigation. Currently just redirects
 * /task/:id to the relevant story.
 */
angular.module('sb.task', ['ui.router'])
    .config(function ($stateProvider) {
        'use strict';

        $stateProvider
            .state('sb.task', {
                url: '/task/{taskId:[0-9]+}',
                resolve: {
                    redirect: function (Task, $stateParams, $q, $state) {
                        Task.get({
                            id: $stateParams.taskId
                        }).$promise.then(function (task) {
                            $state.go('sb.story.detail',
                                      {storyId: task.story_id});
                        });
                    }
                }
            });
    }
);
