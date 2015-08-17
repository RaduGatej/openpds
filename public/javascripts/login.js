$(document).ready(function () {
    $("#loginForm").validate({
        rules: {
            inputEmail: {
                required: true,
                email: true
            },

            inputPassword: {
                required: true
            }
        }
    });
    $("#registerForm").validate({
        rules: {
            registerName: {
                required: true
            },

            registerEmail: {
                required: true,
                email: true
            },
            registerPassword: {
                required: true,
                minlength: 6
            },

            registerPasswordRepeat: {
                required: true,
                minlength: 6,
                equalTo: "#registerPassword"
            }
        },
        submitHandler: function(form) {
            form.submit();
        }
    });
});