$(function () {
    document.addEventListener("deviceready", Page.onDeviceReady(), false);
});

var Page = (function () {

    function onDeviceReady() {
        initialize();
    }

    function initialize() {
        console.log("synchronize.initialize()");
        // Show Airline Name
        $("div[data-role=header] h1 span").html(" for " + localStorage.AirlineName);

        try {
            // Add an AjaxComplete() event so we know when Authentication has finished.
            $(document).ajaxComplete(function () {
                lastSync();
                $("#SyncMessage").html(bl.lastSyncMessage());
                $.mobile.loading("hide");
            });

            // OnClick - Sync the Web Service API.
            $("#btnSync").click(function (e) {
                $.mobile.loading("show");
                bl.synchronize();
            });

            lastSync();
        }
        catch (err) {
            ex.log(err, "synchronize.initialize()");
        }
    }

    function lastSync() {
        console.log("synchronize.lastSync()");
        try {
            $("#LastSyncDate").html(dateFormat(bl.lastSyncDate(), "mmmm d, yyyy h:mm tt Z"));

            // RULE: If lastSyncIncluded is empty then return "None".
            var lastSyncIncluded = bl.lastSyncIncluded().join(", "); // Create a Comma delimited list.
            if (lastSyncIncluded.length === 0) {
                lastSyncIncluded = "None";
            }
            $("#LastSyncIncluded").html(lastSyncIncluded);

            // RULE: If lastSyncPairingCount IsNot Numeric then return 0.
            var lastSyncPairingCount  = bl.lastSyncPairingCount();
            if (!isNumeric(lastSyncPairingCount)) {
                lastSyncPairingCount = 0;
            }
            $("#LastSyncPairingCount").html(lastSyncPairingCount + " Records");

            if (bl.lastSyncStatus) {
                $("#LastSyncStatus").html("Successful");
                $("#LastSyncStatus").css("color", "green");
                $("#SyncMessage").css("color", "green");
            }
            else {
                $("#LastSyncStatus").html("Failed");
                $("#LastSyncStatus").css("color", "red");
                $("#SyncMessage").css("color", "red");
            }
        }
        catch (err) {
            ex.log(err, "synchronize.lasySync()");
        }
    }

    return { onDeviceReady: onDeviceReady };
}());