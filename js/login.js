$(function () {
    document.addEventListener("deviceready", Page.initialize(), false);
});

var Page = (function () {
    var IsSynced = false;

    function initialize() {
        try {
            // RULE: EmployeeID is numeric only.
            $("#EmployeeID").numeric();

            // Add an AjaxComplete() event so we know when Authentication has finished.
            $(document).ajaxComplete(function () {
                if (bl.isAuthenticated()) {
                    $("#AirlineCode").prop("disabled", true);
                    $("#EmployeeID").prop("disabled", true);
                    $("#btnLogin").prop("disabled", true);

                    $("#Message").css("color", "green");
                    $("#Message").html("Downloading...");

                    if (IsSynced) {
                        window.location = "index.html";
                    }
                    else {
                        IsSynced = true;
                        bl.synchronize();
                    }
                }
                else {
                    $.mobile.loading("hide");
                    $("#Message").html(localStorage.AuthenticationMessage);
                    $("#Message").css("color", "");
                }
            });

            // OnClick - Authenticate against the Web Service API.
            $("#btnLogin").click(function (e) {
                // RULE: All Input validations must be met.
                var Form = document.getElementById("frmLogin");
                if (Form.checkValidity()) {
                    e.preventDefault();
                    $.mobile.loading("show");

                    // *** Authenticate against the web API ***
                    var airlineCode = $("#AirlineCode").val();
                    var employeeID = $("#EmployeeID").val();
                    authentication = bl.authenticate(airlineCode, employeeID);
                }
            });
        }
        catch (err) {
            ex.log(err, "login.initialize()");
        }
    }

    return { initialize: initialize };
}());