<h1 align="center"><img src=".github/representation.jpg" width="200" /><br>radi<font color="orange">action</font></h1>

<p align="center">
<strong>Powerful nodejs library for building seamless distributed applications.</strong><br />
<sub>Radiaction makes it painless for Developers to write distributed apps and for DevOps to keep everything running.</sub>
</p>
<br />

* **Agnosticism:** With _Radiaction_, developers don't need to know _how_/_where_/_when_ their distributed functions will be running.

* **Modularity:** Encapsulated modules containing actions and reactions next to each other allow developers to keep coding with the mindset of a non distributed application.

* **Separation of concerns:** DevOps don't need to interfere on how developers are writting their functions. Scaling and even changing the infrasctructure can be done independently by DevOps with no change in the application code.

![divider](.github/divider.png)

[Check our examples](./examples)

## API

### Higher-order functions

#### emitter

```typescript
emitter(actionsMap: Object): Object
```

For each action, wraps it with a function that:

* when called, dispatches a message to the broker, ultimately triggering the subscribed reaction.
* returns the location of the dispatched message in the broker (async/promise).

#### topicfy

```typescript
topicfy(moduleName: String)(actionsMap: Object): Object
```

Sanitizes the functions names while combining them with the provided key (`moduleName`). The resulting function names can be used as _topic_ names.

#### waiter

```typescript
waiter(actionsMap: Object): Object
```

For each action, wraps it with a function that:

* when called, notifies the broker that the given action is waiting for the output of its respective reaction.
* returns the output of its respective reaction once its available (async/promise).

### Utilities

#### compose

Composes functions from right to left. You might want to use it to compose multiple higher-order functions into a single higher-order function.

This is a functional programming utility, and is included here as a convenience. It works exactly like the function of the same name in [Recompose](https://github.com/acdlite/recompose/blob/master/docs/API.md#compose), [Redux](https://github.com/reactjs/redux/blob/master/docs/api/compose.md), or [lodash's `flowRight()`](https://lodash.com/docs/4.17.5#flowRight).

```typescript
compose(...functions: Array<Function>)
```
