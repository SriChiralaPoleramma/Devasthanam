const monthlyScriptURL = 'https://script.google.com/macros/s/AKfycbzvS08vYfbQh8wv00gnOChZuATnmpNkiKFWrvlAfsEsecqcnu99ojvBq1DSrGRlqCU3/exec';

// Set Minimum Date & Handle Price Change
window.addEventListener('DOMContentLoaded', () => {
    const startInput = document.getElementById('startMonth');
    const endInput = document.getElementById('endMonth');
    
    const today = new Date();
    today.setMonth(today.getMonth() + 1); 
    const nextMonthStr = today.toISOString().slice(0, 7); 
    
    startInput.value = nextMonthStr;
    startInput.min = nextMonthStr;
    endInput.min = nextMonthStr;

    // QR & Verification Interceptor
    checkVerification();

    [startInput, endInput].forEach(input => {
        input.addEventListener('change', () => {
            const total = calculateTotal(startInput.value, endInput.value);
            document.getElementById('livePrice').innerText = `₹ ${total}`;
            document.getElementById('monthCount').innerText = `${total/101} Month(s) Seva`;
        });
    });
});

function calculateTotal(start, end) {
    if(!start || !end) return 101;
    const s = new Date(start + "-01");
    const e = new Date(end + "-01");
    let months = (e.getFullYear() - s.getFullYear()) * 12;
    months -= s.getMonth();
    months += e.getMonth();
    const totalMonths = months < 0 ? 1 : months + 1;
    return totalMonths * 101;
}

function showTicket(data) {
    const amount = calculateTotal(data.startMonth, data.endMonth);
    const today = new Date().toLocaleDateString('te-IN');
    
    document.getElementById('displayBookingID').textContent = data.bookingID;
    document.getElementById('displayName').textContent = data.name;
    document.getElementById('displayPhone').textContent = data.phone;
    document.getElementById('displayGothram').textContent = data.gothram || 'N/A';
    document.getElementById('displayPeriod').textContent = `${data.startMonth} to ${data.endMonth}`;
    document.getElementById('displayAmount').textContent = amount;
    document.getElementById('displayDate').textContent = today;

    // Generate QR Code with Verification Link
    const verifyURL = window.location.origin + window.location.pathname + 
        `?v=1&id=${data.bookingID}&n=${encodeURIComponent(data.name)}&p=${data.phone}&a=${amount}&dur=${data.startMonth}-${data.endMonth}`;
    
    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), { 
        text: verifyURL, 
        width: 128, 
        height: 128,
        colorDark: "#8e0000"
    });

    document.getElementById('bookingForm').classList.add('hidden');
    document.getElementById('bookingSuccessDetails').classList.remove('hidden');
}

// Form Submission
document.getElementById('monthlyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const spinner = document.getElementById('spinner');
    spinner.classList.remove('hidden');

    const bID = `POL-${Date.now().toString().slice(-6)}`;
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

// Verification Logic
function checkVerification() {
    const params = new URLSearchParams(window.location.search);
    if(params.has('v')) {
        document.getElementById('mainHeader').classList.add('hidden');
        document.getElementById('promoBanner').classList.add('hidden');
        document.getElementById('bookingForm').classList.add('hidden');
        document.getElementById('verifyUI').classList.remove('hidden');
        
        document.getElementById('vDetails').innerHTML = `
            <p><strong>ID:</strong> ${params.get('id')}</p>
            <p><strong>Devotee:</strong> ${params.get('n')}</p>
            <p><strong>Phone:</strong> ${params.get('p')}</p>
            <p><strong>Duration:</strong> ${params.get('dur')}</p>
            <p><strong>Amount:</strong> ₹${params.get('a')} (Paid)</p>
        `;
    }
}

// Shared Functions
async function saveAsImage() {
    const element = document.getElementById('captureArea');
    const canvas = await html2canvas(element, { scale: 3 });
    const link = document.createElement('a');
    link.download = `Poleramma_Ticket.png`;
    link.href = canvas.toDataURL();
    link.click();
}

function shareOnWhatsApp() {
    const id = document.getElementById('displayBookingID').textContent;
    const name = document.getElementById('displayName').textContent;
    const amount = document.getElementById('displayAmount').textContent;
    const phone = document.getElementById('displayPhone').textContent;
    const msg = `*శ్రీ పోలేరమ్మ తల్లి ఆలయం*%0A✅ బుకింగ్ విజయవంతమైంది%0A🔖 ID: ${id}%0A👤 భక్తుడు: ${name}%0A💰 మొత్తం: ₹${amount}/-`;
    window.open(`https://wa.me/91${phone}?text=${msg}`, '_blank');
}

async function shareNative() {
    const canvas = await html2canvas(document.getElementById('captureArea'));
    canvas.toBlob(async (blob) => {
        const file = new File([blob], 'ticket.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: 'Temple Ticket' });
        } else { Swal.fire("Notice", "Native sharing not supported here.", "info"); }
    });
                       }
        
