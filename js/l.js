const monthlyScriptURL = 'https://script.google.com/macros/s/AKfycbzvS08vYfbQh8wv00gnOChZuATnmpNkiKFWrvlAfsEsecqcnu99ojvBq1DSrGRlqCU3/exec';

// Form and UI Elements
const monthlyForm = document.getElementById('monthlyForm');
const successSection = document.getElementById('bookingSuccessDetails');
const spinner = document.getElementById('spinner');

// 1. Generate ID & Show Details
function showTicket(data) {
    document.getElementById('displayBookingID').textContent = data.bookingID;
    document.getElementById('displayName').textContent = data.name;
    document.getElementById('displayPhone').textContent = data.phone;
    document.getElementById('displayGothram').textContent = data.gothram || 'N/A';
    document.getElementById('displayPeriod').textContent = `${data.startMonth} to ${data.endMonth}`;
    
    // Set Current Date automatically
    const today = new Date();
    document.getElementById('displayDate').textContent = today.toLocaleDateString('te-IN');

    successSection.classList.remove('hidden');
    document.getElementById('openTicketBtn').classList.add('hidden');
}

// 2. FEATURE: Save as Image (Gallery)
async function saveAsImage() {
    const element = document.getElementById('captureArea');
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff" });
    const link = document.createElement('a');
    link.download = `Poleramma_Ticket_${document.getElementById('displayBookingID').textContent}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}

// 3. FEATURE: WhatsApp Share
function shareOnWhatsApp() {
    const id = document.getElementById('displayBookingID').textContent;
    const name = document.getElementById('displayName').textContent;
    const text = `*శ్రీ పోలేరమ్మ తల్లి దేవస్థానం - పూజా టికెట్*%0A🔖 ID: ${id}%0A👤 పేరు: ${name}%0A📅 బుకింగ్ తేదీ: ${document.getElementById('displayDate').textContent}%0A🙏 ధన్యవాదాలు.`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

// 4. FEATURE: Native Mobile Share
async function shareNative() {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Temple Pooja Ticket',
                text: `నా పూజా బుకింగ్ ID: ${document.getElementById('displayBookingID').textContent}`,
                url: window.location.href
            });
        } catch (e) { console.log('Share canceled'); }
    } else { alert("Sharing not supported on this browser."); }
}

// Form Submission
monthlyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('monthlyPhone').value;
    if (!/^\d{10}$/.test(phone)) {
        Swal.fire("Error", "సరైన 10 అంకెల నంబర్ ఇవ్వండి", "error");
        return;
    }

    spinner.classList.remove('hidden');
    const bID = `POOJA-${Date.now().toString().slice(-6)}`;
    const formData = new FormData();
    formData.append('BookingID', bID);
    formData.append('Name', document.getElementById('monthlyName').value);
    formData.append('Phone', phone);
    formData.append('Gothram', document.getElementById('monthlyGothram').value);
    formData.append('Family', document.getElementById('monthlyFamily').value);
    formData.append('StartMonth', document.getElementById('startMonth').value);
    formData.append('EndMonth', document.getElementById('endMonth').value);

    try {
        await fetch(monthlyScriptURL, { method: 'POST', body: formData });
        spinner.classList.add('hidden');
        Swal.fire("Success", "బుకింగ్ విజయవంతమైంది!", "success");

        const data = {
            bookingID: bID,
            name: document.getElementById('monthlyName').value,
            phone: phone,
            gothram: document.getElementById('monthlyGothram').value,
            startMonth: document.getElementById('startMonth').value,
            endMonth: document.getElementById('endMonth').value
        };

        showTicket(data);
        localStorage.setItem('lastBooking', JSON.stringify(data));
        monthlyForm.reset();
    } catch (err) {
        spinner.classList.add('hidden');
        Swal.fire("Error", "సర్వర్ సమస్య. మళ్ళీ ప్రయత్నించండి.", "error");
    }
});

// Persistence
window.onload = () => {
    const last = JSON.parse(localStorage.getItem('lastBooking'));
    if (last) {
        showTicket(last);
        document.getElementById('openTicketBtn').classList.remove('hidden');
    }
};

document.getElementById('closeTicketBtn').onclick = () => {
    successSection.classList.add('hidden');
    document.getElementById('openTicketBtn').classList.remove('hidden');
};

document.getElementById('openTicketBtn').onclick = () => {
    successSection.classList.remove('hidden');
    document.getElementById('openTicketBtn').classList.add('hidden');
};
