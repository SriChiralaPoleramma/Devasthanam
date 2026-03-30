document.addEventListener("DOMContentLoaded", function () {

    let btn = document.getElementById("donateButton");
    let qr = document.getElementById("qrSection");

    btn.onclick = () => {
        qr.style.display = qr.style.display === "none" ? "block" : "none";
    };

    let form = document.getElementById("donationForm");

    form.addEventListener("submit", function(e){
        e.preventDefault();

        let data = new FormData();
        data.append("Name", name.value);
        data.append("Email", email.value);
        data.append("Phone", phone.value);
        data.append("Message", message.value);

        fetch("YOUR_GOOGLE_SCRIPT_URL", {
            method: "POST",
            body: data
        })
        .then(res => res.text())
        .then(() => {
            Swal.fire("Success", "Data Saved Successfully 🙏", "success");
            form.reset();
        })
        .catch(() => {
            Swal.fire("Error", "Try again ❌", "error");
        });

    });

});
