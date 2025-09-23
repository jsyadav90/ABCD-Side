document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  const mainContent = document.getElementById("main-content");

  // Ensure initial sidebar state based on screen width
  function setInitialSidebarState() {
    if (window.innerWidth <= 1200) {
      sidebar.classList.add("hide");
      sidebar.classList.remove("show");
      mainContent.classList.add("fullwidth");
    } else if (window.innerWidth > 1200) {
      sidebar.classList.add("show");
      sidebar.classList.remove("hide");
      //  mainContent.classList.add('fullwidth');
    } else {
      sidebar.classList.remove("hide");
      sidebar.classList.remove("show");
      mainContent.classList.remove("fullwidth");
    }
  }

  //todo Toggle sidebar visibility
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

  window.addEventListener("resize", () => {
    // When resizing, reset sidebar initial state and hide 'show' to avoid conflict
    setInitialSidebarState();
  });

  // Set initial state on page load
  setInitialSidebarState();
});

//! ✅ Setup Tab Navigation (for inventory.html only)

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
        } else {
          actionDiv?.classList.add("hide");
        }
      }
    });
  });
} else {
  // ✅ For user.html, repair.html, etc. (no tab)
  const defaultTable = document.querySelector("table.table");
  if (defaultTable) {
    actionDiv?.classList.remove("hide");
    setupCheckboxLogic(defaultTable);
  } else {
    actionDiv?.classList.add("hide");
  }
}
