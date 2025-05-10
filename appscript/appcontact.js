function doPost(e) {
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Contact_Inquiries");
  
      if (!sheet) {
        return ContentService.createTextOutput("Sheet Not Found");
      }
  
      var data = e.parameter;
      sheet.appendRow([
        new Date(), // Timestamp
        data.Name,
        data.Email,
        data.Phone,
        data.Message
      ]);
  
      return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
    } catch (error) {
      return ContentService.createTextOutput("Error: " + error.message);
    }
  }
  //url:-
  https://docs.google.com/spreadsheets/d/1ImPTdRM-_ztdamY1g56uqDUkfV3g2c4geTZVtkjbiRM/edit?gid=0#gid=0