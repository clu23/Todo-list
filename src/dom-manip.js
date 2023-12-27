import { format, parseISO, differenceInDays } from 'date-fns';
import projects from './projects';

export const dom = (() => {
    const toggleMenuIcon = document.querySelector('.toggle-menu');
    const sidebarMenu = document.querySelector('#sidebar-menu');
    const modal = document.querySelector('#modal');
    const form = modal.querySelector('#form');
    const modalTitle = modal.querySelector('#modal-title');
    const modalTitleError = modal.querySelector('.modal-title-error');
    const mainContent = document.querySelector('#main');
    const mainTitleIcon = document.querySelector('.main-title-icon');
    const mainTitleText = document.querySelector('.main-title-text');
    const projectsLinksDiv = document.querySelector('.projects-links-div');
    const addTaskButton = document.querySelector('.add-task');
    const tasksCount = document.querySelector('.tasks-count');
    const tasksList = document.querySelector('.tasks-list');
    const taskDescription = modal.querySelector('.task-description');
    const taskDueDate = modal.querySelector('#dueDate');
    const taskPrioritySelection = modal.querySelector('.task-priority');

    function responsiveMenu() {
        if (window.innerWidth <= 1000) {
          toggleMenuIcon.classList.remove('active');
    
          // Hide Sidebar and make it opaque
          sidebarMenu.classList.remove('show-sidebar');
          sidebarMenu.classList.add('hide-sidebar');
          sidebarMenu.classList.add('add-z-index');
    
          // Expand main content
          mainContent.classList.remove('contract-main');
          mainContent.classList.add('expand-main');
    
        } else {
          // Show Sidebar and make it a bit transparent
          sidebarMenu.classList.remove('hide-sidebar');
          sidebarMenu.classList.add('show-sidebar');
          sidebarMenu.classList.remove('add-z-index');
    
          // Contract main content and make it opaque
          mainContent.classList.remove('expand-main');
          mainContent.classList.add('contract-main');
          mainContent.classList.remove('inactive-main');
        }
      }
    
      function toggleMenu() {
        toggleMenuIcon.classList.toggle('active');
    
        // Show Sidebar and make main content a bit transparent
        if (sidebarMenu.classList.contains('hide-sidebar')) {
          sidebarMenu.classList.remove('hide-sidebar');
          sidebarMenu.classList.add('show-sidebar');
          mainContent.classList.add('inactive-main');
    
          // Hide Sibar and make main content opaque 
        } else if (sidebarMenu.classList.contains('show-sidebar')) {
          sidebarMenu.classList.remove('show-sidebar');
          sidebarMenu.classList.add('hide-sidebar');
          mainContent.classList.remove('inactive-main');
        }
      }

    // Main content title
    function showMainTitle(index) {
      const allMenuIcons = document.querySelectorAll('.menu-link-icon');
      const menuIcon = allMenuIcons[index].getAttribute('data-icon');
      const menuTexts = document.querySelectorAll('.menu-link-text');

      mainTitleIcon.classList.add(
        'fal',
        'fa-fw',
        'main-title-icon',
        'padding-right',
        menuIcon
      );
      mainTitleText.textContent = menuTexts[index].textContent;
      document.title = `ToDo - ${mainTitleText.textContent}`;
    }

    function changeMainTitle(target, index) {
      mainTitleIcon.className = '';
  
      // Title of tasks from the menu 
      if (
        target.classList.contains('menu-link') ||
        target.classList.contains('menu-link-icon') ||
        target.classList.contains('menu-link-text')
      ) {
        showMainTitle(index);
      }
  
      // Title of tasks from projects
      if (
        target.classList.contains('project-link') ||
        target.classList.contains('project-icon') ||
        target.classList.contains('project-text') ||
        target.classList.contains('delete-project') ||
        target.classList.contains('edit-project') ||
        target.classList.contains('project-icon-and-text-div') ||
        target.classList.contains('project-default-icons-div')
      ) {
        const projectIcon = projects.projectsList[index].icon;
  
        mainTitleIcon.classList.add(
          'fal',
          'fa-fw',
          'main-title-icon',
          'padding-right',
          projectIcon
        );
        mainTitleText.textContent = projects.projectsList[index].title;
        document.title = `ToDo - ${mainTitleText.textContent}`;
      }
    }


      return {
        responsiveMenu,
        toggleMenu,
        showMainTitle,
        changeMainTitle,
      };

})();