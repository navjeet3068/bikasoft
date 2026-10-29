const sidebarPlaceholder = document.querySelector("#sidebar-placeholder");

if (sidebarPlaceholder) {
  const setupMobileMenu = () => {
    const sidebar = sidebarPlaceholder.querySelector(".sidebar");
    const toggle = sidebar?.querySelector(".menu-toggle");
    const nav = sidebar?.querySelector(".nav");

    if (!sidebar || !toggle || !nav) return;

    const closeMenu = () => {
      sidebar.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") !== "true";
      sidebar.classList.toggle("menu-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!sidebar.contains(event.target)) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && sidebar.classList.contains("menu-open")) {
        closeMenu();
        toggle.focus();
      }
    });
  };

  const setCurrentSidebarLink = () => {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const currentLink = [...sidebarPlaceholder.querySelectorAll(".nav a")]
      .find((link) => new URL(link.href).pathname.split("/").pop() === currentPage);

    if (currentLink) {
      currentLink.setAttribute("aria-current", "page");
    }
  };

  const renderSidebarFallback = () => {
    const links = [
      ["index.html", "i-user", "Profile"],
      ["practice-areas.html", "i-user", "About"],
      ["books.html", "i-book", "Books"],
      ["foreign-journal-articles.html", "i-file", "Foreign Journal Articles"],
      ["research-papers.html", "i-file", "Research Papers"],
      ["international-judgments.html", "i-globe", "International Judgments"],
      ["contact.html", "i-mail", "Contact"],
    ];
    const navLinks = links.map(([href, icon, label]) =>
      `<a href="${href}"><svg class="icon"><use href="icons.svg#${icon}"></use></svg>${label}</a>`,
    ).join("");

    sidebarPlaceholder.innerHTML = `
      <aside class="sidebar" aria-label="Main navigation">
        <div class="brand">
          <div><div class="brand-rule"></div><p class="brand-name">Dr. Ashwinie<br>Kumar Bansal</p><p class="brand-role">Advocate | Arbitrator | Author</p></div>
          <button class="menu-toggle" type="button" aria-controls="site-navigation" aria-expanded="false">
            <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            <span>Menu</span>
          </button>
        </div>
        <nav class="nav" id="site-navigation">${navLinks}</nav>
        <div class="sidebar-note"><div class="brand-rule"></div><strong>Law<br>Arbitration<br>Scholarship</strong><small>In service of<br>commerce and justice</small></div>
      </aside>`;
    setCurrentSidebarLink();
    setupMobileMenu();
  };

  if (window.location.protocol === "file:") {
    renderSidebarFallback();
  } else {
    fetch("sidebar.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Sidebar request failed: ${response.status}`);
        }
        return response.text();
      })
      .then((markup) => {
        sidebarPlaceholder.innerHTML = markup;
        setCurrentSidebarLink();
        setupMobileMenu();
      })
      .catch((error) => {
        console.error("Unable to load sidebar.html; using the built-in navigation fallback.", error);
        renderSidebarFallback();
      });
  }
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
