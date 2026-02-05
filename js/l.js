const monthlyScriptURL = 'https://script.google.com/macros/s/AKfycbzvS08vYfbQh8wv00gnOChZuATnmpNkiKFWrvlAfsEsecqcnu99ojvBq1DSrGRlqCU3/exec';

// Set Minimum Date to NEXT MONTH
window.addEventListener('DOMContentLoaded', () => {
    const startInput = document.getElementById('startMonth');
    const endInput = document.getElementById('endMonth');
    
    const today = new Date();
    today.setMonth(today.getMonth() + 1); // Move to next month
    const nextMonthStr = today.toISOString().slice(0, 7); // YYYY-MM
    
    startInput.value = nextMonthStr;
    startInput.min = nextMonthStr;
    endInput.min = nextMonthStr;
});

// Calculate Amount: ₹101 per month (including both months)
function calculateTotal(start, end) {
    const s = new Date(start + "-01");
    const e = new Date(end + "-01");
    let months = (e.getFullYear() - s.getFullYear()) * 12;
    months -= s.getMonth();
    months += e.getMonth();
    const totalMonths = months <= 0 ? 1 : months + 1;
    return totalMonths * 101;
}

function showTicket(data) {
    const amount = calculateTotal(data.startMonth, data.endMonth);
    
    document.getElementById('displayBookingID').textContent = data.bookingID;
    document.getElementById('displayName').textContent = data.name;
    document.getElementById('displayPhone').textContent = data.phone;
    document.getElementById('displayGothram').textContent = data.gothram || 'N/A';
    document.getElementById('displayPeriod').textContent = `${data.startMonth} to ${data.endMonth}`;
    document.getElementById('displayAmount').textContent = amount;
    document.getElementById('displayDate').textContent = new Date().toLocaleDateString('te-IN');

    document.getElementById('bookingSuccessDetails').classList.remove('hidden');
    document.getElementById('openTicketBtn').classList.add('hidden');
}

// WhatsApp Share Function
function shareOnWhatsApp() {
    const id = document.getElementById('displayBookingID').textContent;
    const name = document.getElementById('displayName').textContent;
    const amount = document.getElementById('displayAmount').textContent;
    const period = document.getElementById('displayPeriod').textContent;
    const phone = document.getElementById('displayPhone').textContent;

    const text = `*శ్రీ పోలేరమ్మ తల్లి దేవస్థానం - పూజా టికెట్*%0A` +
                 `🔖 ID: ${id}%0A` +
                 `👤 పేరు: ${name}%0A` +
                 `📅 కాలం: ${period}%0A` +
                 `💰 మొత్తం అమౌంట్: ₹${amount}/-%0A` +
                 `🙏 ధన్యవాదాలు.`;

    window.open(`https://wa.me/91${phone}?text=${text}`, '_blank');
}

// Save as Image (Gallery)
async function saveAsImage() {
    const element = document.getElementById('captureArea');
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff" });
    const link = document.createElement('a');
    link.download = `Poleramma_Ticket_${document.getElementById('displayBookingID').textContent}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}

// Form Submission
document.getElementById('monthlyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const spinner = document.getElementById('spinner');
    spinner.classList.remove('hidden');

    const bID = `POOJA-${Date.now().toString().slice(-6)}`;
    const formData = new FormData();
    formData.append('BookingID', bID);
    formData.append('Name', document.getElementById('monthlyName').value);
    formData.append('Phone', document.getElementById('monthlyPhone').value);
    formData.append('Gothram', document.getElementById('monthlyGothram').value);
    formData.append('StartMonth', document.getElementById('startMonth').value);
    formData.append('EndMonth', document.getElementById('endMonth').value);

    try {
        await fetch(monthlyScriptURL, { method: 'POST', body: formData });
        spinner.classList.add('hidden');
        Swal.fire("విజయవంతం!", "మీ పూజ బుక్ చేయబడింది.", "success");

        const data = {
            bookingID: bID,
            name: document.getElementById('monthlyName').value,
            phone: document.getElementById('monthlyPhone').value,
            gothram: document.getElementById('monthlyGothram').value,
            startMonth: document.getElementById('startMonth').value,
            endMonth: document.getElementById('endMonth').value
        };
        showTicket(data);
        localStorage.setItem('lastBooking', JSON.stringify(data));
    } catch (err) {
        spinner.classList.add('hidden');
        Swal.fire("Error", "మళ్ళీ ప్రయత్నించండి", "error");
    }
});

// View Toggle
document.getElementById('closeTicketBtn').onclick = () => {
    document.getElementById('bookingSuccessDetails').classList.add('hidden');
    document.getElementById('openTicketBtn').classList.remove('hidden');
};
document.getElementById('openTicketBtn').onclick = () => {
    document.getElementById('bookingSuccessDetails').classList.remove('hidden');
    document.getElementById('openTicketBtn').classList.add('hidden');
};
                            
