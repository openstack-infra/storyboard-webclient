angular.module('sb.services').factory('SubscriptionList',
    function (Session, Subscription, CurrentUser) {
        'use strict';

        //GET list of subscriptions for resource specified
        return {
            subsList: function (resource) {
                if (!Session.isLoggedIn()) {
                    return null;
                }
                else {
                    return Subscription.browse({
                        user_id: CurrentUser.id,
                        target_type: resource
                    });
                }
            }
        };
    });
