---
{{- $title := getenv "HUGO_POST_TITLE" | default (replace .File.ContentBaseName "-" " " | title) }}
title: "{{ replace (replace $title `\` `\\`) `"` `\"` }}"
date: {{ .Date }}
draft: true
description: "One or two sentences, 50–160 characters, for search results and link previews."
categories: ["python"]
# cover: "cover.png"
---

Intro paragraph.

<!--more-->

## First section
