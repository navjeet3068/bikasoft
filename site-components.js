async function loadComponent(path, target) {
  const componentUrl = new URL(path, document.currentScript.src);
  const response = await fetch(componentUrl);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: HTTP ${response.status}`);
  }

  document.querySelector(target).innerHTML = await response.text();
}

window.siteComponentsReady = Promise.all([
  loadComponent('header.html', '#siteHeader'),
  loadComponent('footer.html', '#siteFooter')
]).catch((error) => {
  console.error('Failed to load shared site components.', error);
  throw error;
});
