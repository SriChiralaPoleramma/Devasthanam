// Define the Google Apps Script URL for monthly booking
const monthlyScriptURL = 'https://script.google.com/macros/s/AKfycbzvS08vYfbQh8wv00gnOChZuATnmpNkiKFWrvlAfsEsecqcnu99ojvBq1DSrGRlqCU3/exec';

// Get references to the DOM elements
const monthlyForm = document.getElementById('monthlyForm');
const spinner = document.getElementById('spinner');
const successSection = document.getElementById('bookingSuccessDetails');
const displayBookingID = document.getElementById('displayBookingID');
const displayName = document.getElementById('displayName');
const displayPhone = document.getElementById('displayPhone');
const displayGothram = document.getElementById('displayGothram');
const displayFamily = document.getElementById('displayFamily');
const displayStartMonth = document.getElementById('displayStartMonth');
const displayEndMonth = document.getElementById('displayEndMonth');
const closeTicketButton = document.getElementById('closeTicketButton'); // Close button
const openTicketButton = document.getElementById('openTicketButton'); // Open button

// Function to toggle the spinner visibility
function toggleSpinner(show) {
    spinner.classList.toggle('hidden', !show);
}

// Function to generate a unique Booking ID based on timestamp and random number
function generateBookingID() {
    const now = new Date(); // Get current date and time
    const timestamp = now.getTime().toString().slice(-6); // Get last 6 digits of the timestamp
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // Generate random 3-digit number
    return `POOJA-${timestamp}${random}`; // Return the generated Booking ID (using template literal for clarity)
}

// Function to show the booking details
function showSuccessDetails(data) {
    displayBookingID.textContent = data.bookingID;
    displayName.textContent = data.name;
    displayPhone.textContent = data.phone;
    displayGothram.textContent = data.gothram || 'లభ్యం కాదు'; // If no gothram, display "లభ్యం కాదు"
    displayFamily.textContent = data.family || 'లభ్యం కాదు'; // If no family, display "లభ్యం కాదు"
    displayStartMonth.textContent = data.startMonth;
    displayEndMonth.textContent = data.endMonth;
    successSection.classList.remove('hidden'); // Show the success section
    openTicketButton.classList.remove('hidden'); // Show "Open Ticket" button when booking is successful
    closeTicketButton.classList.remove('hidden'); // Show "Close Ticket" button when booking is successful
}

// Function to save booking data to localStorage for persistence
function saveToLocalStorage(data) {
    try {
        localStorage.setItem('lastBooking', JSON.stringify(data)); // Save booking data in localStorage
    } catch (error) {
        console.error("Error saving to localStorage:", error);
        Swal.fire("⚠️ హెచ్చరిక", "బుకింగ్ వివరాలు సేవ్ చేయడంలో సమస్య ఏర్పడింది.", "warning");
    }
}

// Function to load the last booking from localStorage (if any)
function loadLastBooking() {
    try {
        const data = JSON.parse(localStorage.getItem('lastBooking')); // Retrieve booking data from localStorage
        if (data) {
            showSuccessDetails(data); // If data exists, show the booking details
        }
    } catch (error) {
        console.error("Error loading from localStorage:", error);
    }
}

