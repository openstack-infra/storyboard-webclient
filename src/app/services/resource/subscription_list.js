angular.module('sb.services').factory('SubscriptionList',
    function (Session, Subscription) {
        'use strict';

        //GET list of subscriptions for resource specified
        return {
            subsList: function (resource, user) {
                if (!Session.isLoggedIn()) {
                    return null;
                }
                else {
                    return Subscription.browse({
                        user_id: user.id,
                        target_type: resource
                    });
                }
            }
        };
    });
