document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  const mainContent = document.getElementById("main-content");
  const actionDiv = document.querySelector(".action-btn");
  const sidebarLinks = sidebar.querySelectorAll("a");
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  //! ------------------ OVERLAY FOR MOBILE ------------------
  let overlay = document.createElement("div");
  overlay.id = "sidebar-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.3)";
  overlay.style.zIndex = "998";
  overlay.style.display = "none";
  document.body.appendChild(overlay);

  overlay.addEventListener("click", () => {
    if (window.innerWidth <= 1200) setSidebarState(false);
  });

  //! ------------------ SIDEBAR LOGIC ------------------
  function setSidebarState(show) {
    if (show) {
      sidebar.classList.remove("hide");
      sidebar.classList.add("show");
      mainContent.classList.remove("fullwidth");
      if (window.innerWidth <= 1200) overlay.style.display = "block";
      localStorage.setItem("sidebarState", show ? "open" : "closed");
    } else {
      sidebar.classList.remove("show");
      sidebar.classList.add("hide");
      mainContent.classList.add("fullwidth");
      overlay.style.display = "none";
      localStorage.setItem("sidebarState", show ? "open" : "closed");
    }
  }

  if (window.innerWidth > 1200) {
    setSidebarState(true);
  } else {
    const savedState = localStorage.getItem("sidebarState");
    setSidebarState(savedState === "open");
  }

  hamburger.addEventListener("click", () => {
    setSidebarState(sidebar.classList.contains("hide"));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1200) setSidebarState(true);
  });

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1200) setSidebarState(false);
    });
  });

  //! ------------------ TAB LOGIC ------------------
  function activateTab(button) {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => (content.style.display = "none"));

    button.classList.add("active");
    const targetId = button.getAttribute("data-target");
    const targetContent = document.getElementById(targetId);

    if (targetContent) {
      targetContent.style.display = "block";
      const table = targetContent.querySelector("table.table");
      if (actionDiv) actionDiv.style.display = table ? "flex" : "none";
      if (table) {
        setupCheckboxLogic(table);
        setupSearchLogic(table, actionDiv);
      }
      localStorage.setItem("activeTab", targetId);
    }
  }

  tabButtons.forEach((btn) => btn.addEventListener("click", () => activateTab(btn)));
  const savedTab = localStorage.getItem("activeTab");
  if (savedTab) {
    const defaultTab = document.querySelector(`[data-target="${savedTab}"]`);
    if (defaultTab) defaultTab.click();
  } else if (tabButtons.length) tabButtons[0].click();

  //! ------------------ TABLE LOGIC ------------------
  function setupCheckboxLogic(table) {
    const theadCheckbox = table.querySelector("thead input[type='checkbox']");
    const tbodyCheckboxes = table.querySelectorAll("tbody input[type='checkbox']");
    if (!theadCheckbox) return;

    theadCheckbox.addEventListener("change", () => {
      const visibleRows = table.querySelectorAll("tbody tr:not([style*='display: none'])");
      visibleRows.forEach((row) => {
        const cb = row.querySelector("input[type='checkbox']");
        if (cb) cb.checked = theadCheckbox.checked;
      });
    });

    tbodyCheckboxes.forEach((cb) =>
      cb.addEventListener("change", () => updateTheadCheckbox(table, theadCheckbox))
    );
  }

  function updateTheadCheckbox(table, theadCheckbox) {
    const visibleRows = table.querySelectorAll("tbody tr:not([style*='display: none'])");
    const visibleCheckboxes = [...visibleRows].map((row) => row.querySelector("input[type='checkbox']"));
    const allChecked = visibleCheckboxes.every((cb) => cb && cb.checked);
    const someChecked = visibleCheckboxes.some((cb) => cb && cb.checked);
    theadCheckbox.checked = allChecked;
    theadCheckbox.indeterminate = !allChecked && someChecked;
  }

  //! ------------------ SEARCH LOGIC ------------------
  function setupSearchLogic(table, actionDiv) {
    if (!actionDiv) return;
    const searchInput = actionDiv.querySelector("input[type='text']");
    if (!searchInput) return;

    const allRows = Array.from(table.querySelectorAll("tbody tr"));
    // Store original HTML for each td
    const originalHTML = allRows.map(row =>
      Array.from(row.querySelectorAll("td")).map(td => td.innerHTML)
    );

    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase().trim();

      allRows.forEach((row, rowIndex) => {
        let matchFound = false;
        row.querySelectorAll("td").forEach((td, colIndex) => {
          // Reset td to original HTML first
          td.innerHTML = originalHTML[rowIndex][colIndex];

          if (searchTerm && td.textContent.toLowerCase().includes(searchTerm)) {
            matchFound = true;
            // Highlight search term
            const regex = new RegExp(`(${searchTerm})`, "gi");
            td.innerHTML = td.innerHTML.replace(regex, '<mark>$1</mark>');
          }
        });
        row.style.display = searchTerm ? (matchFound ? "" : "none") : "";
      });

      const theadCheckbox = table.querySelector("thead input[type='checkbox']");
      updateTheadCheckbox(table, theadCheckbox);
    });

    searchInput.addEventListener("keydown", (e) => e.key === "Enter" && e.preventDefault());
  }

  //! ------------------ INITIALIZE TABLES ------------------
  const tables = document.querySelectorAll("table.table");
  tables.forEach((table) => {
    if (actionDiv) actionDiv.style.display = "flex";
    setupCheckboxLogic(table);
    setupSearchLogic(table, actionDiv);
  });
});
