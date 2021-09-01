// Variables

var galleryButton = document.querySelectorAll('.image-gallery--lightbox-enabled .image-gallery__button');
var lightboxCloseButton = document.querySelectorAll('.image-gallery__close-button');

// Event listeners

if (galleryButton) {
  Array.prototype.forEach.call(galleryButton, function(el){

    // Opens lightbox and sets focus to close button

    el.addEventListener("click", function(){
      var lightboxToOpen = el.getAttribute('data-lightbox-to-open');
      var lightbox = document.getElementById(lightboxToOpen);
      var lightboxCloseButton = lightbox.querySelector('.image-gallery__close-button');
      lightbox.classList.add('image-gallery__lightbox--open');
      lightboxCloseButton.focus();
    });

  });
}

if (lightboxCloseButton) {
  Array.prototype.forEach.call(lightboxCloseButton, function(el){

    // Closes lightbox and sets focus back to image

    el.addEventListener("click", function(){
      var lightboxID = el.parentElement.getAttribute('id');
      var galleryImage = document.querySelector(`[data-lightbox-to-open="${ lightboxID }"]`);
      el.parentElement.classList.remove('image-gallery__lightbox--open');
      galleryImage.focus();
    });

  });
}