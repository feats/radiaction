Simplistic app to demonstrate the action/reaction model. It simulates Rick & Morty's family ordering sauces at McDonald's and going to family therapy.

It's used as the base of many examples, but, if ran alone, it will be hanging waiting for the reactions to be executed somewhere else. Instead, check one of the following examples to see this app running properly:

* [basic-example](../basic-example)
* [with-glob-loader](../with-glob-loader)
* [with-webtask](../with-webtask)

## Code Structure

* `actions.js` define the actions that can be called in this app
* `definitions.js` constants and settings used in the app
* `index.js` contains the main logic of the app (calls the actions)
* `reactions.js` define what should be returned when an action is called

## Nerd culture

All actions are named after references found in Rick & Morty:

* `buySauce`: from Rick and Morty S3E1 - The Rickshank Rickdemption
* `bringToFamilyTherapy`: from Rick and Morty S3E3 - Pickle Rick.
