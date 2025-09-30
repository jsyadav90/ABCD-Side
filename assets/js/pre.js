document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  const mainContent = document.getElementById("main-content");

  //!S Sidebar toggle logic
  function setInitialSidebarState() {
    if (window.innerWidth <= 1200) {
      sidebar.classList.add("hide");
      sidebar.classList.remove("show");
      mainContent.classList.add("fullwidth");
    } else {
      sidebar.classList.add("show");
      sidebar.classList.remove("hide");
      mainContent.classList.remove("fullwidth");
    }
  }

  function toggleSidebar() {
    if (sidebar.classList.contains("show")) {
      sidebar.classList.remove("show");
      sidebar.classList.add("hide");
      mainContent.classList.add("fullwidth");
    } else {
      sidebar.classList.remove("hide");
      sidebar.classList.add("show");
      mainContent.classList.remove("fullwidth");
    }
  }

  hamburger.addEventListener("click", toggleSidebar);
  window.addEventListener("resize", setInitialSidebarState);
  setInitialSidebarState();

  //! ------------------ TAB LOGIC ------------------
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  const actionDiv = document.querySelector(".action-btn");

  if (tabButtons.length) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => (content.style.display = "none"));

        button.classList.add("active");
        const targetId = button.getAttribute("data-target");
        const targetContent = document.getElementById(targetId);

        if (targetContent) {
          targetContent.style.display = "block";
          const hasTable = targetContent.querySelector("table.table");
          if (hasTable) {
            actionDiv?.classList.remove("hide");
            setupCheckboxLogic(hasTable);
            setupSearchLogic(hasTable, actionDiv);
          } else {
            actionDiv?.classList.add("hide");
          }
        }
      });
    });
  } else {
    // For pages with a single table
    const defaultTable = document.querySelector("table.table");
    if (defaultTable) {
      actionDiv?.classList.remove("hide");
      setupCheckboxLogic(defaultTable);
      setupSearchLogic(defaultTable, actionDiv);
    } else {
      actionDiv?.classList.add("hide");
    }
  }

  //! ------------------ CHECKBOX LOGIC ------------------
  function setupCheckboxLogic(table) {
    const theadCheckbox = table.querySelector("thead input[type='checkbox']");
    const tbodyCheckboxes = table.querySelectorAll("tbody input[type='checkbox']");

    if (!theadCheckbox) return;

    // Select/Deselect all visible rows
    theadCheckbox.addEventListener("change", function () {
      const visibleRows = table.querySelectorAll("tbody tr:not([style*='display: none'])");
      visibleRows.forEach((row) => {
        const cb = row.querySelector("input[type='checkbox']");
        if (cb) cb.checked = theadCheckbox.checked;
      });
    });

    // Individual row checkboxes
    tbodyCheckboxes.forEach((cb) => {
      cb.addEventListener("change", () => updateTheadCheckbox(table, theadCheckbox));
    });
  }

  function updateTheadCheckbox(table, theadCheckbox) {
    const visibleRows = table.querySelectorAll("tbody tr:not([style*='display: none'])");
    const visibleCheckboxes = [...visibleRows].map((row) => row.querySelector("input[type='checkbox']"));

    const allChecked = visibleCheckboxes.every((cb) => cb && cb.checked);
    const someChecked = visibleCheckboxes.some((cb) => cb && cb.checked);

    if (allChecked) {
      theadCheckbox.checked = true;
      theadCheckbox.indeterminate = false;
    } else if (someChecked) {
      theadCheckbox.checked = false;
      theadCheckbox.indeterminate = true;
    } else {
      theadCheckbox.checked = false;
      theadCheckbox.indeterminate = false;
    }
  }

  //! ------------------ SEARCH LOGIC ------------------
  function setupSearchLogic(table, actionDiv) {
    const searchInput = actionDiv.querySelector("input[type='text']");
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const rows = table.querySelectorAll("tbody tr");

      rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll("td"));
        let matchFound = false;

        cells.forEach((td) => {
          if (td.querySelector("input, button")) return;

          const originalText = td.textContent;
          const lowerText = originalText.toLowerCase();

          if (searchTerm && lowerText.includes(searchTerm)) {
            matchFound = true;
            const regex = new RegExp(`(${searchTerm})`, "gi");
            td.innerHTML = originalText.replace(regex, `<mark>$1</mark>`);
          } else {
            td.innerHTML = originalText;
          }
        });

        row.style.display = matchFound || !searchTerm ? "" : "none";
      });

      // Update thead checkbox after filtering
      const theadCheckbox = table.querySelector("thead input[type='checkbox']");
      updateTheadCheckbox(table, theadCheckbox);
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") e.preventDefault();
    });
  }
});
























document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  const mainContent = document.getElementById("main-content");
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  const actionDiv = document.querySelector(".action-btn");

  // Sidebar toggle
  function setSidebarState(show) {
    if (show) {
      sidebar.classList.remove("hide");
      mainContent.classList.remove("fullwidth");
      localStorage.setItem("sidebarState", "open");
    } else {
      sidebar.classList.add("hide");
      mainContent.classList.add("fullwidth");
      localStorage.setItem("sidebarState", "closed");
    }
  }
  const savedState = localStorage.getItem("sidebarState");
  if (savedState === "closed") setSidebarState(false);
  hamburger.addEventListener("click", () => {
    setSidebarState(sidebar.classList.contains("hide"));
  });

  // Tabs
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => (content.style.display = "none"));

      button.classList.add("active");
      const targetId = button.getAttribute("data-target");
      const targetContent = document.getElementById(targetId);

      if (targetContent) {
        targetContent.style.display = "block";

        // Hide action buttons on Summary
        if (targetId === "summary") {
          actionDiv.style.display = "none";
        } else {
          const table = targetContent.querySelector("table.table");
          actionDiv.style.display = table ? "flex" : "none";
        }

        localStorage.setItem("activeTab", targetId);
      }
    });
  });

  // Restore active tab
  const savedTab = localStorage.getItem("activeTab") || "summary";
  const defaultTab = document.querySelector(`[data-target="${savedTab}"]`);
  if (defaultTab) defaultTab.click();
});
