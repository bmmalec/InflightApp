var ex = (function () {

    function log (err, functionName) {
        // ToDo: Records the Exception
        console.log("ERROR: " + err.message + "\nCode=" + err.code);
        alert("ERROR: " + err.message + "\nCode=" + err.code);
    }

    return {
        log: log
    };
}());

