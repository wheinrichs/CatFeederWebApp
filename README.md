# Pet Feeder Project

**Author:** Winston Heinrichs  
**Date:** December 1, 2024  

_This code is deployed on Netlify and does not need to be cloned to run the application. It is made public here purely for educational and transparency purposes._  

This repository defines the front-end React web application for the Pet Feeder Project. The project is deployed on Netlify at:  

[https://petfeeder.netlify.app/](https://petfeeder.netlify.app/)  

This application uses React and Bootstrap to create and run the web application. It communicates with a backend server hosted on Render, which can be viewed here:  

[https://github.com/wheinrichs/CatFeederWebServer](https://github.com/wheinrichs/CatFeederWebServer)  

Thank you for reviewing this project. You can also [view my portfolio here](https://www.winstonheinrichs.com).

---

## Table of Contents

1. [Project Features](#project-features)
    - [Front-End Components](#front-end-components)
        - [Login](#login-logintsx)
        - [Sign Up](#sign-up-signuptsx)
        - [App Structure and Security](#app-structure-and-security-apptsx)
        - [Camera Feed](#camera-feed-camerafeedindextsx)
        - [Feeder Settings](#feeder-settings-feedersettingsindextsx)
2. [Development Instructions](#development-instructions)
    - [`npm start`](#npm-start)
    - [`npm test`](#npm-test)
    - [`npm run build`](#npm-run-build)
    - [`npm run eject`](#npm-run-eject)
3. [Learn More](#learn-more)

---

## Project Features

### Front-End Components
- **Login (`Login.tsx`)**  
  Handles the login flow and automatically routes to the user's homepage if recently logged in.  
  - Assigns user information, session tokens, and access tokens to local storage for authentication.  

- **Sign Up (`SignUp.tsx`)**  
  Defines the sign-up screen, including password requirements and username availability checks.  

- **App Structure and Security (`App.tsx`)**  
  Outlines the overall app structure and prevents unauthorized users from accessing protected routes.  

- **Camera Feed (`CameraFeed/index.tsx`)**  
  Manages the logic for accessing the Google Drive folder, live feed, and streaming videos.  
  - Utilizes access and session tokens for authentication.  

- **Feeder Settings (`FeederSettings/index.tsx`)**  
  Defines the feeder options screen where users can update feeding times and quantities.  

> **Note:** All communication with the backend server (and database) is handled in the respective client file.

---

## Development Instructions

In the project directory, you can run:

### `npm start`
Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.  

The page will reload if you make edits. You will also see lint errors in the console.  

### `npm test`
Launches the test runner in the interactive watch mode.  
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.  

### `npm run build`
Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.  

The build is minified, and the filenames include hashes.  
Your app is ready to be deployed!  

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.  

### `npm run eject`
**Note:** This is a one-way operation. Once you `eject`, you can’t go back!  

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.  

It will copy all configuration files and transitive dependencies (e.g., Webpack, Babel, ESLint) directly into your project, giving you full control. All other commands will still work, but will reference the copied scripts for customization.  

---

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).  

To learn React, check out the [React documentation](https://reactjs.org/).  
