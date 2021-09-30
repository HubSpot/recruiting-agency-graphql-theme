// Website header variables

var menuParentItems = document.querySelectorAll('.header__menu--desktop .header__menu-item--has-submenu');
var openToggle = document.querySelectorAll('.header__menu-toggle--open');
var closeToggle = document.querySelectorAll('.header__menu-toggle--close');
var mobileChildToggle = document.querySelectorAll('.header__menu--mobile .header__menu-child-toggle');
var langToggle = document.querySelectorAll('.header__language-switcher-child-toggle');

// Desktop menu

if (menuParentItems) {
  Array.prototype.forEach.call(menuParentItems, function(el){

    // Link variables

    var childToggle = el.querySelector('.header__menu-child-toggle');

    // Handles hover over

    el.addEventListener('mouseover', function(){
      this.classList.add('header__menu-item--open');
      this.querySelector('a').setAttribute('aria-expanded', 'true');
      this.querySelector('button').setAttribute('aria-expanded', 'true');
    });

    // Handles hover out

    el.addEventListener('mouseout', function(){
      document.querySelector('.header__menu-item--open > a').setAttribute('aria-expanded', 'false');
      document.querySelector('.header__menu-item--open > button').setAttribute('aria-expanded', 'false');
      document.querySelector('.header__menu-item--open').classList.remove('header__menu-item--open');
    });

    // Handles toggle for submenus

    childToggle.addEventListener('click', function(){
      if (this.parentNode.classList.contains('header__menu-item--open')) {
        this.parentNode.classList.remove('header__menu-item--open');
        this.parentNode.querySelector('a').setAttribute('aria-expanded', 'false');
        this.parentNode.querySelector('button').setAttribute('aria-expanded', 'false');
      }
      else {
        this.parentNode.classList.add('header__menu-item--open');
        this.parentNode.querySelector('a').setAttribute('aria-expanded', 'true');
        this.parentNode.querySelector('button').setAttribute('aria-expanded', 'true');
      }
    });

  });

}

// Mobile menu

// Opens mobile menu

Array.prototype.forEach.call(openToggle, function(el){

  var closeToggle = el.parentElement.querySelector('.header__menu-toggle--close');
  var mobileMenu = el.parentElement.querySelector('.header__menu--mobile');

  el.addEventListener('click', function(){
    this.classList.toggle('header__menu-toggle--show');
    closeToggle.classList.toggle('header__menu-toggle--show');
    mobileMenu.classList.toggle('header__menu--show');
  });

});

// Closes mobile menu

Array.prototype.forEach.call(closeToggle, function(el){

  var openToggle = el.parentElement.querySelector('.header__menu-toggle--open');
  var mobileMenu = el.parentElement.querySelector('.header__menu--mobile');

  el.addEventListener('click', function(){
    this.classList.toggle('header__menu-toggle--show');
    openToggle.classList.toggle('header__menu-toggle--show');
    mobileMenu.classList.toggle('header__menu--show');
  });

});

// Handles toggle for submenus

if (mobileChildToggle) {
  Array.prototype.forEach.call(mobileChildToggle, function(el){

    el.addEventListener('click', function(){
      this.classList.toggle('header__menu-child-toggle--open');
      if (this.parentNode.classList.contains('header__menu-item--open')) {
        this.parentNode.classList.remove('header__menu-item--open');
        this.parentNode.querySelector('a').setAttribute('aria-expanded', 'false');
        this.parentNode.querySelector('button').setAttribute('aria-expanded', 'false');
      }
      else {
        this.parentNode.classList.add('header__menu-item--open');
        this.parentNode.querySelector('a').setAttribute('aria-expanded', 'true');
        this.parentNode.querySelector('button').setAttribute('aria-expanded', 'true');
      }
    });

  });
}

// Language switcher

// Handles toggle for language switcher submenu

if (langToggle) {
  Array.prototype.forEach.call(langToggle, function(el){

    el.addEventListener('click', function(){
      this.classList.toggle('header__language-switcher-child-toggle--open');
      this.parentElement.parentElement.classList.toggle('header__language-switcher-label--open');
    });

  });
}
