import { format, parseISO, differenceInDays } from 'date-fns';
import projects from './projects';
import {tasks} from './tasks';

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
        'fa-solid',
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
          'fa-solid',
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
  
        // If modal is for editing a project 
        if (modalTask === 'Edit Project') {
          const allProjectIcons = modal.querySelectorAll('.icon');
          const projectIcon = projects.projectsList[projectIndex].icon;
  
          // Show editable project title 
          modalTitle.value = projects.projectsList[projectIndex].title;
  
          // Select editable project icon 
          for (let i = 0; i < allProjectIcons.length; i += 1) {
            if (allProjectIcons[i].value === projectIcon) {
              allProjectIcons[i].checked = true;
            }
          }
  
        // If modal is for adding or editing a task 
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
  
          // If modal is to display task info 
        } else if (modalTask === 'Task Info') {
          form.classList.add('hide');
          confirmButton.classList.add('hide');
          taskInfoDiv.classList.remove('hide');
          watchTaskInfo(projectIndex, taskIndex);
        }
      }
  
      // Deletion of modal content 
      if (modalAction === 'Delete') {
        modalHeader.classList.add('deletion-modal-header');
        form.classList.add('hide');
        cancelButton.classList.add('cancel-deletion');
        confirmButton.classList.add('confirm-deletion');
  
        // Project deletion
        if (modalTask === 'Delete Project') {
          const projectDeletionTitle = document.querySelector('.project-deletion-title');
  
          projectDeletionText.classList.remove('hide');
          projectDeletionTitle.textContent = projects.projectsList[projectIndex].title;
  
          // Task deletion
        } else if (modalTask === 'Delete Task') {
          const taskDeletionTitle = document.querySelector('.task-deletion-title');
  
          taskDeletionText.classList.remove('hide');
          taskDeletionTitle.textContent =
            projects.projectsList[projectIndex].tasks[taskIndex].title;
        }
      }
  
      // To close the modal window 
      if (modalState === 'close') {
        modal.classList.add('hide');
      }
    }


    // This function displays the tasks on the main window depending on the menu selected on the navbar
    function showTasks(menuTitle, projectIndexStart, projectIndexEnd) {
      const todayDate = format(new Date(), 'yyyy-MM-dd');
      let tasksNumber = 0;
  
      tasksCount.textContent = 0;
      tasksList.textContent = '';
  
      // Generate tasks list
      for (let i = projectIndexStart; i < projectIndexEnd; i += 1) {
        for (let j = 0; j < projects.projectsList[i].tasks.length; j += 1) {
          const taskDiv = document.createElement('div');
          const taskIconAndTextDiv = document.createElement('div');
          const taskIcon = document.createElement('i');
          const taskText = document.createElement('p');
          const taskInfo = document.createElement('div');
          const taskDate = document.createElement('p');
          const taskEditIcon = document.createElement('i');
          const taskTrashIcon = document.createElement('i');
          const taskInfoIcon = document.createElement('i');
  
            // If clicked on Menu Link "Today"
          if (menuTitle === 'today') {
  
            if (projects.projectsList[i].tasks[j].date !== todayDate
            ) {
              continue; // If task isn't for today - skip it
            }
  
            // If clicked on Menu link "Week"
          } else if (menuTitle === 'week') {
            const dateOfToday = parseISO(todayDate);
            const dateOfTask = parseISO(projects.projectsList[i].tasks[j].date)
  
            if (!(differenceInDays(dateOfTask, dateOfToday) <= 7 &&
               differenceInDays(dateOfTask, dateOfToday) >= 0
            )) {
             continue; // If the task isn't due within a week from today - skip it
            }
  
            // If clicked on Menu link "Completed"
          } else if (menuTitle === 'completed' &&
            projects.projectsList[i].tasks[j].completed !== true
          ) {
            continue; // If task isn't completed yet - skip it
          }
  
          // Show number of tasks
          tasksNumber += 1;
          tasksCount.textContent = tasksNumber;
  
          // Task priority, text and its Div 
          taskDiv.classList.add('task-div', 'hover-element');
          taskIconAndTextDiv.classList.add('flex');
          taskDiv.setAttribute('data-project-index', i);
          taskDiv.setAttribute('data-task-index', j);
  
          if (projects.projectsList[i].tasks[j].priority === 'low') {
            taskIcon.classList.add('low-priority');
          } else if (projects.projectsList[i].tasks[j].priority === 'medium') {
            taskIcon.classList.add('mid-priority');
          } else if (projects.projectsList[i].tasks[j].priority === 'high') {
            taskIcon.classList.add('high-priority');
          } else {
            taskIcon.classList.add('fal', 'padding-right');
          }
          taskIcon.setAttribute('data-project-index', i);
          taskIcon.setAttribute('data-task-index', j);
  
          taskText.classList.add('task-text');
          taskText.textContent = projects.projectsList[i].tasks[j].title;
          taskText.setAttribute('data-project-index', i);
          taskText.setAttribute('data-task-index', j);
  
          // Task Info Div 
          taskInfo.classList.add('flex');
  
          // Tasks Due date
          taskDate.classList.add('due-date', 'padding-right');
          if (projects.projectsList[i].tasks[j].date !== undefined) {
            taskDate.textContent = projects.projectsList[i].tasks[j].date;
          } else {
            taskDate.textContent = '';
          }
  
          // Task Edit icon
          taskEditIcon.classList.add(
            'fal',
            'fa-regular',
            'fa-pen-to-square',
            'edit-task',
            'task-icon',
            'scale-element',
            'padding-right'
          );
          taskEditIcon.setAttribute('data-project-index', i);
          taskEditIcon.setAttribute('data-task-index', j);
  
          // Task Delete icon
          taskTrashIcon.classList.add(
            'fal',
            'fa-solid', 
            'fa-trash-can',
            'delete-task',
            'task-icon',
            'scale-element',
            'padding-right'
          );
          taskTrashIcon.setAttribute('data-project-index', i);
          taskTrashIcon.setAttribute('data-task-index', j);
  
          // Task Info icon 
          taskInfoIcon.classList.add(
            'fal',
            'task-icon',
            'scale-element',
            'fa-solid', 
            'fa-circle-info'
          );
          taskInfoIcon.setAttribute('data-project-index', i);
          taskInfoIcon.setAttribute('data-task-index', j);
  
          // Appends
          taskIconAndTextDiv.appendChild(taskIcon);
          taskIconAndTextDiv.appendChild(taskText);
          taskInfo.appendChild(taskDate);
          taskInfo.appendChild(taskEditIcon);
          taskInfo.appendChild(taskTrashIcon);
          taskInfo.appendChild(taskInfoIcon);
          taskDiv.appendChild(taskIconAndTextDiv);
          taskDiv.appendChild(taskInfo);
          tasksList.appendChild(taskDiv);
  
          // Task Completion
          if (projects.projectsList[i].tasks[j].completed === false) {
            taskText.classList.remove('task-done-text');
            taskIcon.classList.add(
              'fal',
              'fa-regular',
              'fa-circle',
              'padding-right'
            );
          } else {
            taskText.classList.add('task-done-text');
            taskIcon.classList.add(
              'fal',
              'fa-regular',
              'fa-check-circle',
              'padding-right'
            );
          }
        }
      }
      manipulateModal('close');
    }

    //This function allows to get a specific task
    function getTasks(menuTitle, projectIndex) {
      let projectIndexStart;
      let projectIndexEnd;
  
      // Save projects with tasks to local storage
      localStorage.setItem('projects', JSON.stringify(projects.projectsList));
  
      // If clicked on project link
      if (menuTitle === 'project') {
        projectIndexStart = projectIndex;
        projectIndexEnd = projectIndex + 1;
  
        // If project does not have any task 
        if (projects.projectsList[projectIndex].tasks.length === 0) {
          tasksCount.textContent = 0;
        }
  
        // If clicked on menu link 
      } else {
        projectIndexStart = 0;
        projectIndexEnd = projects.projectsList.length;
      }
      showTasks(menuTitle, projectIndexStart, projectIndexEnd);
    }


    function selectLink(target, index, action) {
      const allLinks = document.querySelectorAll('.link');
      const allProjectsLinks = document.querySelectorAll('.project-link');
      const menuTitle = target.getAttribute('data-title');
  
      addTaskButton.classList.add('hide'); // By default 'Add Task' button is hidden
  
      allLinks.forEach((link) => {
        link.classList.remove('selected-link');
      });
  
      // If clicked directly on the link (Both - Menu or project)
      if (target.classList.contains('link')) {
        target.classList.add('selected-link');
  
        // If was clicked to edit project link 
        if (action === 'edit') {
          allProjectsLinks[index].classList.add('selected-link'); // Keep project visually selected after editing
        }
  
        // If clicked on menu link icon or text
      } else if (
        target.classList.contains('menu-link-icon') ||
        target.classList.contains('menu-link-text')
      ) {
        target.parentElement.classList.add('selected-link');
      }
  
      // If clicked somewhere on project link 
      if (target.classList.contains('project')) {
        addTaskButton.classList.remove('hide'); // Show button to add task for selected project
        getTasks('project', index);
  
        // If clicked on  project icon or text or edit/delete icons
        if (
          target.classList.contains('project-icon') ||
          target.classList.contains('project-text') ||
          target.classList.contains('edit-project') ||
          target.classList.contains('delete-project')
        ) {
          target.parentElement.parentElement.classList.add('selected-link');
  
          // If clicked on project elements divs 
        } else if (
          target.classList.contains('project-icon-and-text-div') ||
          target.classList.contains('project-default-icons-div')
        ) {
          target.parentElement.classList.add('selected-link');
        }
      }
  
      // If clicked somewhere on menu link 
      if (
        target.classList.contains('menu-link') ||
        target.classList.contains('menu-link-icon') ||
        target.classList.contains('menu-link-text')
      ) {
        getTasks(menuTitle);
      }
    }


    //This function allows to check if information provided by the user to the modal window are correct
    function validateModal(modalAction, projectIndex, taskIndex, clickedLink) {
      const { projectFormIcon } = document.forms.form;
      const projectDomIcon = projectFormIcon.value;
      const projectIconsDiv = modal.querySelector('.radio-form');
      const modalTitleText = modalTitle.value;
      const projectDeletionText = document.querySelector('.project-deletion-text');
      const menuLinkAll = document.querySelector('.link:first-child');
      let taskPriority;
  
      // Check for modal title error if modal form is shown 
      if (!form.classList.contains('hide') &&
          modalTitleText === ''
      ) {
        modalTitleError.classList.remove('hide');
        modalTitleError.classList.add('show');
  
        // Add project to array 
      } else if (
        modalAction === 'add' &&
        projectIconsDiv.classList.contains('show')
      ) {
        projects.addProject(projectDomIcon, modalTitleText);
        mainContent.classList.remove('inactive-main');
  
        // Keep newly added project visually selected 
        const lastProject = projectsLinksDiv.lastChild;
        const lastProjectIndex = projectsLinksDiv.lastChild.getAttribute('data-link-index');
  
        selectLink(lastProject, lastProjectIndex);
        changeMainTitle(lastProject, lastProjectIndex);
  
      } // Edit project in projects array 
        else if (modalAction === 'edit' &&
          projectIconsDiv.classList.contains('show')
      ) {
        const allProjectsLinks = document.querySelectorAll('.project-link');
        const editedProject = allProjectsLinks[projectIndex];
  
        projects.editProject(projectDomIcon, modalTitleText, projectIndex, clickedLink);
        changeMainTitle(editedProject, projectIndex);
  
        // Delete project from projects array
      } else if (
        modalAction === 'delete' &&
        !projectDeletionText.classList.contains('hide')
      ) {
        projects.deleteProject(projectIndex);
        menuLinkAll.classList.add('selected-link');
        addTaskButton.classList.add('hide');
  
        // Add task to array
      } else if (
        modalAction === 'add' &&
        projectIconsDiv.classList.contains('hide')
      ) {
  
        // Check task priority
        if (taskPrioritySelection.value === 'low') {
          taskPriority = 'low';
        } else if (taskPrioritySelection.value === 'medium') {
          taskPriority = 'medium';
        } else if (taskPrioritySelection.value === 'high') {
          taskPriority = 'high';
        } else {
          taskPriority = '';
        }
  
        tasks.addTask(
          modalTitleText,
          taskDescription.value,
          taskDueDate.value,
          taskPriority,
          projectIndex
        );
  
        // If task is going to be edited or deleted 
      } else if (modalAction === 'edit' ||
        modalAction === 'delete') {
        let menuTitle;
  
        // If task is going to be edited or deleted from clicked menu link 
        if (clickedLink.classList.contains('menu-link')) {
          menuTitle = clickedLink.getAttribute('data-title');
  
          // If task is going to be edited or deleted from clicked project link 
        } else if (clickedLink.classList.contains('project-link')) {
          menuTitle = 'project';
        }
  
        // Edit task in tasks array
        if (modalAction === 'edit') {
          const taskNewTitle = modalTitle.value;
          const taskNewDescription = taskDescription.value;
          const taskNewDate = taskDueDate.value;
          const taskNewPriority = taskPrioritySelection.value;
  
          tasks.editTask(
            taskNewTitle,
            taskNewDescription,
            taskNewDate,
            taskNewPriority,
            projectIndex,
            taskIndex
          );
  
          // Delete task from tasks array
        } else if (modalAction === 'delete') {
          tasks.deleteTask(projectIndex, taskIndex);
        }
        getTasks(menuTitle, projectIndex);
      }
    }


    //This function allows to display the projects in the navbar
    function showProjects() {
      const projectsCount = document.querySelector('.projects-count');
  
      // Save projects to local storage
      localStorage.setItem('projects', JSON.stringify(projects.projectsList));
  
      // Show number of projects 
      projectsCount.textContent = projects.projectsList.length;
      projectsLinksDiv.textContent = '';
  
      for (let i = 0; i < projects.projectsList.length; i += 1) {
        const projectLink = document.createElement('a');
        const projectIconAndTextDiv = document.createElement('div');
        const projectIcon = document.createElement('i');
        const projectText = document.createElement('p');
        const projectIconsDiv = document.createElement('div');
        const projectEditIcon = document.createElement('i');
        const projectTrashIcon = document.createElement('i');
  
        // Project icon/text and default icons divs 
        projectIconAndTextDiv.classList.add(
          'project-icon-and-text-div',
          'project',
          'select'
        );
        projectIconAndTextDiv.setAttribute('data-link-index', i);
        projectIconsDiv.classList.add(
          'project-default-icons-div',
          'project',
          'select'
        );
        projectIconsDiv.setAttribute('data-link-index', i);
  
        // Project link
        projectLink.classList.add('link', 'project-link', 'project', 'select');
        projectLink.setAttribute('href', '#');
        projectLink.setAttribute('data-link-index', i);
  
        // Project icon 
        projectIcon.classList.add(
          'fa-solid',
          'fa-fw',
          'project-icon',
          'project',
          'select',
          'padding-right',
          projects.projectsList[i].icon
        );
        projectIcon.setAttribute('data-link-index', i);
  
        // Project text 
        projectText.classList.add('project-text', 'project', 'select');
        projectText.textContent = projects.projectsList[i].title;
        projectText.setAttribute('data-link-index', i);
  
        // Project default icons 
        projectEditIcon.classList.add(
          'fal',
          'fa-regular',
          'fa-pen-to-square',
          'project',
          'project-icon',
          'edit-project',
          'select',
          'scale-element',
          'padding-right'
        );
        projectEditIcon.setAttribute('data-link-index', i);
  
        projectTrashIcon.classList.add(
          'fal',
          'fa-solid', 
          'fa-trash-can',
          'project',
          'project-icon',
          'delete-project',
          'select',
          'scale-element'
        );
        projectTrashIcon.setAttribute('data-link-index', i);
  
        // Appends
        projectIconsDiv.appendChild(projectEditIcon);
        projectIconsDiv.appendChild(projectTrashIcon);
        projectIconAndTextDiv.appendChild(projectIcon);
        projectIconAndTextDiv.appendChild(projectText);
        projectLink.appendChild(projectIconAndTextDiv);
        projectLink.appendChild(projectIconsDiv);
        projectsLinksDiv.appendChild(projectLink);
      }
      manipulateModal('close');
    }


      return {
        responsiveMenu,
        toggleMenu,
        showMainTitle,
        changeMainTitle,
        manipulateModal,
        showTasks,
        getTasks,
        selectLink,
        validateModal,
        showProjects,
      };

})();