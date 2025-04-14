// Google Apps Script URLs for monthly and one-time form submissions
const MONTHLY_URL = 'https://script.google.com/macros/s/AKfycbwkysclh2TQJMleVI82ibZt0be_iTL_OXaTbqlEYfprvE_hz9hKT7UZiKhAtimegnqizg/exec';
const ONETIME_URL = 'https://script.google.com/macros/s/AKfycbxQo6Do2hR1zgVkf9zICw-kJMkX2qqsrN6iGpEx4y7wF3TDlTiAtLEtm08btTaYAGG6yw/exec';

// Spinner element to show loading indicator
const spinner = document.getElementById('spinner');

// Get the Start and End Month inputs from the form
const startMonthInput = document.querySelector("input[name='Start Month']");
const endMonthInput = document.querySelector("input[name='End Month']");

// 👉 Enforce that End Month must be AFTER Start Month
startMonthInput.addEventListener('change', () => {
  const startValue = startMonthInput.value;

  if (startValue) {
    // Split start month into year and month
    const [year, month] = startValue.split('-').map(Number);

    // Create a date for next month
    const nextMonth = new Date(year, month); // JS month is 0-indexed, so this auto-rolls to next year if needed

    // Format it back to YYYY-MM (the format for <input type="month">)
    const minEndMonth = nextMonth.toISOString().slice(0, 7);

    // Set the min attribute of End Month field
    endMonthInput.min = minEndMonth;

    // 🛑 If user already selected an invalid End Month, reset it and alert
    if (endMonthInput.value && endMonthInput.value <= startValue) {
      endMonthInput.value = '';
      Swal.fire('Invalid End Month', 'Please select a month after the Start Month.', 'warning');
    }
  }
});

// 🔁 Function to submit either Monthly or One-Time booking form
async function submitForm(event, form, url, type) {
  event.preventDefault(); // Stop default form submission

  const formData = new FormData(form); // Collect form data
  formData.append('type', type); // Add type info (monthly or one-time)

  spinner.classList.remove('hidden'); // Show spinner

  try {
    const response = await fetch(url, { method: 'POST', body: formData }); // Send data to Apps Script
    const data = await response.json(); // Get response as JSON

    spinner.classList.add('hidden'); // Hide spinner

    if (data.result === 'success') {
      // ✅ Booking successful – show confirmation
      const name = form.querySelector("input[name='Full Name']").value;
      const phone = form.querySelector("input[name='Phone Number']").value;
      let details = '';

      if (type === 'monthly') {
        const from = form.querySelector("input[name='Start Month']").value;
        const to = form.querySelector("input[name='End Month']").value;
        details = `📅 Start: ${from}\n📅 End: ${to}`;
      } else {
        const date = form.querySelector("input[name='Booking Date']").value;
        const time = form.querySelector("select[name='Time Slot']").value;
        details = `📅 Date: ${date}\n⏰ Time: ${time}`;
      }

      Swal.fire({
        icon: 'success',
        title: 'Booking Confirmed!',
        html: `👤 <b>${name}</b><br>📞 ${phone}<br>${details}<br><br>🏛 Contact: 98765 43210`,
        confirmButtonText: 'OK',
      });

      form.reset(); // Clear the form after success

    } else {
      // ❌ Show error from server if any
      Swal.fire('Error', data.message || 'Booking failed.', 'error');
    }

  } catch (err) {
    // ❌ Handle network or unknown errors
    spinner.classList.add('hidden');
    console.error(err);
    Swal.fire('Network Error', 'Unable to complete booking. Please try again.', 'error');
  }
}

// 🌟 Attach event listeners to both forms
document.getElementById('monthlyForm').addEventListener('submit', (e) => {
  submitForm(e, monthlyForm, MONTHLY_URL, 'monthly');
});

document.getElementById('oneTimeForm').addEventListener('submit', (e) => {
  submitForm(e, oneTimeForm, ONETIME_URL, 'oneTime');
});
