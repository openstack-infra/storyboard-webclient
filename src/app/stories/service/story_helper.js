/*
 * Copyright (c) 2019 Codethink Ltd.
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

angular.module('sb.story').factory('StoryHelper',
    function(Story, Team) {
        'use strict';

        function updateSecurity(forcePrivate, update, story, tasks) {
            var privacyLocked;
            if (story.security) {
                if (forcePrivate) {
                    story.private = true;
                    privacyLocked = true;
                }

                // Add security teams for affected projects
                var projects = tasks.map(function(task) {
                    return task.project_id;
                }).filter(function(value) {
                    // Remove any unset project_ids we've somehow got.
                    // Otherwise, the browse will return all teams, rather
                    // than only relevant teams.
                    return !isNaN(value);
                });
                angular.forEach(projects, function(project_id) {
                    Team.browse({project_id: project_id}, function(teams) {
                        var teamIds = story.teams.map(function(team) {
                            return team.id;
                        });
                        teams = teams.filter(function(team) {
                            return ((teamIds.indexOf(team.id) === -1)
                                    && team.security);
                        });
                        angular.forEach(teams, function(team) {
                            story.teams.push(team);
                            if (update) {
                                Story.TeamsController.create({
                                    story_id: story.id,
                                    team_id: team.id
                                });
                            }
                        });
                    });
                });
            } else {
                if (forcePrivate) {
                    privacyLocked = false;
                }
            }
            return privacyLocked;
        }

        return {
            updateSecurity: updateSecurity
        };
    }
);
