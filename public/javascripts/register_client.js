$(document).ready(function () {
  $("#registerForm").validate({
    rules: {
      name: {
        required: true
      },

      redirect: {
        required: true
      }
    },
    submitHandler: function (form) {
      form.submit();
    }
  });
});