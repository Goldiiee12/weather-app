# to-do list

This is a Basic Todo-List

using date-fns package

Check out live preview here: 

# Functionality

add projects 

rename projects 

change order of projects using drag and drop feature

temporarily hide side panel

add tasks into your projects (title, details, due-date) 

mark or unmark your tasks as completed or important

edit you tasks (title, details, due-date) 

delete you tasks 

display all tasks

display all tasks that is dued today

display all tasks that is dued until next week

display all tasks that are marked important

save all you projects and task to localStorage 

light & Dark mode

# Project Objectives

Todo Item Creation: Implement functionality to dynamically create todo items using factories or constructors/classes. Each todo item should at least include a title, description, due date, and priority. Additional properties like notes or a checklist can also be considered.

Project Management: Implement a system to organize todo items into projects. Include a default project for todos upon application launch. Provide the ability for users to create new projects and assign todos to them.

Application Logic Separation: Separate the application logic (creating todos, marking them as complete, changing priorities, etc.) from the DOM manipulation aspects. Organize these into distinct modules.

User Interface Requirements:

Ability to view all projects.

Ability to view all todos within each project, displaying at least the title, description, due date and priority. Use color coding to indicate different priorities.

Functionality to expand a todo item to view and edit its details.

Option to delete a todo item.

Inspiration and Research: Look at popular todo apps like Todoist, Things, and any.do for design and functionality ideas.

External Libraries: Consider using libraries such as date-fns from npm for date and time manipulation.

Data Persistence: Integrate the Web Storage API to add persistence to the app, ensuring todos and projects are saved locally on the user's computer through localStorage. Implement functions to save new projects/todos and retrieve them on app load.

Error Handling and Debugging:

Ensure the app does not crash if there's no data to retrieve from localStorage.

Remember that localStorage deals with JSON data, which cannot include functions directly. Plan for how to reattach methods to your objects after retrieving them from localStorage.