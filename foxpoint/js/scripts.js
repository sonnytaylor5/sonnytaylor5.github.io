window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 72,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

$(document).ready(function(){
    $('#messageButton').click(function(){
        var name = $('#inputName').val();
        var email = $('#inputEmail').val();
        var phone = $('#inputPhone').val();
        var message = $('#inputMessage').val();

        if(name == "" || email == "" || phone == "" || message == ""){
            alert("Ensure you have filled out every field on the form. We require your name, email address, phone number and a message!");
            return;
        }

        $('.loading-spinner-container').css({"display" : "block"});
        $('#modalMessageResponse').css({"display" : "none"});
        var data = new FormData($('#contactForm')[0]);
        $.ajax({
            type: 'POST',
            url: 'https://sonnerrs-bot.herokuapp.com/sendfoxpointmail/',
            enctype: 'multipart/form-data',
            data: data,
            processData: false,
            contentType: false,
            cache: false
        })
            .always(function (data) {
                $('#contact-divider').css({"display" : "none"});
                console.log(data);
                if(data.status == 400){
                    $('#messageTitle').text("Bad request");
                    $('#messageBody').text("Please ensure you fill out every field on the form! (refresh to view the form again)");
                }

                if(data.status == 429){
                    $('#messageTitle').text("You've been trying to send too many messages!");
                    $('#messageBody').text("Wait a minute and try again, or give us a phone call instead!");
                }

                if (data.success) {
                    $('#contactForm')[0].reset();
                    $('#messageTitle').text("Your message has been sent!");
                    $('#messageBody').text("Thanks for sending us a message! We will try to be in contact with you as soon as possible!");
                } else {
                    $('#messageTitle').text("Something has gone wrong..");
                    $('#messageBody').text("Sorry about that, but we had a problem sending your message. Please give us a call instead.");
                }

                
                setTimeout(function () {
                    $('.loading-spinner-container').fadeOut("fast");
                    $('#contactForm').fadeOut("fast");
                    $('.contactFormResponse').fadeIn("fast");
                }, 2000);
                
            });
    });
});
