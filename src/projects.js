import { dom } from './dom-manip';

const projects = (() => {
  let projectsList = [];

  // Get default projects and tasks from local storage
  if (localStorage.getItem('projects') === null) {
    projectsList = [
      {
        icon: 'fa-screwdriver-wrench',
        title: 'House Cleaning',
        description:'Project related to house cleaning tasks',
        tasks: [
          {
            title: 'Clean the kitchen ',
            description: 'Clean all surfaces and cooking utensils',
            date: '2023-30-12',
            priority: 'low',
            projectIndex: 0,
            taskIndex: 0,
            completed: false
          }
        ]
      },
      {
        icon: 'fa-pencil',
        title: 'Job Seeking',
        description:'Project related to job seeking',
        tasks: [
          {
            title: 'Apply for a software engineer position',
            description: 'Write a CV and cover letter in order to apply to a software engineer position',
            date: '2024-02-12',
            priority: 'high',
            projectIndex: 1,
            taskIndex: 0,
            completed: false
          }
        ]
      },
    ];
  } 
  else {
    const projectsFromStorage = JSON.parse(localStorage.getItem('projects'));
    projectsList = projectsFromStorage;
  }

  class Project {
    constructor(icon, title, description) {
      this.icon = icon;
      this.title = title;
      this.description = description;
      this.tasks = [];
    }
  }

  function addProject(icon, title, description) {
    const project = new Project(icon, title, description);
    projectsList.push(project);
    dom.showProjects();
  }

  function editProject(icon, title, description, index, link) {
    projectsList[index].icon = icon;
    projectsList[index].title = title;
    projectsList[index].description = description;
    dom.showProjects();
    dom.selectLink(link, index, 'edit');
  }

  function deleteProject(index) {
    if (index > -1) {
      projectsList.splice(index, 1);
    }
    dom.showProjects();
  }

  return {
    projectsList,
    addProject,
    editProject,
    deleteProject,
  };
})();

export default projects;