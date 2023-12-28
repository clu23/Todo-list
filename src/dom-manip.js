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

    // Main content title, this function shows the main title of the selected item on the navbar
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

    // This function is used to keep track on tasks information
    function watchTaskInfo(projectIndex, taskIndex) {
      const infoTaskTitle = document.querySelector('.info-task-title');
      const infoTaskDescription = document.querySelector('.info-task-description');
      const infoTaskDueDate = document.querySelector('.info-task-due-date');
      const infoTaskPriority = document.querySelector('.info-task-priority');
      const infoTaskProject = document.querySelector('.info-task-project');
  
      // Task title
      infoTaskTitle.textContent =
        projects.projectsList[projectIndex].tasks[taskIndex].title;
  
      // Task description
      infoTaskDescription.textContent =
        projects.projectsList[projectIndex].tasks[taskIndex].description;
  
      // Task Due date
      infoTaskDueDate.textContent =
        projects.projectsList[projectIndex].tasks[taskIndex].date;
  
      // Task Priority 
      if (
        projects.projectsList[projectIndex].tasks[taskIndex].priority === 'low'
      ) {
        infoTaskPriority.textContent = 'I can do it later or never at all.. 😴';
      } else if (
        projects.projectsList[projectIndex].tasks[taskIndex].priority === 'medium'
      ) {
        infoTaskPriority.textContent = 'I stay somewhere between relaxation and focus 😅';
      } else if (
        projects.projectsList[projectIndex].tasks[taskIndex].priority === 'high'
      ) {
        infoTaskPriority.textContent = 'I must do it - sooner or later! 😲';
      } else {
        infoTaskPriority.textContent = '';
      }
  
      // Task project
      infoTaskProject.textContent = projects.projectsList[projectIndex].title;
    }

    //This function is used to manipulate the modal windows
    function manipulateModal(modalState, modalTask, modalAction, projectIndex, taskIndex) {
      const modalHeader = modal.querySelector('.modal-header');
      const modalMainTitle = modal.querySelector('.modal-main-title');
      const modalTaskButton = modal.querySelector('.modal-task-button');
      const projectDeletionText = modal.querySelector('.project-deletion-text');
      const taskDeletionText = modal.querySelector('.task-deletion-text');
      const taskInfoDiv = modal.querySelector('.info-div');
      const confirmButton = modal.querySelector('.confirm-modal');
      const cancelButton = modal.querySelector('.cancel-modal');
  
      modalHeader.classList.remove('deletion-modal-header');
      form.reset();
      form.classList.remove('hide');
      taskInfoDiv.classList.add('hide');
      modalTitleError.classList.add('hide');
      projectDeletionText.classList.add('hide');
      taskDeletionText.classList.add('hide');
      cancelButton.classList.remove('cancel-deletion');
      confirmButton.classList.remove('confirm-deletion', 'hide');
  
      if (modalState === 'show') {
        const modalIconsDiv = modal.querySelector('.radio-form');
        const modalTasksDiv = modal.querySelector('.modal-tasks-div');
  
        modal.classList.remove('hide');
        modalMainTitle.textContent = modalTask;
        modalTaskButton.textContent = modalAction;
        modalIconsDiv.classList.remove('hide');
        modalIconsDiv.classList.add('show');
        modalTasksDiv.classList.add('hide');
  
        // IF MODAL IS FOR EDITING PROJECT
        if (modalTask === 'Edit Project') {
          const allProjectIcons = modal.querySelectorAll('.icon');
          const projectIcon = projects.projectsList[projectIndex].icon;
  
          // SHOW EDITABLE PROJECT TITLE
          modalTitle.value = projects.projectsList[projectIndex].title;
  
          // SELECT EDITABLE PROJECT ICON
          for (let i = 0; i < allProjectIcons.length; i += 1) {
            if (allProjectIcons[i].value === projectIcon) {
              allProjectIcons[i].checked = true;
            }
          }
  
        // IF MODAL IS FOR ADDING OR EDITING TASK
        } else if (modalTask === 'Add Task'||
            modalTask === 'Edit Task'
        ) {
          modalIconsDiv.classList.remove('show');
          modalIconsDiv.classList.add('hide');
          modalTasksDiv.classList.remove('hide');
  
          if (modalTask === 'Edit Task') {
            modalTitle.value = projects.projectsList[projectIndex].tasks[taskIndex].title;
            taskDescription.value = projects.projectsList[projectIndex].tasks[taskIndex].description;
            taskDueDate.value = projects.projectsList[projectIndex].tasks[taskIndex].date;
            taskPrioritySelection.value = projects.projectsList[projectIndex].tasks[taskIndex].priority;
          }
  
          // IF MODAL IS FOR WATCHING TASK INFO
        } else if (modalTask === 'Task Info') {
          form.classList.add('hide');
          confirmButton.classList.add('hide');
          taskInfoDiv.classList.remove('hide');
          watchTaskInfo(projectIndex, taskIndex);
        }
      }
  
      // DELETION MODAL CONTENT
      if (modalAction === 'Delete') {
        modalHeader.classList.add('deletion-modal-header');
        form.classList.add('hide');
        cancelButton.classList.add('cancel-deletion');
        confirmButton.classList.add('confirm-deletion');
  
        // PROJECT DELETION
        if (modalTask === 'Delete Project') {
          const projectDeletionTitle = document.querySelector('.project-deletion-title');
  
          projectDeletionText.classList.remove('hide');
          projectDeletionTitle.textContent = projects.projectsList[projectIndex].title;
  
          // TASK DELETION
        } else if (modalTask === 'Delete Task') {
          const taskDeletionTitle = document.querySelector('.task-deletion-title');
  
          taskDeletionText.classList.remove('hide');
          taskDeletionTitle.textContent =
            projects.projectsList[projectIndex].tasks[taskIndex].title;
        }
      }
  
      // TO CLOSE THE MODAL
      if (modalState === 'close') {
        modal.classList.add('hide');
      }
    }


      return {
        responsiveMenu,
        toggleMenu,
        showMainTitle,
        changeMainTitle,
        manipulateModal,
      };

})();