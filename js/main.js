(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);
    
    
    // Initiate the wowjs
    new WOW().init();


    // Header carousel
    $(".header-carousel").owlCarousel({
        items: 1,
        margin: 0,
        stagePadding: 0,
        autoplay: true,
        smartSpeed: 1000,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
    });


   // Service-carousel
   $(".service-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 2000,
    center: false,
    dots: false,
    loop: true,
    margin: 25,
    nav : true,
    navText : [
        '<i class="bi bi-arrow-left"></i>',
        '<i class="bi bi-arrow-right"></i>'
    ],
    responsiveClass: true,
    responsive: {
        0:{
            items:1
        },
        576:{
            items:1
        },
        768:{
            items:2
        },
        992:{
            items:2
        },
        1200:{
            items:2
        }
    }
    });


    // testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : false,
        navText : [
            '<i class="fa fa-angle-right"></i>',
            '<i class="fa fa-angle-left"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:1
            },
            1200:{
                items:2
            }
        }
    });


   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Mobile Navbar Auto-Collapse on Link Click
    $('#navbarCollapse a.nav-item.nav-link').on('click', function () {
        if ($('.navbar-toggler').is(':visible') && $('#navbarCollapse').hasClass('show')) {
            $('#navbarCollapse').collapse('hide');
        }
    });

    // Client-side Contact Form Validation & State Feedback
    var contactForm = document.getElementById('svContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            var nameInput = document.getElementById('contactName');
            var emailInput = document.getElementById('contactEmail');
            var phoneInput = document.getElementById('contactPhone');
            var statusAlert = document.getElementById('formStatusAlert');
            var submitBtn = document.getElementById('contactSubmitBtn');

            function showFormAlert(message, alertType) {
                if (statusAlert) {
                    statusAlert.className = 'alert ' + alertType + ' my-3';
                    statusAlert.textContent = message;
                    statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }

            // Reset status
            if (statusAlert) {
                statusAlert.className = 'd-none alert my-3';
                statusAlert.textContent = '';
            }

            // Name check
            if (!nameInput || !nameInput.value.trim() || nameInput.value.trim().length < 2) {
                e.preventDefault();
                showFormAlert('Please enter your full name (at least 2 characters).', 'alert-danger');
                if (nameInput) nameInput.focus();
                return false;
            }

            // Email check
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput || !emailPattern.test(emailInput.value.trim())) {
                e.preventDefault();
                showFormAlert('Please provide a valid email address so we can reply with your quote.', 'alert-danger');
                if (emailInput) emailInput.focus();
                return false;
            }

            // Phone check (10-15 digits)
            var cleanPhone = phoneInput ? phoneInput.value.replace(/[^0-9]/g, '') : '';
            if (cleanPhone.length < 10) {
                e.preventDefault();
                showFormAlert('Please provide a valid 10-digit phone number for project consultation.', 'alert-danger');
                if (phoneInput) phoneInput.focus();
                return false;
            }

            // Form valid -> Show sending state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending Enquiry...';
            }
        });
    }

})(jQuery);

