// Define the Google Apps Script URL for monthly booking
const monthlyScriptURL = 'https://script.google.com/macros/s/AKfycbzvS08vYfbQh8wv00gnOChZuATnmpNkiKFWrvlAfsEsecqcnu99ojvBq1DSrGRlqCU3/exec';

// Razorpay API Key
const razorpayKey = 'YOUR_RAZORPAY_KEY_ID'; // Replace with actual Razorpay Key

// Booking amount (in INR)
const bookingAmount = 10100; // ₹101

// DOM Elements
const monthlyForm = document.getElementById('monthlyForm');
const spinner = document.getElementById('spinner');
const payButton = document.getElementById('payButton');
const successSection = document.getElementById('bookingSuccessDetails');
const displayBookingID = document.getElementById('displayBookingID');
const displayName = document.getElementById('displayName');
const displayPhone = document.getElementById('displayPhone');
const displayGothram = document.getElementById('displayGothram');
const displayFamily = document.getElementById('displayFamily');
const displayStartMonth = document.getElementById('displayStartMonth');
const displayEndMonth = document.getElementById('displayEndMonth');
const closeTicketButton = document.getElementById('closeTicketButton');
const openTicketButton = document.getElementById('openTicketButton');

let bookingDataForPayment = null; // Temp store before payment

// Spinner toggle
function toggleSpinner(show) {
    spinner.classList.toggle('hidden', !show);
}

// Show booking details
function showSuccessDetails(data) {
    displayBookingID.textContent = data.bookingID;
    displayName.textContent = data.name;
    displayPhone.textContent = data.phone;
    displayGothram.textContent = data.gothram || 'లభ్యం కాదు';
    displayFamily.textContent = data.family || 'లభ్యం కాదు';
    displayStartMonth.textContent = data.startMonth;
    displayEndMonth.textContent = data.endMonth;
    successSection.classList.remove('hidden');
    openTicketButton.classList.remove('hidden');
    closeTicketButton.classList.remove('hidden');
}

// Save to localStorage
function saveToLocalStorage(data) {
    try {
        localStorage.setItem('lastBooking', JSON.stringify(data));
    } catch (error) {
        console.error("LocalStorage Error:", error);
        Swal.fire("⚠️ హెచ్చరిక", "బుకింగ్ సేవ్ చేయడంలో సమస్య.", "warning");
    }
}

// Load from localStorage
function loadLastBooking() {
    try {
        const data = JSON.parse(localStorage.getItem('lastBooking'));
        if (data) showSuccessDetails(data);
    } catch (error) {
        console.error("Load Error:", error);
    }
}

// Proceed to Pay
payButton.addEventListener('click', (e) => {
    e.preventDefault();

    const name = document.getElementById('monthlyName').value.trim();
    const phone = document.getElementById('monthlyPhone').value.trim();
    const gothram = document.getElementById('monthlyGothram').value.trim();
    const family = document.getElementById('monthlyFamily').value.trim();
    const startMonth = document.getElementById('startMonth').value;
    const endMonth = document.getElementById('endMonth').value;

    if (!/^\d{10}$/.test(phone)) {
        Swal.fire("⚠️ తప్పు", "దయచేసి సరైన 10 అంకెల ఫోన్ నంబర్ నమోదు చేయండి.", "warning");
        return;
    }

    bookingDataForPayment = { name, phone, gothram, family, startMonth, endMonth };

    const options = {
        "key": razorpayKey,         // Your Razorpay Key ID here
        "amount": bookingAmount,        // Amount in paise (₹101.00 = 10100 paise)
        "currency": "INR",
        "name": "శ్రీ శ్రీ శ్రీ చీరాల పోలేరమ్మ తల్లి దేవస్థానం",
        "description": "మాస పూజ బుకింగ్",
        "handler": function (response) {
            // This function runs after successful payment
            verifyPaymentAndSubmit(response);
        },
        "prefill": {
            "name": name,
            "contact": phone
        },
        "notes": {
            "gothram": gothram,
            "family": family,
            "startMonth": startMonth,
            "endMonth": endMonth
        },
        "theme": {
            "color": "#843534"
        }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
});

// Verify payment and submit to Google Apps Script
async function verifyPaymentAndSubmit(paymentResponse) {
    toggleSpinner(true);

    const formData = new FormData();
    formData.append('razorpay_payment_id', paymentResponse.razorpay_payment_id);
    formData.append('name', bookingDataForPayment.name);
    formData.append('phone', bookingDataForPayment.phone);
    formData.append('gothram', bookingDataForPayment.gothram);
    formData.append('family', bookingDataForPayment.family);
    formData.append('startMonth', bookingDataForPayment.startMonth);
    formData.append('endMonth', bookingDataForPayment.endMonth);

    try {
        const res = await fetch(monthlyScriptURL, {
            method: 'POST',
            body: formData
        });

        const result = await res.json();

        toggleSpinner(false);

        if (result.success) {
            showSuccessDetails(result); // Shows confirmation
            saveToLocalStorage(result); // Save to localStorage
            Swal.fire("✅ విజయవంతం", "మీ బుకింగ్ విజయవంతంగా నమోదు అయింది!", "success");
        } else {
            Swal.fire("❌ విఫలం", result.message || "పేమెంట్ తరువాత బుకింగ్ జరగలేదు.", "error");
        }
    } catch (error) {
        console.error("Booking error:", error);
        Swal.fire("⚠️ లోపం", "పేమెంట్ తరువాత బుకింగ్ ప్రాసెస్ లో లోపం వచ్చింది.", "error");
    } finally {
        toggleSpinner(false);
    }
}

// Load last booking on page load
window.addEventListener('DOMContentLoaded', loadLastBooking);

// Optional: Close/Open buttons
closeTicketButton.addEventListener('click', () => {
    successSection.classList.add('hidden');
});
openTicketButton.addEventListener('click', () => {
    successSection.classList.remove('hidden');
});
