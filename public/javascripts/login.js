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
    },
    submitHandler: function (form) {
      form.submit();
    }
  });

  $("#registerForm").validate({
    rules: {
      given_name: {
        required: true
      },

      family_name: {
        required: true
      },

      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      },

      passConfirm: {
        required: true,
        minlength: 6,
        equalTo: "#password"
      }
    },
    submitHandler: function (form) {
      form.submit();
    }
  });
});