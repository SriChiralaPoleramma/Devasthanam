const MONTHLY_URL = 'https://script.google.com/macros/s/AKfycbwkysclh2TQJMleVI82ibZt0be_iTL_OXaTbqlEYfprvE_hz9hKT7UZiKhAtimegnqizg/exec';
const ONETIME_URL = 'https://script.google.com/macros/s/AKfycbxQo6Do2hR1zgVkf9zICw-kJMkX2qqsrN6iGpEx4y7wF3TDlTiAtLEtm08btTaYAGG6yw/exec';

const spinner = document.getElementById('spinner');

async function submitForm(event, form, url, type) {
  event.preventDefault();

  const formData = new FormData(form);
  formData.append('type', type);

  spinner.classList.remove('hidden');

  try {
    const response = await fetch(url, { method: 'POST', body: formData });
    const data = await response.json();

    spinner.classList.add('hidden');

    if (data.result === 'success') {
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

      form.reset();
    } else {
      Swal.fire('Error', data.message || 'Booking failed.', 'error');
    }

  } catch (err) {
    spinner.classList.add('hidden');
    console.error(err);
    Swal.fire('Network Error', 'Unable to complete booking. Please try again.', 'error');
  }
}

document.getElementById('monthlyForm').addEventListener('submit', (e) => {
  submitForm(e, monthlyForm, MONTHLY_URL, 'monthly');
});

document.getElementById('oneTimeForm').addEventListener('submit', (e) => {
  submitForm(e, oneTimeForm, ONETIME_URL, 'oneTime');
});
