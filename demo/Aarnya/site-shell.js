(function () {
  'use strict';

  var scriptUrl = document.currentScript.src;

  function loadFragment(name, target, selector) {
    var url = new URL(name, scriptUrl);
    return fetch(url)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Unable to load ' + name + ': ' + response.status);
        }
        return response.text();
      })
      .then(function (markup) {
        var template = document.createElement('template');
        template.innerHTML = markup;
        var fragment = template.content;
        var element = fragment.querySelector(selector);
        if (!element) {
          throw new Error('The ' + name + ' fragment is missing ' + selector + '.');
        }
        target.replaceWith(fragment);
      });
  }

  var header = document.querySelector('[data-site-header]');
  var footer = document.querySelector('[data-site-footer]');

  if (!header || !footer) {
    throw new Error('The page is missing a shared header or footer mount point.');
  }

  Promise.all([
    loadFragment('header.html', header, 'header.topbar'),
    loadFragment('footer.html', footer, 'footer')
  ]).then(function () {
    var button = document.querySelector('.menu-button');
    var nav = document.getElementById('primary-nav');
    if (!button || !nav) {
      throw new Error('The shared header is missing its mobile navigation controls.');
    }

    function closeMenu() {
      nav.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Open navigation');
    }

    button.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1023) {
        closeMenu();
      }
    });
  }).catch(function (error) {
    console.error('Unable to initialize the shared site header and footer.', error);
  });
})();
