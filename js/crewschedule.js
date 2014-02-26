$(function () {
    document.addEventListener("deviceready", Page.initialize(), false);
});

var Page = (function () {
    var dp;
    var months = [];

    function initialize() {
        // Show Airline Name
        $("div[data-role=header] h1 span").html(" <small>for</small> " + localStorage.AirlineName);

        dayPilotNavigation();
        dayPilotMonth();
    }

    function dayPilotMonth() {
        try {
            // STEP 1: Initialize a DayPilot Month object/class.
            dp = new DayPilot.Month("dp");
            dp.theme = "month_traditional";

            // STEP 2: Query the DB for all of the [PairingDetail] records for this month.
            var pairingDetails = da.paringDetailsByMonth(new Date());            

            // STEP 3a: Iterate through all of the [PairingDetail] records
            for (var i = 0; i < pairingDetails.length; i++) {
                // ToDo: Only return [pairingDetail] records so this check won't be necessary.
                if (pairingDetails[i].RowID != undefined) {
                    var pairingDetail = pairingDetails[i];
                    var startDate = formatJSONDate(pairingDetail.DepartureTime).format("yyyy-mm-dd") + "T" + formatJSONDate(pairingDetail.DepartureTime).format("HH:MM:ss");
                    var endDate = formatJSONDate(pairingDetail.ArrivalTime).format("yyyy-mm-dd") + "T" + formatJSONDate(pairingDetail.ArrivalTime).format("HH:MM:ss");

                    // STEP 3b: Add each [pairingDetail] to the DayPilot calendar.
                    var e = new DayPilot.Event({
                        start: new DayPilot.Date(startDate),
                        end: new DayPilot.Date(endDate),
                        id: DayPilot.guid(),
                        text: "<strong>" + pairingDetail.FlightNumber + "</strong> " + pairingDetail.DepartureAirport + "-" + pairingDetail.ArrivalAirport
                    });
                    dp.events.add(e);
                }
            }

            // Events
            dp.onEventClicked = function (args) {
                alert("clicked: " + args.e.id());
            };

            // NOTE: Initialization must be the last Step.
            dp.init();
        }
        catch (err) {
            ex.log(err, "crewschedule.initialize.dayPilotMonth()");
        }
    }

    function dayPilotNavigation() {
        try {
            // Initialize DayPilot Navigation
            var nav = new DayPilot.Navigator("nav");
            nav.showMonths = 2;
            nav.selectMode = "day";
            nav.onTimeRangeSelected = function (args) {
                dp.startDate = args.start;
                dp.update();
            };
            nav.init();
        }
        catch (err) {
            ex.log(err, "crewschedule.initialize.dayPilotNavigation()");
        }
    }

    return { initialize: initialize };
}());

