﻿$(function () {
    document.addEventListener("deviceready", Page.initialize(), false);
});

var Page = (function () {

    function initialize() {
        // Show Airline Name
        $("div[data-role=header] h1 span").html(" for " + localStorage.AirlineName);

        $.mobile.loading("show");
        loadPairings()
        $.mobile.loading("hide");
    }

    function loadPairings() {
        try {
            // STEP 1: Query the Database for all of the Pairings
            pairings = da.pairings();

            // STEP 2: Create a HTML table of all of the Pairings
            $("#PairingsTemplate").tmpl(pairings[1]).appendTo("#PairingsContainer");

            // STEP 3: Apply JQM styling to the HTML <table>.
            $("#tblPairings").table();
        }
        catch (err) {
            ex.log(err, "crewpairing.initialize.loadPairings()");
        }
    }

    return { initialize: initialize };
}());
