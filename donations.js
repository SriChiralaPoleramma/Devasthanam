document.addEventListener("DOMContentLoaded", function () {
    let donateButton = document.getElementById("donateButton");
    let qrSection = document.getElementById("qrSection");

    // Event listener to show QR code and message when the "Show Donation QR" button is clicked
    if (donateButton) {
        donateButton.addEventListener("click", function () {
            // Toggle the visibility of QR code section
            qrSection.style.display = qrSection.style.display === "none" ? "block" : "none";
        });
    }

    let donationForm = document.getElementById("donationForm");

    if (donationForm) {
        donationForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent page reload

            // Capture form data
            let name = document.getElementById("name").value.trim();
            let email = document.getElementById("email").value.trim();
            let phone = document.getElementById("phone").value.trim();
            let message = document.getElementById("message").value.trim();

            // Validate Inputs
            if (!name || !email || !phone || !message) {
                Swal.fire({
                    title: "⚠️ Missing Fields!",
                    text: "Please fill in all fields before submitting.",
                    icon: "warning",
                    confirmButtonText: "OK"
                });
                return;
            }

            // Google Apps Script Web App URL
            let scriptURL = "https://script.google.com/macros/s/AKfycbxn-8e4afi27t6PJFRDDaugbztzO9_x3JaYHylJCSA0aOQKlxnsVM8Fo54vg2WdGIi7/exec";

            let formData = new FormData();
            formData.append("Type", "Donation Inquiry");
            formData.append("Name", name);
            formData.append("Email", email);
            formData.append("Phone", phone);
            formData.append("Message", message);

            // Send data to Google Sheet
            fetch(scriptURL, { method: "POST", body: formData })
                .then(response => response.text())
                .then(data => {
                    console.log("✅ Response from Google Apps Script:", data);

                    // Show SweetAlert success message
                    Swal.fire({
                        title: "🙏 Inquiry Submitted!",
                        text: "Your inquiry has been received. We will contact you soon.",
                        icon: "success",
                        confirmButtonText: "OK"
                    });

                    // Clear form after submission
                    donationForm.reset();
                })
                .catch(error => {
                    console.error("❌ Error:", error);

                    // Show SweetAlert error message
                    Swal.fire({
                        title: "❌ Submission Failed!",
                        text: "There was an error submitting your inquiry. Please try again.",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                });
        });
    } else {
        console.error("❌ Form with ID 'donationForm' not found.");
    }
});
