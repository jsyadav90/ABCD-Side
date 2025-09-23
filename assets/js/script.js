document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  const mainContent = document.getElementById('main-content');

 
  // Ensure initial sidebar state based on screen width
  function setInitialSidebarState() {
   
    if (window.innerWidth <= 1200) {
      sidebar.classList.add('hide');
      sidebar.classList.remove('show');
      mainContent.classList.add('fullwidth');
    } else if(window.innerWidth > 1200){
         sidebar.classList.add('show');
         sidebar.classList.remove('hide');
        //  mainContent.classList.add('fullwidth');
    }
    else {
      sidebar.classList.remove('hide');
      sidebar.classList.remove('show');
      mainContent.classList.remove('fullwidth');
    }
  }

  //todo Toggle sidebar visibility
  function toggleSidebar() {
    if (sidebar.classList.contains('show')) {
      sidebar.classList.remove('show');
      sidebar.classList.add('hide');
      mainContent.classList.add('fullwidth');
    } else {
      sidebar.classList.remove('hide');
      sidebar.classList.add('show');
      mainContent.classList.remove('fullwidth');
    }
  }

  hamburger.addEventListener('click', toggleSidebar);

  window.addEventListener('resize', () => {
    // When resizing, reset sidebar initial state and hide 'show' to avoid conflict
    setInitialSidebarState();
  });

  // Set initial state on page load
  setInitialSidebarState();
});




//! Select all menu items with class 'menu-item'
  const menuItems = document.querySelectorAll('.sidebar .menu .menu-item');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove 'active' class from all menu items
      menuItems.forEach(i => i.classList.remove('active'));
      // Add 'active' class to the clicked menu item
      item.classList.add('active');
    });
  }); 