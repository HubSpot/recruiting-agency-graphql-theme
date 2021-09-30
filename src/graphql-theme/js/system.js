(function() {
  // Variables

  var emailGlobalUnsub = document.querySelector('input[name="globalunsub"]');

  // Function for executing code on document ready

  function domReady(callback) {
    if (['interactive', 'complete'].indexOf(document.readyState) >= 0) {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  }

  // Function to disable the other checkbox inputs on the email subscription system page template

  function toggleDisabled() {
    var emailSubItem = document.querySelectorAll('#email-prefs-form .item');

    emailSubItem.forEach(item => {
      var emailSubItemInput = item.querySelector('input');

      if (emailGlobalUnsub.checked) {
        item.classList.add('disabled');
        emailSubItemInput.setAttribute('disabled', 'disabled');
        emailSubItemInput.checked = false;
      } else {
        item.classList.remove('disabled');
        emailSubItemInput.removeAttribute('disabled');
      }
    });
  }

  // Execute JavaScript on document ready

  domReady(function() {
    if (!document.body) {
      return;
    } else if (emailGlobalUnsub) {
      emailGlobalUnsub.addEventListener('change', toggleDisabled);
    }
  });
})();
