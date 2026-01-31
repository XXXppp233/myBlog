---
title: Features & Syntax
date: 2026-01-31
category: Cloudflare
---

# Extended Features

This blog supports extended Markdown syntax and HTML embedding, similar to Cloudflare Docs.

## Video Embeds

You can embed YouTube videos or other iframes directly.

<iframe width="100%" height="400" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Custom Alerts

Use HTML for custom alerts.

<div style="background-color: #FFF0E0; border-left: 4px solid #F38020; padding: 16px; margin: 16px 0;">
  <strong>Note:</strong> This is a custom alert box styled with inline CSS.
</div>

## Code Blocks

Standard Markdown code blocks are supported.

```javascript
function hello() {
  console.log("Hello Cloudflare!");
}
```

## Tables

| Feature | Support |
| :--- | :--- |
| Markdown | Yes |
| HTML Embeds | Yes |
| Vue Components | No (Only HTML) |
