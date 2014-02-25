$(function () {
    document.addEventListener("deviceready", Page.onDeviceReady(), false);
});

var Page = (function () {
    function onDeviceReady() {
        initialize();
    }

    function initialize() {
        // Show Airline Name
        $("div[data-role=header] h1 span").html(" <small>for</small> " + localStorage.AirlineName);

        dayPilotNavigation();
        dayPilotMonth();
    }

    function dayPilotMonth() {
        try {
            // STEP 1: Initialize a DayPilot Month object/class.
            var dp = new DayPilot.Month("dp");
            dp.theme = "month_traditional";

            // STEP 2: Set the View to the current date.
            //dp.startDate = "2013-03-25";
            dp.startDate = new Date();

            // load
            var pairingDetail = da.paringDetailsByMonth(new Date());
            for (var i = 0; i < 10; i++) {
                var duration = Math.floor(Math.random() * 1.2);
                var start = Math.floor(Math.random() * 6) - 3; // -3 to 3

                var e = new DayPilot.Event({
                    start: new DayPilot.Date("2013-03-04T00:00:00").addDays(start),
                    end: new DayPilot.Date("2013-03-04T12:00:00").addDays(start).addDays(duration),
                    id: DayPilot.guid(),
                    text: "Event " + i
                });
                dp.events.add(e);
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

    return { onDeviceReady: onDeviceReady };
}());

