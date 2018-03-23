Example of a simple app that simulates Rick & Morty's family ordering sauces at McDonald's and going to family therapy.

[![Screencast](https://j.gifs.com/9Q7OjP.gif)](https://j.gifs.com/gLV6M6.gif)

## Plug and play

Single command execution:

```bash
$ ./start.sh
```

Dependencies:

* npm
* docker
* xterm

## Code Structure

* `/application` is a symlink to the [rick-morty-application](../.rick-morty-application). It contains the independent logic of the application (actions, reactions and a controller).
* `/distribution` contains the runners that will respond to the applications' actions, processing the reactions.

## Infrastructure

* reactions running remotely, on [Webtask](https://webtask.io/)'s serverless cluster.
* 1 application instances
* 1 Kafka cluster
