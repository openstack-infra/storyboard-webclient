/*
 * Copyright (c) 2016 Codethink Limited.
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

/**
 * Directive which displays a date/time picker.
 */
angular.module('sb.services')
    .directive('calendar', function(moment) {
        'use strict';

        return {
            restrict: 'E',
            templateUrl: 'app/services/template/calendar.html',
            scope: {
                selectedDate: '='
            },
            link: function(scope) {
                function buildWeek(date) {
                    var days = [];
                    for (var i = 0; i < 7; i++) {
                        days.push({
                            name: date.format('dd').substring(0, 1),
                            number: date.date(),
                            isToday: date.isSame(new Date(), 'day'),
                            isCurrentMonth:
                                date.month() === scope.month.month(),
                            isSelected: date.isSame(scope.selectedDate, 'day'),
                            date: date
                        });
                        date = date.clone();
                        date.add(1, 'd');
                    }
                    return days;
                }

                function buildMonth(start) {
                    scope.weeks = [];
                    var date = start.clone();
                    var monthIndex = date.month();
                    var done = false;
                    var count = 0;

                    date.date(1).isoWeekday(1);
                    while (!done) {
                        scope.weeks.push({days: buildWeek(date.clone())});
                        date.add(1, 'w');
                        monthIndex = date.month();
                        done = count++ > 2 && monthIndex !== start.month();
                    }
                }

                scope.select = function(day) {
                    scope.selectedDate = day.date;
                    if (scope.selectedDate.isBefore(scope.month, 'month')) {
                        scope.previous();
                    } else if (
                        scope.selectedDate.isAfter(scope.month, 'month')) {
                        scope.next();
                    }
                    buildMonth(scope.selectedDate.clone());
                };

                scope.previous = function() {
                    var start = scope.month.clone();
                    start.subtract(1, 'month');
                    scope.month.subtract(1, 'month');
                    buildMonth(start);
                };

                scope.next = function() {
                    var start = scope.month.clone();
                    start.add(1, 'month');
                    scope.month.add(1, 'month');
                    buildMonth(start);
                };

                scope.incrementTime = function(unit) {
                    scope.selectedDate.add(1, unit);
                    if (!scope.selectedDate.isSame(scope.month, 'month')) {
                        scope.next();
                    }
                    buildMonth(scope.selectedDate.clone());
                };

                scope.decrementTime = function(unit) {
                    scope.selectedDate.subtract(1, unit);
                    if (!scope.selectedDate.isSame(scope.month, 'month')) {
                        scope.previous();
                    }
                    buildMonth(scope.selectedDate.clone());
                };

                scope.toggleEdit = function(unit) {
                    if (unit === 'hour') {
                        if (scope.editHour) {
                            scope.selectedDate.hour(scope.editedHour);
                        } else {
                            scope.editedHour = scope.selectedDate.hour();
                        }
                        scope.editHour = !scope.editHour;
                    } else if (unit === 'minute') {
                        if (scope.editMinute) {
                            scope.selectedDate.minute(scope.editedMinute);
                        } else {
                            scope.editedMinute = scope.selectedDate.minute();
                        }
                        scope.editMinute = !scope.editMinute;
                    }
                };

                scope.selectedDate = scope.selectedDate || moment();
                scope.month = scope.selectedDate.clone();

                buildMonth(scope.selectedDate.clone());
            }
        };
    });
