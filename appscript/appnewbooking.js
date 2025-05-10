function doPost(e) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("MonthlyForm");
  
    const data = [
      e.parameter.BookingID,
      e.parameter.Name,
      e.parameter.Phone,
      e.parameter.Gothram,
      e.parameter.Family,
      e.parameter.StartMonth,
      e.parameter.EndMonth,
      new Date()
    ];
  
    sheet.appendRow(data);
    return ContentService.createTextOutput("Success");
  }
  //sheet url:-

  https://docs.google.com/spreadsheets/d/1K8RtxK9-lmP26nMvO8c4GG6ij7Z0IOlvTve2LL17nLc/edit?gid=0#gid=0