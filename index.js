// Set the dates for the countdown (April 19, 2025 and April 20, 2025)
const eventDate1 = new Date('April 19, 2025 00:00:00').getTime();
const eventDate2 = new Date('April 20, 2025 00:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    
    // Calculate the time difference for both dates
    const distance1 = eventDate1 - now;
    const distance2 = eventDate2 - now;

    // Time calculations for days, hours, minutes, and seconds
    const days1 = Math.floor(distance1 / (1000 * 60 * 60 * 24));
    const hours1 = Math.floor((distance1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes1 = Math.floor((distance1 % (1000 * 60 * 60)) / (1000 * 60));
    const seconds1 = Math.floor((distance1 % (1000 * 60)) / 1000);

    const days2 = Math.floor(distance2 / (1000 * 60 * 60 * 24));
    const hours2 = Math.floor((distance2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes2 = Math.floor((distance2 % (1000 * 60 * 60)) / (1000 * 60));
    const seconds2 = Math.floor((distance2 % (1000 * 60)) / 1000);

    // Display the result for April 19
    document.getElementById("timer").innerHTML = 
        `April 19 Countdown: ${days1}d ${hours1}h ${minutes1}m ${seconds1}s<br>
         April 20 Countdown: ${days2}d ${hours2}h ${minutes2}m ${seconds2}s`;

    // If the event date has passed
    if (distance1 < 0) {
        document.getElementById("timer").innerHTML = "🎉 April 19 Event has passed!";
    }
    if (distance2 < 0) {
        document.getElementById("timer").innerHTML = "🎉 April 20 Event has passed!";
    }
}

// Update the countdown every second
setInterval(updateCountdown, 1000);
