/*
 * Copyright (c) 2015 Codethink Ltd.
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
 * Subscriptions controller. Provides a view of all subscribed objects.
 */
angular.module('sb.dashboard').controller('DashboardSubscriptionsController',
    function ($scope, Story, Project, ProjectGroup, SubscriptionList,
              Worklist, currentUser) {
        'use strict';

        $scope.storySubscriptions = SubscriptionList.subsList(
            'story', currentUser);
        $scope.stories = Story.browse({subscriber_id: currentUser.id});

        $scope.projectSubscriptions = SubscriptionList.subsList(
            'project', currentUser);
        $scope.projects = Project.browse({subscriber_id: currentUser.id});

        $scope.projectGroupSubscriptions = SubscriptionList.subsList(
            'project_group', currentUser);
        $scope.projectGroups = ProjectGroup.browse(
            {subscriber_id: currentUser.id});

        $scope.worklistSubscriptions = SubscriptionList.subsList(
            'worklist', currentUser);
        $scope.worklists = Worklist.browse({subscriber_id: currentUser.id});
    });
