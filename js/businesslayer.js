appSettings = {
    Version: "1.0.0.0 beta",
    Company: "TPS Systems",
    //EndPoint: "http://inflightdev.devstuff.us/datainterchange.asmx"
    EndPoint: "http://inflight.azurewebsites.net/DataInterchange.asmx"
    //EndPoint: "http://localhost:54527/DataInterchange.asmx"
};

/*** NOTE: BusinessLayer is defined as a Global object. ***/
var bl = (function () {
    this.Name = "BusinessLayer";

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME: authenticate()
    // DEFINE:  Returns the Date the device as last synched to the back office.
    //////////////////////////////////////////////////////////////////////////////////////////////////
    function authenticate (airlineCode, employeeID) {
        try{
            var endPoint = appSettings.EndPoint;
            $.ajax({
                crossDomain: true,
                type: 'POST',
                url: appSettings.EndPoint + '/Authenticate',
                contentType: 'application/json; charset=utf-8',
                data: '{"AirlineCode":"' + airlineCode + '","EmployeeID":' + employeeID + '}',
                dataType: 'json',
                success: function (results) {
                    console.log("Authentication Successful.");
                    var nData = jQuery.parseJSON(results.d);
                    onAuthenticated(nData);
                },
                error: function (results) {
                    console.log("Authentication Failed.");
                    ex.log(new Error(results.responseText), this.Name + ".authenticate()");
                    onAuthenticated({ Authenticated: false, Message: "Error: Communication Error." });
                }
            });
        }
        catch (err) {
            ex.log(err, this.Name + ".authenticate (airlineCode:" + airlineCode + ",employeeID:" + employeeID + ")");
            localStorage.IsAuthenticated = false;
            onAuthenticated({ Authenticated: false, Message: err.message });
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME:    onAuthenticated()
    // SCOPE:   Private
    // DEFINE:  Called after authenticate() has been executed.
    //////////////////////////////////////////////////////////////////////////////////////////////////
    function onAuthenticated(authentication) {
        try {
            if (authentication.Authenticated) {
                localStorage.IsAuthenticated = true;
                localStorage.AirlineID = authentication.AirlineID;
                localStorage.AirlineName = authentication.AirlineName;
                localStorage.UID = authentication.UID;
                localStorage.FirstName = authentication.FirstName;
                localStorage.LastName = authentication.LastName;
                localStorage.Title = authentication.Title;
            }
            else {
                localStorage.IsAuthenticated = false;
                localStorage.AirlineID = null;
                localStorage.AirlineName = null;
                localStorage.UID = null;
                localStorage.FirstName = null;
                localStorage.LastName = null;
                localStorage.Title = null;
            }
            localStorage.AuthenticationMessage = authentication.Message;
        }
        catch (err) {
            ex.log(err, this.Name + ".onAuthenticated(authentication:" + authentication + ")");
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME:    onSynchronized()
    // SCOPE:   Private
    // DEFINE:  Called after Synchronize() has been executed.
    //////////////////////////////////////////////////////////////////////////////////////////////////
    function onSynchronized(results) {
        try {
            localStorage.LastSyncDate = results.SyncDate;
            localStorage.LastSyncStatus = results.Successful;
            localStorage.LastSyncMessage = results.Message;

            if (results.Successful) {
                // STEP 1: Update Global LocalStorage Variables.
                localStorage.LastSyncPairingCount = results.Pairings.length;
                localStorage.LastSyncIncluded = '["Pairings"]';
                localStorage.AirlineID = results.AirlineID;
                localStorage.AirlineName = results.AirlineName;
                localStorage.UID = results.UID;
                localStorage.FirstName = results.FirstName;
                localStorage.LastName = results.LastName;
                localStorage.Title = results.Title;
                
                // STEP 2: Refresh the LocalDatabase.
                da.databaseRefresh(results);
            }
            else {
                localStorage.LastSyncPairingCount = null;
                localStorage.LastSyncIncluded = "[]";
            }
        }
        catch (err) {
            ex.log(err, this.Name + ".onSynchronized(Results:" + results + ")");
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME:    isAuthenticated
    // DEFINE:  Indicates if a user has been authenticated or not.
    //////////////////////////////////////////////////////////////////////////////////////////////////
    function isAuthenticated () {
        var retVal = localStorage.IsAuthenticated;
        if (retVal === "true") {
            return true;
        }
        else {
            return false;
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME:    lastSyncDate
    // DEFINE:  Returns the Date the device as last synched to the back office.
    //////////////////////////////////////////////////////////////////////////////////////////////////
    function lastSyncDate () {
         try {
             var retVal = new Date(localStorage.LastSyncDate);
             return retVal;
         }
         catch (err) {
             ex.log(err, this.Name + ".lastSyncDate");
             return null;
         }
     }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME:    lastSyncIncluded
    // DEFINE:  Returns an array of the Modules that were included in the last sync.
    //////////////////////////////////////////////////////////////////////////////////////////////////
    function lastSyncIncluded () {
         try {
             var retVal = jQuery.parseJSON(localStorage.LastSyncIncluded);
             return retVal;
         }
         catch (err) {
             ex.log(err, this.Name + ".lastSyncIncluded");
             return null;
         }
     }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME: lastSyncMessage
    // DEFINE:  Returns the last Synchronization Message received from the DataInterchange Web API.
    //////////////////////////////////////////////////////////////////////////////////////////////////
     function lastSyncMessage () {
         try {
             return localStorage.LastSyncMessage;
         }
         catch (err) {
             ex.log(err, this.Name + ".lastSyncMessage");
             return null;
         }
     }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME:    lastSyncPairingCount
    // DEFINE:  Returns the Number of Pairing records that were included in the last Sync.
    //////////////////////////////////////////////////////////////////////////////////////////////////
     function lastSyncPairingCount () {
         try {
             return localStorage.LastSyncPairingCount * 1;
         }
         catch (err) {
             ex.log(err, this.Name + ".lastSyncPairingCount");
             return null;
         }
     }
    
    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME:    lastSyncStatus
    // DEFINE:  Returns the Date the device as last synched to the back office.
    //////////////////////////////////////////////////////////////////////////////////////////////////
     function lastSyncStatus () {
         try {
             var retVal = (localStorage.LastSyncStatus === "true");
             return retVal;
         }
         catch (err) {
             ex.log(err, this.Name + ".lastSyncStatus");
             return false;
         }
     }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME: signOut()
    // DEFINE:  Sets the (localStorage.IsAuthenticated = false) & clears out the User's info.
    //////////////////////////////////////////////////////////////////////////////////////////////////
     function signOut () {
        try {
            localStorage.IsAuthenticated = false;
            localStorage.AirlineID = null;
            localStorage.UID = null;
            localStorage.FirstName = null;
            localStorage.LastName = null;
            localStorage.AuthenticationMessage = false;
        }
        catch (err) {
            ex.log(err, this.Name + ".signOut()");
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME:    synchronize()
    // DEFINE:  Synchronize this device with the back office.
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     function synchronize() {
        try {
            var endPoint = appSettings.EndPoint;
            $.ajax({
                type: 'POST',
                url: appSettings.EndPoint + '/Synchronize',
                contentType: 'application/json; charset=utf-8',
                data: '{UID:' + localStorage.UID + '}',
                dataType: 'json',
                success: function (results) {
                    var nData = jQuery.parseJSON(results.d);
                    onSynchronized(nData);
                    console.log("Synchronize Successful.");
                },
                error: function (results) {                    
                    console.log("Synchronize Failed.");
                    ex.log(new Error(results.responseText), this.Name + ".synchronize()");
                    onSynchronized({ Successful: false, SyncDate: new Date(), Message: "Error " + results.status + ": Communication Error."});
                }
            });

            // Update LastSyncDate
            localStorage.LastSyncDate = new Date();
            return true;
        }
        catch (err) {
            ex.log(err, this.Name + ".synchronize()");
            return false;
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME:    userName()
    // DEFINE:  Returns the full name of the current user.
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     function userName() {
         try{
             var retVal = localStorage.FirstName + ' ' + localStorage.LastName;
             return retVal;
         }
         catch (err) {
             ex.log(err, this.Name + ".userName()");
             return "Unknown";
         }
     }

    /*** Returns the Exposed Properties & Methods ***/
     return {
         authenticate : authenticate,
         isAuthenticated : isAuthenticated,
         lastSyncDate : lastSyncDate,
         lastSyncIncluded : lastSyncIncluded,
         lastSyncMessage : lastSyncMessage,
         lastSyncPairingCount : lastSyncPairingCount,
         lastSyncStatus : lastSyncStatus,
         signOut : signOut,
         synchronize : synchronize,
         userName : userName
     };
}());

// ===================================================================================================
//  NAME:   isNumeric()
//  DEFINE: Returns a Boolean value indicating weather an expresses can be evaluated as a number.
// ===================================================================================================
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// ===================================================================================================
//  NAME:   formatCurrency()
//  DEFINE: 
// ===================================================================================================
function formatCurrency(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
}

function integerFormat(nStr) {
    nStr += ''; x = nStr.split('.');
    x1 = x[0];
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1;
}

// ===================================================================================================
//  NAME: NumberFormat()
//  DEFINE: string function.
// ===================================================================================================
function numberFormat(nStr) {
    nStr += ''; x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

// ===================================================================================================
//  NAME: Left()
//  DEFINE: string function.
// ===================================================================================================
function left(str, n) {
    if (n <= 0)
        return "";
    else if (n > String(str).length)
        return str;
    else
        return String(str).substring(0, n);
}

// ===================================================================================================
//  NAME: Right()
//  DEFINE: String function.
// ===================================================================================================
function right(str, n) {
    if (n <= 0)
        return "";
    else if (n > String(str).length)
        return str;
    else {
        var iLen = String(str).length;
        return String(str).substring(iLen, iLen - n);
    }
}