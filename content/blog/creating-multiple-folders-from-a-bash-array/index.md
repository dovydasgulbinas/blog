---
title: "Creating Multiple Folders From a Bash Array"
date: 2021-09-11
description: "A one-line Bash snippet that creates a directory for every element of an array, without writing a loop."
categories: ["linux"]
cover: "cover.png"
---

This snippet allows you to create a series of directories, that are a part of a
regular bash array.
It is useful if you have a number of directories to create and without using a loop.

```bash
#!/bin/bash


var="eins"
var2="zwei"

play_array=("$var" "$var2")

mkdir "${play_array[@]}"
```

Directories created:
```
.
├── eins/
└── zwei/
```
