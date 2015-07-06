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
    function ($scope, $stateParams, projectGroup, Story, Project,
              Preference) {
        'use strict';

        var projectPageSize = Preference.get(
            'project_group_detail_projects_page_size') || 0;
        var storyPageSize = Preference.get(
            'project_group_detail_stories_page_size') || 0;

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
        $scope.projects = [];
        $scope.isSearchingProjects = false;

        /**
         * List the projects in this Project Group
         */
        $scope.listProjects = function () {
            $scope.isSearchingProjects = true;
            Project.browse({
                    project_group_id: projectGroup.id,
                    offset: $scope.projectSearchOffset,
                    limit: projectPageSize
                },
                function (result, headers) {
                    // Successful search results, apply the results to the
                    // scope and unset our progress flag.
                    $scope.projectCount =
                        parseInt(headers('X-Total')) || result.length;
                    $scope.projectSearchOffset =
                        parseInt(headers('X-Offset')) || 0;
                    $scope.projectSearchLimit =
                        parseInt(headers('X-Limit')) || 0;
                    $scope.projects = result;
                    $scope.isSearchingProjects = false;
                },
                function (error) {
                    // Error search results, show the error in the UI and
                    // unset our progress flag.
                    $scope.error = error;
                    $scope.isSearchingProjects = false;
                }
            );
        };

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

            Story.browse({
                    project_group_id: projectGroup.id,
                    sort_field: 'id',
                    sort_dir: 'desc',
                    status: status,
                    offset: $scope.storySearchOffset,
                    limit: storyPageSize
                },
                function (result, headers) {
                    // Successful search results, apply the results to the
                    // scope and unset our progress flag.
                    $scope.storyCount =
                        parseInt(headers('X-Total')) || result.length;
                    $scope.storySearchOffset =
                        parseInt(headers('X-Offset')) || 0;
                    $scope.storySearchLimit =
                        parseInt(headers('X-Limit')) || 0;
                    $scope.stories = result;
                    $scope.isSearchingStories = false;
                },
                function (error) {
                    // Error search results, show the error in the UI and
                    // unset our progress flag.
                    $scope.error = error;
                    $scope.isSearchingStories = false;
                }
            );
        };

        /**
         * Next page of the results.
         *
         * @param type The name of the result set to be paged,
         * expects 'stories' or 'projects'.
         */
        $scope.nextPage = function (type) {
            if (type === 'stories') {
                $scope.storySearchOffset += storyPageSize;
            } else if (type === 'projects') {
                $scope.projectSearchOffset += projectPageSize;
            }
            $scope.filterStories();
        };

        /**
         * Previous page of the results.
         *
         * @param type The name of the result set to be paged,
         * expects 'stories' or 'projects'.
         */
        $scope.previousPage = function (type) {
            if (type === 'stories') {
                $scope.storySearchOffset -= storyPageSize;
                if ($scope.storySearchOffset < 0) {
                    $scope.storySearchOffset = 0;
                }
            } else if (type === 'projects') {
                $scope.projectSearchOffset -= projectPageSize;
                if ($scope.projectSearchOffset < 0) {
                    $scope.projectSearchOffset = 0;
                }
            }
            $scope.filterStories();
        };

        /**
         * Update the page size preference and re-search.
         *
         * @param type The name of the result set to change the page
         * size for, expects 'stories' or 'projects'.
         * @param value The value to set the page size preference to.
         */
        $scope.updatePageSize = function (type, value) {
            if (type === 'stories') {
                Preference.set(
                    'project_group_detail_stories_page_size', value).then(
                        function () {
                            storyPageSize = value;
                            $scope.filterStories();
                        }
                    );
            } else if (type === 'projects') {
                Preference.set(
                    'project_group_detail_projects_page_size', value).then(
                        function () {
                            projectPageSize = value;
                            $scope.filterStories();
                        }
                    );
            }
        };


        $scope.listProjects();
        $scope.filterStories();
    });
