# Task Management Test

## Basic outline and assumptions

The application was written in Angular 19.

I've opted to use SCSS, which is a conscious decision even though there is no need for it in this application; it would help with extensibility later on.

Given the basic nature of the challenge/test, I've decided to try Tailwind as it's fit for purpose and perfect for prototyping. (I've not used it before but get the gist working with Bootstrap in the past)

Data is not stored either via a database or local storage.

### Pros and cons of Tailwind

**PROS**

-   Quick prototyping
-   Large utility class list
-   Mobile and responsive design friendly

**CONS**

-   It's super verbose in the template
-   Hard to remember what classes are available sometimes

## Feature overview

I've built the app to be open and extensible in the _Angular_ way.

-   Priority filter
-   Create task dialog leveraging reactive typed forms
-   Responsive design
-   Leveraging Angular's signals for simple state management

**BONUS FEATURES**

-   Completed list with expander
-   Angular CDK drag and drop to reorder cards

## Component structure

All components are under the `app/components` directory. This means we can continue to add _global_ components that can be used throughout the app.

I generally include a `typings` folder in the immediate directory where the items of the folder are being used. `typings` essentially covers any typed model, interface, or other file that can be exported and reused.

## Running the project

Firstly run `npm install`.

Nothing fancy here, just `ng serve --no-hmr`.

If you want to run the tests, just `ng test`.

### Requirements

**Angular**: 19.2.x
**Node.js**: ^18.19.1 || ^20.11.1 || ^22.0.0
