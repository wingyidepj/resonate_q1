function base36Encode(num, length) {
  return num.toString(36).padStart(length, '0').toUpperCase();
}

function base36Decode(str) {
  return parseInt(str, 36);
}

function generateShortCode(storeId, transactionId) {
    const currentDate = new Date();
    const year = currentDate.getFullYear() % 100; 
    const month = currentDate.getMonth() + 1; 
    const day = currentDate.getDate();
    //Encoding the storeId, date, and transactionId
    const dateCode = base36Encode(year * 10000 + month * 100 + day, 4);
    const storeCode = base36Encode(storeId, 2);
    const transactionCode = base36Encode(transactionId, 3);

    return storeCode + dateCode + transactionCode;
}

function decodeShortCode(shortCode) {
    //Extracting storeCode, dateCode, and transactionCode from the shortCode
    const storeCode = shortCode.substring(0, 2);
    const dateCode = shortCode.substring(2, 6);
    const transactionCode = shortCode.substring(6, 9);

    //Decoding the storeId, date, and transactionId
    const storeId = base36Decode(storeCode);
    const dateNumber = base36Decode(dateCode);
    const transactionId = base36Decode(transactionCode);

    //Decoding the date
    const year = Math.floor(dateNumber / 10000);
    const monthDay = dateNumber % 10000;
    const month = Math.floor(monthDay / 100) - 1; 
    const day = monthDay % 100;

    //Constructing the date
    const shopDate = new Date(2000 + year, month, day);

    return {
        storeId: storeId,
        shopDate: shopDate,
        transactionId: transactionId
    };
}
// ------------------------------------------------------------------------------//
// --------------- Don't touch this area, all tests have to pass --------------- //
// ------------------------------------------------------------------------------//
function RunTests() {

    var storeIds = [175, 42, 0, 9]
    var transactionIds = [9675, 23, 123, 7]

    storeIds.forEach(function (storeId) {
        transactionIds.forEach(function (transactionId) {
            var shortCode = generateShortCode(storeId, transactionId);
            var decodeResult = decodeShortCode(shortCode);
            $("#test-results").append("<div>" + storeId + " - " + transactionId + ": " + shortCode + "</div>");
            AddTestResult("Length <= 9", shortCode.length <= 9);
            AddTestResult("Is String", (typeof shortCode === 'string'));
            AddTestResult("Is Today", IsToday(decodeResult.shopDate));
            AddTestResult("StoreId", storeId === decodeResult.storeId);
            AddTestResult("TransId", transactionId === decodeResult.transactionId);
        })
    })
}

function IsToday(inputDate) {
    // Get today's date
    var todaysDate = new Date();
    // call setHours to take the time out of the comparison
    return (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0));
}

function AddTestResult(testName, testResult) {
    var div = $("#test-results").append("<div class='" + (testResult ? "pass" : "fail") + "'><span class='tname'>- " + testName + "</span><span class='tresult'>" + testResult + "</span></div>");
}