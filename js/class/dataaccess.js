var da = (function () {
    this.Name = "DataAccess";
    var db;

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME: currencies()
    // DEFINE:  Returns a list of all of the Currencies the airline accepts.
    //////////////////////////////////////////////////////////////////////////////////////////////////
    function currencies() {
        try {
            var retValue = [
                    { CurrencyID: 20, Symbol: "£", Abbreviation: "GBP", Name: "British Pound", Rate: 1.0, Default: true },
                    { CurrencyID: 19, Symbol: "R$", Abbreviation: "BRL", Name: "Brazilian Real", Rate: 4.004, Default: false },
                    { CurrencyID: 50, Symbol: "€", Abbreviation: "EUR", Name: "Euro", Rate: 1.222, Default: false },
                    { CurrencyID: 2, Symbol: "$", Abbreviation: "USD", Name: "U.S. Dollar", Rate: 1.674, Default: false }
            ];
            return retValue;
        }
        catch (err) {
            ex.log(err, this.Name + ".Currencies()");
            return [];
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME: databaseRefresh()
    // DEFINE:  Refreshes the localStorageDB with the JSON results.
    //////////////////////////////////////////////////////////////////////////////////////////////////
    function databaseRefresh(results) {
        try {
            // STEP 1: Create the localStorageDB if it doesn't already exist.
            dbCreate()

            // STEP 2: Save all of the [Pairing] records to the localStorageDB.
            pairings_Save(results.Pairings);

            // STEP 3: Save all of the [PairingDetail] records to the localStorageDB.
            // STEP 3a: Iterate through all of the [Pairing] records to get to the [PairingDetails]
            for (var i = 0; i < results.length; i++) {
                var pairing = data[i];

                // ToDo: Stored the Pairing information in a JavaScript database.
                console.log(pairing.PairingID);
                console.log(pairing.PairingNumber);
                console.log(pairing.BlockTime);
                console.log(pairing.CreditTime);
                console.log(pairing.Comment);

                // STEP 3b: Save all of the [PairingDetail] records for the current [Pairing]
                pairingDetails_Save(pairing.Items);
            }
        }
        catch (err) {
            ex.log(err, this.Name + ".databaseRefresh()");
        }       
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME: dbCreate()
    // SCOPE: Private
    // DEFINE:  Creates a HTML5 localStorage database.
    //////////////////////////////////////////////////////////////////////////////////////////////////
    function dbCreate() {
        try{
            /*** Creates a 2mb database ***/
            //db = window.openDatabase("Database", "1.0", "In-flight", 5 * 1024 * 1024);
            //db.transaction(createDB, dbErrorHandler, successDB)

            var createDB = function () { };
            var successDB = function () { };
        }
        catch (err) {
            ex.log(err, this.Name + ".dbCreate()");
        }
    }

    function dbErrorHandler(err) {
        ex.log(err, this.Name + ".dbErrorHandler()");
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME: find()
    // DEFINE:  Search all 'id's (or any other property), regardless of its depth in the object
    //////////////////////////////////////////////////////////////////////////////////////////////////
    function find (obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(find(obj[i], key, val));
            } else if (i == key && obj[key] == val) {
                objects.push(obj);
            }
        }
        return objects;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME: pairings()
    // DEFINE:  Returns a list of all of the Pairings in the Database.
    //////////////////////////////////////////////////////////////////////////////////////////////////
    function pairings () {
        try{
            // ToDo: Retrieve the Pairings from the JavaScript Database.
            var retVal = jQuery.parseJSON(localStorage.Pairings);
            return retVal;
        }
        catch (err) {
            ex.log(err, this.Name + ".Pairings()");
            return [];
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME: pairings_Save()
    // DEFINE:  Refreshes the [Pairing] localStorageDB table with updated information.
    // SCOPE: Private
    // PARAMETERS: data = [] of [Pairing]
    //////////////////////////////////////////////////////////////////////////////////////////////////
    function pairings_Save(data) {
        try {
            // ToDo: Store all of the [Pairing] records in the localStorageDB.

            // NOTE: This is only Temporarily until replaced with a DB Call.
            localStorage.Pairings = JSON.stringify(data); 
        }
        catch (err) {
            ex.log(err, this.Name + ".pairings_Save(Data:" + data +  ")");
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME: PairingDetails()
    // DEFINE:  Returns all of the PairingDetails for a Single Pairing
    //////////////////////////////////////////////////////////////////////////////////////////////////
     function pairingDetail (rowID) {
        try {
            // ToDo: Return all of the Pairing Details for a Single Pairing.
            var retVal = find(pairings(), "RowID", rowID); // HACK: This is for demo purposes only. 
            if (retVal.length = 0) {
                return null;
            }
            else {
                var pd = retVal[0];
                return pd;
            }
        }
        catch (err) {
            ex.log(err, this.Name + ".PairingDetail(RowID:" + rowID + ")");
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME: PairingDetails()
    // DEFINE:  Returns all of the PairingDetails for a Single Pairing
    //////////////////////////////////////////////////////////////////////////////////////////////////
    function pairingDetails(pairingID) {
        try{
            // ToDo: Return all of the Pairing Details for a Single Pairing.
            var retVal = find(pairings(), "PairingID", pairingID); // HACK: This is for demo purposes only.
            return retVal;
        }
        catch (err) {
            ex.log(err, this.Name + ".pairingDetails(pairingID:" + pairingID + ")");
            return [];
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME: ParingDetailsByMonth()
    // DEFINE:  Returns all of the PairingDetails for given Month.
    //////////////////////////////////////////////////////////////////////////////////////////////////
     function paringDetailsByMonth (date) {
        try {
            // ToDo: Return all of the Pairing Details for a given Month.
            var retVal;
            var month = date.getMonth();
            switch (month) {
                case 1: // February
                    retVal = pairingDetails(1);
                    break;
                case 2: // March 
                    retVal = pairingDetails(2);
                    break;
                default:
                    retVal = [];
            }

            return retVal;
        }
        catch (err) {
            ex.log(err, this.Name + ".ParingDetailsByMonth(Date:" + date + ")");
            return [];
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // NAME: PairingDetails_Save()
    // DEFINE:  Refreshes the [PairingDetail] localStorageDB table with updated information.
    // SCOPE:   Private
    // PARAMETERS: data = [] of [Pairing]
    //////////////////////////////////////////////////////////////////////////////////////////////////
    function pairingDetails_Save(data) {
        try{
            // STEP 2: Iterate through all of the PairiDetails and Insert them into the LocalDB.
            for (var i = 0; i < data.length; i++) {
                var pairingDetail = data[i];

                // ToDo: Insert the PairingDetail Record into the LocalDB.
                console.log(pairingDetail.PairingID);
                console.log(pairingDetail.RowID);
                console.log(pairingDetail.Sequence);
                console.log(pairingDetail.DepartureAirport);
                console.log(pairingDetail.DepartureTime);
                console.log(pairingDetail.ArrivalAirport);
                console.log(pairingDetail.ArrivalTime);
                console.log(pairingDetail.AircraftType);
                console.log(pairingDetail.FlightNumber);
                console.log(pairingDetail.TailNumber);
                console.log(pairingDetail.Layover);
                console.log(pairingDetail.BlockTime);
                console.log(pairingDetail.CreditTime);
            }
        }
        catch (err) {
            ex.log(err, this.Name + ".pairingDetail_Save(Data:" + data + ")");
        }
    }

    /*** Exposes all of the Public Methods of the object/class. ***/
    return {
        currencies: currencies,
        databaseRefresh : databaseRefresh,
        find: find,
        pairings: pairings,
        pairingDetail: pairingDetail,
        pairingDetails: pairingDetails,
        paringDetailsByMonth: paringDetailsByMonth
    };
}());
