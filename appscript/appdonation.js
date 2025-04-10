function doPost(e) {
    try {
      // Open Google Sheet
      var sheet = SpreadsheetApp.openById("YOUR_SPREADSHEET_ID").getSheetByName("Contact_Inquiries");
  
      // Extract form values
      var timestamp = new Date();
      var Name = e.parameter.Name;
      var Email = e.parameter.Email;
      var Phone = e.parameter.Phone;
      var Message = e.parameter.Message;
  
      // Get current timestamp
      
  
      // Append data to sheet (Timestamp, Name, Email, Phone, Message)
      sheet.appendRow([timestamp, Name, Email, Phone, Message]);
  
      return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
    } catch (error) {
      return ContentService.createTextOutput("Error: " + error.message).setMimeType(ContentService.MimeType.TEXT);
    }
  }
  //https://docs.google.com/spreadsheets/d/1hyadpaRNwqfuMcYfjMldSiaXb1TT-gFISzANe7S3w_0/edit?gid=0#gid=0
