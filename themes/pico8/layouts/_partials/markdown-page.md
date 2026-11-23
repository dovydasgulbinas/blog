{{- /* One page as Markdown: a short header, then the source exactly as written. */ -}}
# {{ .Title }}
{{ with .Description }}
> {{ . }}
{{ end }}
- URL: {{ .Permalink }}
{{- if and .IsPage (not .Date.IsZero) }}
- Published: {{ .Date.Format "2006-01-02" }}
{{- if gt .Lastmod .Date }} (updated {{ .Lastmod.Format "2006-01-02" }}){{ end }}
{{- end }}
{{- with .GetTerms "categories" }}
- Category: {{ range $i, $t := . }}{{ if $i }}, {{ end }}{{ $t.LinkTitle }}{{ end }}
{{- end }}
{{- with .Params.track }}
- Audio: {{ (path.Join $.RelPermalink .) | absURL }}
{{- end }}
{{- if eq .Section "projects" }}
- Runs in the browser; open the URL above to use it.
{{- end }}

{{ .RawContent | strings.TrimSpace }}
{{- if eq .Layout "contact" }}{{ range site.Params.contacts }}
- {{ .name }} ({{ .note }}): {{ range $i, $l := .links }}{{ if $i }}, {{ end }}[{{ $l.label }}]({{ if hasPrefix $l.url "/" }}{{ $l.url | absURL }}{{ else }}{{ $l.url }}{{ end }}){{ end }}
{{- end }}
{{- end }}
