/**
 * Handles HTTP POST requests to process booking submissions and store data in Google Sheets.
 * 
 * @param {Object} e - Event object containing form submission data.
 * @returns {ContentService.TextOutput} - JSON response indicating success or failure.
 */
function doPost(e) {
  // Check if request contains parameters
  if (!e || !e.parameter) {
      return ContentService.createTextOutput(JSON.stringify({ 
          result: 'error', message: 'No data received' 
      })).setMimeType(ContentService.MimeType.JSON);
  }

  const type = e.parameter.type; // Extract booking type (monthly or one-time)

  // Route request to the appropriate sheet based on booking type
  if (type === "monthly") {
      return handleBooking(e, "MonthlyBookings", ['Name', 'Phone Number', 'Start Month', 'End Month']);
  } else if (type === "oneTime") {
      return handleBooking(e, "One-Time Booking", ['Full Name', 'Phone Number', 'Booking Date', 'Time Slot']);
  } else {
      // Return an error if the booking type is invalid
      return ContentService.createTextOutput(JSON.stringify({ 
          result: 'error', message: 'Invalid booking type' 
      })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
* Processes the booking and stores data in the specified Google Sheet.
* 
* @param {Object} e - Event object containing form data.
* @param {string} sheetName - Name of the Google Sheet to store the data.
* @param {Array} requiredFields - List of required form fields.
* @returns {ContentService.TextOutput} - JSON response indicating success or failure.
*/
function handleBooking(e, sheetName, requiredFields) {
  try {
      // Get the spreadsheet and find the sheet by name
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
      
      // Check if the sheet exists, return error if not found
      if (!sheet) {
          return ContentService.createTextOutput(JSON.stringify({ 
              result: 'error', 
              message: `Sheet "${sheetName}" not found` 
          })).setMimeType(ContentService.MimeType.JSON);
      }

      // Get column headers to ensure data is correctly structured
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

      // Determine the next empty row for data insertion
      const nextRow = sheet.getLastRow() + 1;

      // Generate a unique booking ID using the current timestamp
      const bookingId = "BK" + Date.now(); 
      
      // Create an array to store form data, starting with timestamp and booking ID
      const newRow = [
          new Date(), // Timestamp when the booking is made
          bookingId,  // Unique booking ID
          ...requiredFields.map(field => e.parameter[field] || '') // Extract values from form submission
      ];

      // Insert new row into the sheet
      sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

      // Return success response with row number
      return ContentService.createTextOutput(JSON.stringify({ 
          result: 'success', 
          row: nextRow 
      })).setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
      // Return error response if something goes wrong
      return ContentService.createTextOutput(JSON.stringify({ 
          result: 'error', 
          message: error.toString() 
      })).setMimeType(ContentService.MimeType.JSON);
  }
}
//monthly sheet url:-
https://docs.google.com/spreadsheets/d/1u_HmKiJnSi-JR5VvffKOu5jzcVtdjLFN9YjO5sVJz7w/edit?gid=0#gid=0
//one time url:-
https://docs.google.com/spreadsheets/d/1u_HmKiJnSi-JR5VvffKOu5jzcVtdjLFN9YjO5sVJz7w/edit?gid=273457876#gid=273457876
