$(function () {
    document.addEventListener("deviceready", Page.onDeviceReady(), false);
});

var Page = (function () {

    function onDeviceReady() {
        initialize();
    }

    function initialize() {
        // RULE: Redirect the user to the Login.html page if they are not authenticated.
        if (!bl.isAuthenticated()) {
            window.location = "login.html";
        }

        // Show Airline Name
        $("div[data-role=header] h1 span").html(" for " + localStorage.AirlineName);
    }

    return { onDeviceReady: onDeviceReady };
}());