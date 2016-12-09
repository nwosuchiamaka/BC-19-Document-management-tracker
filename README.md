#DocTracker

##Introduction
DocTracker is an express powered document management/tracking application.
It has the following features:
1. user authentication
2. Add documents to repo with title, link to document (google drive, dropbox, etc.), keywords and category.
3. Search for documents fast using keywords, category, title, date and name.
4. Click here to access the app on [Heroku](htpp://document-management-tracker.heroku.com)


# Dependencies
## Back End Dependencies
This app’s functionality depends on multiple JavaScript  packages including:
1. Express- This framework helps in handling routing for the application.
2. Express – Sessions- This is one of the middlewares for express that is responsible for handling user sessions.
3. Body paser- This is also a middle ware for express that retrieves data from a user’s form by intercepting and processing HTTP requests.
4. Firebase- This platform was used for persistent storage of all data for this app.

## Front End Dependencies
1. Bootstrap and Material – This framework was used for the user interface (UI).
2. Ejs – This templating engine was used to generate HTML mark-up with plain JavaScript.
5. JQuery- This JavaScript library was used by material design and bootstrap framework.


## Installation and Setup
   1. Download and install [Node.js](https://nodejs.org/en/download/) if not already installed.
   2. Clone or download the zip-file for this [repository](https://github.com/nwosuchiamaka/BC-19-Document-management-tracker.git)
   3. On the terminal, navigate to the directory invertedIndex
   4. Run ```npm install``` to install dependencies
   5. Run ``node server.js`` to start the application