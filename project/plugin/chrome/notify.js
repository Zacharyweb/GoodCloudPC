/**
 * Created by Spring on 2017/5/18.
 */
var chrome = {
    notify: function (title, msg, onclick) {
        var options = {
            body: msg
        };
        var Notification = window.Notification || window.mozNotification || window.webkitNotification;
        if (Notification && Notification.permission === "granted") {
            var instance = new Notification(title, options);
            instance.onclick = function () {
                // Something to do
                onclick();
            };
            instance.onerror = function () {
                // Something to do
            };
            instance.onshow = function () {
                // Something to do
//                          setTimeout(instance.close, 3000);
                setTimeout(function () {
                    instance.close();
                }, 10000)
                console.log(instance.body)
            };
            instance.onclose = function () {
                // Something to do
            };
            console.log(instance)
        } else if (Notification && Notification.permission !== "denied") {
            Notification.requestPermission(function (status) {
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }
                // If the user said okay
                if (status === "granted") {
                    var instance = new Notification(title, options);
                    instance.onclick = function () {
                        onclick();
                    };
                    instance.onerror = function () {
                        // Something to do
                    };
                    instance.onshow = function () {
                        // Something to do
                        setTimeout(instance.close, 10000);
                    };
                    instance.onclose = function () {
                        // Something to do
                    };
                } else {
                    return false
                }
            });
        } else {
            return false;
        }
    }
}
