---
title: "Truncate Text In Lektor"
date: 2022-05-08
lastmod: 2022-05-23
description: "A Jinja snippet that strips HTML from a Lektor Markdown body and truncates it to make blog post previews."
categories: ["python"]
cover: "cover.png"
---

In this example, variable `post` is an instance of `Markdown`.
Snippet was tested with Jinja3 template engine.
I use it for generating my blog entry previews.


```
{{ post.body.html | striptags | truncate(length=200, killwords=False, end='...') }}
```

- `post.body.html`: is the Lektor object containing regular string or HTML text.
- `striptags`:  Removes all HTML markup and returns pure text. [docs](https://jinja.palletsprojects.com/en/3.1.x/templates/#jinja-filters.striptags)
-  `truncate(length=200, killwords=False, end='...')`: truncate text  to 200 symbols, stop at the nearest word that fits this length, and add "..." in the end of the truncated string. [docs](https://jinja.palletsprojects.com/en/3.1.x/templates/#jinja-filters.truncate)
