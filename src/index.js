import {dom} from './dom-manip';
import handlers from './handlers';

// When page is loaded - Show title from menu link "All" 
dom.showMainTitle(0);



// When page is loaded - Show all default projects
dom.showProjects();

// When page is loaded - Show all tasks from all default projects 
 dom.getTasks('all');

dom.responsiveMenu();
handlers.resizeWindow();
handlers.listenClicks();





