Example of a distributed app with parts running remotely on [Webtask](https://webtask.io/)'s serverless cluster.

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

* `/application` is a symlink to the ["Rick and Morty" application](../.rick-morty-application). It contains the independent logic of the application (actions, reactions and a controller).
* `/distribution` contains the runners that will respond to the applications' actions, processing the reactions.

## Infrastructure

* reactions running remotely, on [Webtask](https://webtask.io/)'s serverless cluster.
* 1 application instances
* 1 Kafka cluster

![Infrastructure's graph representation](https://g.gravizo.com/source/svg/custom_mark?https%3A%2F%2Frawgit.com%2FQuadric%2Fradiaction%2Fmaster%2Fexamples%2Fwith-webtask%2FREADME.md)
<details> 
<summary></summary>
custom_mark
digraph G {
  subgraph cluster_0 {
    style=filled;
    color="#ffaa00";
    node [style=filled,color=white];
    a0
    a1
    label = "process #1\n[distribution]";
  }
  subgraph cluster_1 {
    color=blue
    node [style=filled,shape=rectangle];
    b0
    b1
    b2
    b3
    label = "message broker";
  }
  subgraph cluster_2 {
    style=filled;
    color="#aaaaff"
    node [style=filled,color=white];
    c0
    c1
    label = "process #2\n[application]";
  }
  subgraph cluster_3 {
    style=filled;
    color="#aaffaa"
    node [style=filled,color=white];
    d0
    d1
    label = "process #3\n[application]";
  }
  subgraph cluster_s0 {
    style=filled;
    color="#ffffaa"
    node [style=filled,color=white];
    s0
    label = "serverless #";
  }
  subgraph cluster_s1 {
    style=filled;
    color="#ffffaa"
    node [style=filled,color=white];
    s1
    label = "serverless #";
  }
  subgraph cluster_s2 {
    style=filled;
    color="#ffffaa"
    node [style=filled,color=white];
    s2
    label = "serverless #";
  }
  subgraph cluster_s3 {
    style=filled;
    color="#ffffaa"
    node [style=filled,color=white];
    s3
    label = "serverless #";
  }
  start[label="start.sh",color=transparent]
  a0[label=<buySauce<br /><font color="#aaaaaa">( wrapper )</font>>]
  s0[label=<buySauce<br /><font color="#aaaaaa">( reaction )</font>>]
  s1[label=<buySauce<br /><font color="#aaaaaa">( reaction )</font>>]
  b0[label="rick-morty__BUY_SAUCE"]
  c0[label=<buySauce<br /><font color="#aaaaaa">( action )</font>>]
  d0[label=<buySauce<br /><font color="#aaaaaa">( action )</font>>]
  a1[label=<bringToFamilyTherapy<br /><font color="#aaaaaa">( wrapper )</font>>]
  s2[label=<bringToFamilyTherapy<br /><font color="#aaaaaa">( reaction )</font>>]
  s3[label=<bringToFamilyTherapy<br /><font color="#aaaaaa">( reaction )</font>>]
  b1[label="rick-morty__BRING_TO_FAMILY_THERAPY"]
  c1[label=<bringToFamilyTherapy<br /><font color="#aaaaaa">( action )</font>>]
  d1[label=<bringToFamilyTherapy<br /><font color="#aaaaaa">( action )</font>>]
  b2[label="rick-morty__BUY_SAUCE.output"]
  b3[label="rick-morty__BRING_TO_FAMILY_THERAPY.output"]
  start -> a0-> a1 [color=transparent];
  start -> b0-> b1 -> b2 -> b3 [color=transparent];
  start -> c0-> c1 [color=transparent];
  start -> d0-> d1 [color=transparent];
  start -> s0 -> s1 -> s2 -> s3 [color=transparent];
  c0 -> b0 -> a0 -> s0 -> a0 -> b2 -> c0 [color="#0000ff"];
  d0 -> b0 -> a0 -> s1 -> a0 -> b2 -> d0 [color="#00ff00"]
  c1 -> b1 -> a1 -> s2 -> a1 -> b3 -> c1 [color="#0000ff"];
  d1 -> b1 -> a1 -> s3 -> a1 -> b3 -> d1 [color="#00ff00"]
}
custom_mark
</details>