// Add an event listener for form submission
monthlyForm.addEventListener('submit', async (e) => { // Use async for cleaner promise handling
    e.preventDefault(); // Prevent the default form submission

    // Get values from the form inputs
    const name = document.getElementById('monthlyName').value.trim();
    const phone = document.getElementById('monthlyPhone').value.trim();
    const gothram = document.getElementById('monthlyGothram').value.trim();
    const family = document.getElementById('monthlyFamily').value.trim();
    const startMonth = document.getElementById('startMonth').value;
    const endMonth = document.getElementById('endMonth').value;

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phone)) {
        Swal.fire("⚠️ తప్పు", "దయచేసి సరైన 10 అంకెల ఫోన్ నంబర్ నమోదు చేయండి.", "warning");
        return; // Stop form submission if phone number is invalid
    }

    toggleSpinner(true); // Show the spinner while processing the booking
    const bookingID = generateBookingID(); // Generate a unique Booking ID

    // Prepare form data to send to Google Apps Script
    const formData = new FormData();
    formData.append('BookingID', bookingID);
    formData.append('Name', name);
    formData.append('Phone', phone);
    formData.append('Gothram', gothram);
    formData.append('Family', family);
    formData.append('StartMonth', startMonth);
    formData.append('EndMonth', endMonth);

    try {
        // Send form data to Google Apps Script using fetch API
        const response = await fetch(monthlyScriptURL, {
            method: 'POST',
            body: formData, // Send the form data
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Fetch Error:", response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text(); // Get the response text
        console.log("Google Apps Script Response:", responseText); // Log the response for debugging

        toggleSpinner(false); // Hide the spinner after the booking is processed
        Swal.fire("✅ బుకింగ్ విజయవంతం!", `మీ బుకింగ్ ఐడీ: ${bookingID}`, "success"); // Show success message

        // Prepare the data to display in the success section
        const data = {
            bookingID, name, phone, gothram, family, startMonth, endMonth
        };

        showSuccessDetails(data); // Show the booking details
        saveToLocalStorage(data); // Save the booking data in localStorage
        monthlyForm.reset(); // Reset the form for the next booking

    } catch (error) {
        toggleSpinner(false); // Hide the spinner if there's an error
        Swal.fire("❌ లోపం", "బుకింగ్ విఫలమైంది. మళ్లీ ప్రయత్నించండి.", "error"); // Show error message
        console.error("Booking Error:", error); // Log the error to the console
    }
});

// Load the last booking when the page is loaded
window.addEventListener('DOMContentLoaded', loadLastBooking);

// Function to download the ticket as a text file
function downloadTicket() {
    // Prepare the ticket content with the booking details
    const ticketContent = `
🛕 శ్రీ శ్రీ శ్రీ చీరాల పోలేరమ్మ తల్లి దేవస్థానం టికెట్
🎟️ Booking ID: ${displayBookingID.textContent}

👤 పేరు: ${displayName.textContent}

📞 ఫోన్: ${displayPhone.textContent}

🕉️ గోత్రం: ${displayGothram.textContent}

👪 కుటుంబ సభ్యులు: ${displayFamily.textContent}

📅 ప్రారంభ నెల: ${displayStartMonth.textContent}

📅 ముగింపు నెల: ${displayEndMonth.textContent}
ధన్యవాదాలు! మీ పూజ బుకింగ్ విజయవంతంగా నమోదైంది.
`;

    // Create a Blob object from the ticket content and prepare it for download
    const blob = new Blob([ticketContent], { type: 'text/plain;charset=utf-8' }); // Added charset for better encoding
    const url = URL.createObjectURL(blob); // Create a URL for the Blob object
    const a = document.createElement('a'); // Create an anchor element to trigger the download
    a.href = url;
    a.download = `${displayBookingID.textContent}.txt`; // Name the file with the Booking ID (using template literal)
    document.body.appendChild(a); // Append to the document so Firefox can click it
    a.click(); // Simulate a click on the anchor element to start the download
    document.body.removeChild(a); // Remove the element after download
    URL.revokeObjectURL(url); // Revoke the URL to release memory
}

// Function to close the ticket details section
function closeTicket() {
    successSection.classList.add('hidden'); // Hide the success section
    closeTicketButton.classList.add('hidden'); // Hide the "Close Ticket" button
    openTicketButton.classList.remove('hidden'); // Show the "Open Ticket" button again
}

// Function to open the ticket details section
function openTicket() {
    successSection.classList.remove('hidden'); // Show the success section
    closeTicketButton.classList.remove('hidden'); // Show the "Close Ticket" button
    openTicketButton.classList.add('hidden'); // Hide the "Open Ticket" button
}

// Add event listeners for the open and close buttons
closeTicketButton.addEventListener('click', closeTicket);
openTicketButton.addEventListener('click', openTicket);
// Set end month minimum to selected start month
const startMonthInput = document.getElementById('startMonth');
const endMonthInput = document.getElementById('endMonth');

startMonthInput.addEventListener('change', () => {
    if (startMonthInput.value) {
        // Set endMonth's min attribute to the selected startMonth
        endMonthInput.min = startMonthInput.value;
        // Optionally reset endMonth if it's before new min
        if (endMonthInput.value && endMonthInput.value < startMonthInput.value) {
            endMonthInput.value = '';
        }
    }
});

