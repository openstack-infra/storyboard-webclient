angular.module('sb.util').
    directive('contenteditable', function () {
        'use strict';

        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {
                // Write data to the model
                function read() {
                    var e = element[0];
                    var html = e.innerText || '';
                    ngModel.$setViewValue(html);

                    // If you copy/paste between contenteditable fields, it
                    // drags the HTML tags along. Unfortunately not all
                    // browsers will let us modify the clipboard in flight,
                    // so we have to selectively rewrite it here. This also
                    // strips all HTML tags out - which is good for sanitizing,
                    // but we'll want to add a rich text editor.
                    if (e.innerHTML !== e.innerText) {
                        e.innerHTML = e.innerText;
                    }
                }

                if (!ngModel) {
                    return; // do nothing if no ng-model
                }

                // Specify how UI should be updated
                ngModel.$render = function () {
                    element.html(ngModel.$viewValue || '');
                };

                // Listen for change events to enable binding
                element.on('blur keyup change', function () {
                    scope.$apply(read);
                });
                read(); // initialize

            }
        };
    });