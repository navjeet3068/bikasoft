const sidebarPlaceholder = document.querySelector("#sidebar-placeholder");

if (sidebarPlaceholder) {
  fetch("sidebar.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Sidebar request failed: ${response.status}`);
      }
      return response.text();
    })
    .then((markup) => {
      sidebarPlaceholder.innerHTML = markup;
      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      const currentLink = [...sidebarPlaceholder.querySelectorAll(".nav a")]
        .find((link) => new URL(link.href).pathname.split("/").pop() === currentPage);

      if (currentLink) {
        currentLink.setAttribute("aria-current", "page");
      }
    })
    .catch((error) => {
      console.error("Unable to load the site sidebar.", error);
      sidebarPlaceholder.setAttribute("role", "alert");
      sidebarPlaceholder.textContent = "The navigation menu could not be loaded.";
    });
}

const searchInput = document.querySelector("#site-search");
const searchableSections = [...document.querySelectorAll(".searchable")];
const emptyState = document.querySelector("#empty-state");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLocaleLowerCase();
    let visibleSections = 0;

    for (const section of searchableSections) {
      const items = [...section.querySelectorAll(".search-item")];

      if (items.length) {
        let visibleItems = 0;
        for (const item of items) {
          const matches = !query || item.textContent.toLocaleLowerCase().includes(query);
          item.hidden = !matches;
          if (matches) visibleItems += 1;
        }
        section.hidden = visibleItems === 0;
      } else {
        section.hidden = Boolean(query) && !section.textContent.toLocaleLowerCase().includes(query);
      }

      if (!section.hidden) visibleSections += 1;
    }

    if (emptyState) {
      emptyState.style.display = visibleSections ? "none" : "block";
    }
  });
}
