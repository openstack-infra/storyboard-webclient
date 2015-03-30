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
 * Project group detail controller, for general user use of project groups.
 * From a feature standpoint this really just means viewing the group, member
 * projects, and any stories that belong under this project group.
 */
angular.module('sb.project_group').controller('ProjectGroupDetailController',
    function ($scope, projectGroup, projects, Story) {
        'use strict';

        /**
         * The project group we're viewing right now.
         *
         * @type ProjectGroup
         */
        $scope.projectGroup = projectGroup;

        /**
         * The list of projects in this group
         *
         * @type [Project]
         */
        $scope.projects = projects;

        /**
         * The list of stories in this project group
         *
         * @type [Story]
         */
        $scope.stories = [];

        /**
         * Filter the stories.
         */
        $scope.showActive = true;
        $scope.showMerged = false;
        $scope.showInvalid = false;

        /**
         * Reload the stories in this view based on user selected filters.
         */
        $scope.filterStories = function () {
            var status = [];
            if ($scope.showActive) {
                status.push('active');
            }
            if ($scope.showMerged) {
                status.push('merged');
            }
            if ($scope.showInvalid) {
                status.push('invalid');
            }

            // If we're asking for nothing, just return a [];
            if (status.length === 0) {
                $scope.stories = [];
                return;
            }

            $scope.stories = Story.query({
                project_group_id: projectGroup.id,
                sort_field: 'id',
                sort_dir: 'desc',
                status: status
            });
        };

        $scope.filterStories();
    });
