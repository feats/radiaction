Example of a simple app that simulates Rick & Morty's family ordering sauces at McDonald's and going to family therapy.

[![Screencast](https://j.gifs.com/9Q7OjP.gif)](https://j.gifs.com/gLV6M6.gif)

## Plug and play

Single command execution:

```bash
$ ./start.sh
```

Requirements:

* docker
* xterm

## Code Structure

* `/applications` contains the logic of the application (actions, reactions and a controller).
* `/distribution` contains the runners that will respond to the clients' actions, processing the reactions.

## Infrastructure

* 3 application instances
* 1 reactions runner
* 1 Kafka cluster
