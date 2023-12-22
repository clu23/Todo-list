import dom from './dom-manip';

const projects = (() => {
  let projectsList = [];

  // GET DEFAULT PROJECTS AND TASKS FROM LOCAL STORAGE
  if (localStorage.getItem('projects') === null) {
    projectsList = [
      {
        icon: 'fa-tools',
        title: 'Default Project',
        description:'An important project',
        tasks: [
          {
            title: 'Enjoy my tea as much as my coding! 🍵',
            description: 'Longer description of my demo task, just to show you this surprisingly nice scrollbar and amazingly cute kitty ฅ(^◉ᴥ◉^)ฅ',
            date: '2011-11-11',
            priority: 'low',
            projectIndex: 0,
            taskIndex: 0,
            completed: false
          }
        ]
      },
      {
        icon: 'fa-tools',
        title: 'Craft Another Project',
        description:'Another important project',
        tasks: [
          {
            title: 'Create magic through my mind, my heart and my keyboard.. 👩🏻‍💻',
            description: 'Another longer description of my demo task, just to show you this surprisingly nice scrollbar and cute little birdie ϵ( ‘Θ’ )϶♪♫',
            date: '2012-12-12',
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