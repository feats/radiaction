Simplistic app to demonstrate the action/reaction model.

It's used as base to the construction of many examples, but it's not intended to be run alone. Check one of the following examples to see this app in action:

* [basic-example](../basic-example)
* [with-glob-loader](../with-glob-loader)
* [with-webtask](../with-webtask)

## Code Structure

* `/application` is a symlink to the ["Rick and Morty" application](../.rick-morty-application). It contains the independent logic of the application (actions, reactions and a controller).
* `/distribution` contains the runners that will respond to the applications' actions, processing the reactions.

* `actions.js` define the actions that can be called in this app
* `definitions.js` constants and settings used in the app
* `index.js` contains the main logic of the app (calls the actions)
* `reactions.js` define what should be returned when an action is called

## Nerd culture

All actions are named after references found in Rick & Morty:

* `buySauce`: from Rick and Morty S3E1 - The Rickshank Rickdemption
* `bringToFamilyTherapy`: from Rick and Morty S3E3 - Pickle Rick.
