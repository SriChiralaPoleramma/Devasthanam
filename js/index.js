// Set the dates for the countdown (April 11, 2026 and April 12, 2026)
const eventDate1 = new Date('April 11, 2026 00:00:00').getTime();
const eventDate2 = new Date('April 12, 2026 00:00:00').getTime();

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

    // Display the result for April 11
    document.getElementById("timer").innerHTML = 
        `April 11 Countdown: ${days1}d ${hours1}h ${minutes1}m ${seconds1}s<br>
         April 12 Countdown: ${days2}d ${hours2}h ${minutes2}m ${seconds2}s`;

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

    // Smooth scrolling with offset

$(document).ready(function() {
    $('nav a').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top - $('header').outerHeight() // Adjust for fixed header
            }, 800, function(){
                window.location.hash = hash;
            });
        }
    });

    // Scrollspy (Navigation Highlighting)
    $(window).on('scroll', function() {
        var scrollPos = $(window).scrollTop();
        $('nav a').each(function() {
            var target = $(this).attr('href');
            var targetOffset = $(target).offset().top - $('header').outerHeight();
            var targetBottom = targetOffset + $(target).outerHeight();
            if (scrollPos >= targetOffset && scrollPos < targetBottom) {
                $('nav a').removeClass('active');
                $(this).addClass('active');
            }
        });

        // Back-to-Top Button Visibility
        if ($(this).scrollTop() > 200) {
            $('#back-to-top-btn').fadeIn();
        } else {
            $('#back-to-top-btn').fadeOut();
        }
    });

    // Back-to-Top Button Functionality
    $('#back-to-top-btn').on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
        $('nav a').removeClass('active');
        $('nav a[href="#home"]').addClass('active'); // Optionally highlight Home on top
    });

    // Initial active link on load
    if (window.location.hash) {
        $('nav a').removeClass('active');
        $('nav a[href="' + window.location.hash + '"]').addClass('active');
        $('html, body').scrollTop($(window.location.hash).offset().top - $('header').outerHeight());
    } else {
        $('nav a[href="#home"]').addClass('active'); // Set Home as active by default
    }
});
