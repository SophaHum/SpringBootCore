# Fix Full-Screen Layout for Login Page

## Problem

The login page (and register page) are not rendering as true full-screen pages. The root cause is that Angular custom elements (`<app-root>`, `<app-login>`, etc.) are **inline elements by default** and don't fill the viewport. This creates a layout chain issue:

```
<html>          → 100% width/height ✓
  <body>        → 100% width/height ✓
    <app-root>  → inline element, NOT full width/height ✗
      <app-login> → inline element, NOT full width/height ✗
        <div class="login-container"> → 100vw/100vh but constrained by parents
```

Even though `.login-container` uses `100vw` and `100vh`, the parent custom elements don't properly participate in the layout flow, causing visual issues.

## Solution

The fix requires making the Angular host elements properly fill the viewport by adding CSS styles at two levels:

### File Changes

#### 1. `src/styles.css` — Add global styles for `app-root`

Add `display: block`, `width: 100%`, `height: 100%`, and `margin: 0` / `padding: 0` to `body` and `app-root` so the entire element chain from `<html>` down to `<app-root>` fills the viewport.

```css
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

app-root {
  display: block;
  width: 100%;
  height: 100%;
}
```

#### 2. `src/app/app.css` — Make the app component fill its host

Set the `:host` selector to `display: block` with `width: 100%` and `height: 100%` so the component itself fills the `<app-root>` element.

```css
:host {
  display: block;
  width: 100%;
  height: 100%;
}
```

#### 3. `src/app/pages/login/login.component.css` — Add `:host` display block

Add a `:host` rule so the `<app-login>` custom element is a block element filling its parent:

```css
:host {
  display: block;
  width: 100%;
  height: 100%;
}
```

#### 4. `src/app/pages/register/register.component.css` — Same fix for register

Add the same `:host` rule for consistency:

```css
:host {
  display: block;
  width: 100%;
  height: 100%;
}
```

### Why This Works

The layout chain becomes:

```
<html>          → 100% width/height ✓
  <body>        → 100% width/height, margin: 0 ✓
    <app-root>  → display: block, 100% width/height ✓
      <app-login> → display: block, 100% width/height ✓
        <div class="login-container"> → 100vw/100vh, fully visible ✓
```

### What Won't Break

- The home page already uses `min-height: 100vh` on `.home-container`, so it will continue to work correctly
- The dashboard page will also be unaffected
- No template changes are needed — only CSS changes
