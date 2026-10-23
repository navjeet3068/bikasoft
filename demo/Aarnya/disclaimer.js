(function () {
  'use strict';

  var storageKey = 'aaranyaDisclaimerAccepted';

  try {
    if (window.localStorage.getItem(storageKey) === 'true') {
      return;
    }
  } catch (error) {
    console.warn('Unable to read the disclaimer preference from local storage.', error);
  }

  var style = document.createElement('style');
  style.textContent = [
    '.disclaimer-overlay{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:1.25rem;background:rgba(16,38,74,.48);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);}',
    '.disclaimer-dialog{width:min(100%,38rem);max-height:calc(100vh - 2.5rem);overflow-y:auto;padding:clamp(1.5rem,5vw,2.5rem);border:1px solid #dce7f5;border-radius:18px;background:#fff;color:#49617f;box-shadow:0 24px 80px rgba(16,42,86,.24);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;}',
    '.disclaimer-dialog h2{margin:0 0 1rem;color:#102a56;font-size:1.75rem;line-height:1.2;}',
    '.disclaimer-dialog p{margin:0 0 1rem;font-size:1rem;line-height:1.65;}',
    '.disclaimer-actions{display:flex;justify-content:flex-end;gap:.75rem;margin-top:1.75rem;}',
    '.disclaimer-actions button{min-width:7rem;padding:.7rem 1.25rem;border:1px solid #1748a5;border-radius:999px;font:inherit;font-weight:600;cursor:pointer;transition:background .2s ease,color .2s ease,box-shadow .2s ease;}',
    '.disclaimer-accept{background:#2864dc;color:#fff;box-shadow:0 9px 22px rgba(40,100,220,.19);}',
    '.disclaimer-accept:hover{background:#1748a5;}',
    '.disclaimer-reject{background:#fff;color:#1748a5;}',
    '.disclaimer-reject:hover{background:#f4f8ff;}',
    '.disclaimer-actions button:focus-visible{outline:3px solid #70a9ff;outline-offset:3px;}',
    '@media(max-width:480px){.disclaimer-actions{flex-direction:column-reverse}.disclaimer-actions button{width:100%}}'
  ].join('');
  document.head.appendChild(style);

  var overlay = document.createElement('div');
  overlay.className = 'disclaimer-overlay';

  var dialog = document.createElement('section');
  dialog.className = 'disclaimer-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'disclaimer-title');
  dialog.setAttribute('aria-describedby', 'disclaimer-copy');

  var title = document.createElement('h2');
  title.id = 'disclaimer-title';
  title.textContent = 'Disclaimer';

  var copy = document.createElement('div');
  copy.id = 'disclaimer-copy';

  [
    'As per the rules of the Bar Council of India, this website is not intended for advertisement or solicitation and is meant solely for informational purposes.',
    'The information available on this website does not constitute legal or professional advice and shall not create any client or attorney-client relationship. Any engagement shall arise only through a formal written agreement.',
    'Aaranya Consulting INC makes reasonable efforts to keep the information accurate but assumes no liability for reliance placed upon the content of this website.'
  ].forEach(function (text) {
    var paragraph = document.createElement('p');
    paragraph.textContent = text;
    copy.appendChild(paragraph);
  });

  var actions = document.createElement('div');
  actions.className = 'disclaimer-actions';

  var rejectButton = document.createElement('button');
  rejectButton.className = 'disclaimer-reject';
  rejectButton.type = 'button';
  rejectButton.textContent = 'Reject';

  var acceptButton = document.createElement('button');
  acceptButton.className = 'disclaimer-accept';
  acceptButton.type = 'button';
  acceptButton.textContent = 'Accept';

  actions.appendChild(rejectButton);
  actions.appendChild(acceptButton);
  dialog.appendChild(title);
  dialog.appendChild(copy);
  dialog.appendChild(actions);
  overlay.appendChild(dialog);

  var previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  document.body.appendChild(overlay);
  acceptButton.focus();

  acceptButton.addEventListener('click', function () {
    try {
      window.localStorage.setItem(storageKey, 'true');
    } catch (error) {
      console.warn('Unable to save the disclaimer preference to local storage.', error);
    }
    overlay.remove();
    document.body.style.overflow = previousOverflow;
  });

  rejectButton.addEventListener('click', function () {
    window.location.replace('/decline.html');
  });

  dialog.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab') {
      return;
    }

    if (event.shiftKey && document.activeElement === rejectButton) {
      event.preventDefault();
      acceptButton.focus();
    } else if (!event.shiftKey && document.activeElement === acceptButton) {
      event.preventDefault();
      rejectButton.focus();
    }
  });
})();
