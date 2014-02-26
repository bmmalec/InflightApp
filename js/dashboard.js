$(function () {
    document.addEventListener("deviceready", Page.initialize(), false);
});

var Page = (function () {

    function initialize() {
        // Show Airline Name
        $("div[data-role=header] h1 span").html(" for " + localStorage.AirlineName);

        try {
            // RULE: Redirect the user to the Login.html page if they are not authenticated.
            if (!bl.isAuthenticated()) {
                window.location = "login.html";
            }

            $("#UserName").html(bl.userName() + "'s ");
        }
        catch (err) {
            ex.log(err, "index.initialize()");
        }
    }

    return { initialize: initialize };
}());