document.addEventListener("DOMContentLoaded", function () {
    let contactForm = document.getElementById("messageForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let Name = document.getElementById("name").value.trim();
            let Email = document.getElementById("email").value.trim();
            let Phone = document.getElementById("phone").value.trim();
            let Message = document.getElementById("message").value.trim();

            // Validate Fields
            if (!Name || !Email || !Phone || !Message) {
                alert("⚠️ దయచేసి అన్ని ఫీల్డ్స్ పూరించండి.");
                return;
            }

            // Validate Email
            if (!Email.includes("@") || !Email.includes(".")) {
                alert("⚠️ దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ ఇవ్వండి.");
                return;
            }

            let ScriptURL = "https://script.google.com/macros/s/AKfycbyfJBjRJ3Q8fe7a4hh3jkdFPbtjDrUcmWOVNZIe4ug_hU7JS7jrBgo15FsY2ind6yoLFg/exec";
            let FormDataObj = new FormData();

            FormDataObj.append("Name", Name);
            FormDataObj.append("Email", Email);
            FormDataObj.append("Phone", Phone);
            FormDataObj.append("Message", Message);

            // Send Data to Google Sheet
            fetch(ScriptURL, { method: "POST", body: FormDataObj })
                .then(response => response.text())
                .then(data => {
                    console.log("✅ Response from Google Apps Script:", data);
                    alert("✅ సందేశం విజయవంతంగా సమర్పించబడింది!");
                    contactForm.reset();
                })
                .catch(error => {
                    console.error("❌ Error:", error);
                    alert("❌ సమస్య ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి.");
                });
        });
    } else {
        console.error("❌ Form with ID 'messageForm' not found.");
    }
});
