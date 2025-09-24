# Code (`@webwriter/code@3.0.1`)
[License: MIT](LICENSE) | Version: 3.0.1

Write and run code as a code cell. Supports several languages (HTML, JavaScript/TypeScript, Python, Java, WebAssembly).

## Snippets
[Snippets](https://webwriter.app/docs/snippets/snippets/) are examples and templates using the package's widgets.

| Name | Import Path |
| :--: | :---------: |
| HTML | @webwriter/code/snippets/HTML.html |



## `CodeHTML` (`<webwriter-code-html>`)
Code widget for HTML with live preview functionality.

### Usage

Use with a CDN (e.g. [jsdelivr](https://jsdelivr.com)):
```html
<link href="https://cdn.jsdelivr.net/npm/@webwriter/code/widgets/webwriter-code-html.css" rel="stylesheet">
<script type="module" src="https://cdn.jsdelivr.net/npm/@webwriter/code/widgets/webwriter-code-html.js"></script>
<webwriter-code-html></webwriter-code-html>
```

Or use with a bundler (e.g. [Vite](https://vite.dev)):

```
npm install @webwriter/code
```

```html
<link href="@webwriter/code/widgets/webwriter-code-html.css" rel="stylesheet">
<script type="module" src="@webwriter/code/widgets/webwriter-code-html.js"></script>
<webwriter-code-html></webwriter-code-html>
```

## Editing config
| Name | Value |
| :--: | :---------: |


*The [editing config](https://webwriter.app/docs/packages/configuring/#editingconfig) defines how explorable authoring tools such as [WebWriter](https://webwriter.app) treat the widget.*

*No public fields, methods, slots, events, custom CSS properties, or CSS parts.*


## `CodeJavaScript` (`<webwriter-code-javascript>`)
Code widget for JavaScript with execution capabilities.

### Usage

Use with a CDN (e.g. [jsdelivr](https://jsdelivr.com)):
```html
<link href="https://cdn.jsdelivr.net/npm/@webwriter/code/widgets/webwriter-code-javascript.css" rel="stylesheet">
<script type="module" src="https://cdn.jsdelivr.net/npm/@webwriter/code/widgets/webwriter-code-javascript.js"></script>
<webwriter-code-javascript></webwriter-code-javascript>
```

Or use with a bundler (e.g. [Vite](https://vite.dev)):

```
npm install @webwriter/code
```

```html
<link href="@webwriter/code/widgets/webwriter-code-javascript.css" rel="stylesheet">
<script type="module" src="@webwriter/code/widgets/webwriter-code-javascript.js"></script>
<webwriter-code-javascript></webwriter-code-javascript>
```

## Methods
| Name | Description | Parameters |
| :--: | :---------: | :-------: |
| `build` | - | `code: string`

*[Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions) allow programmatic access to the widget.*

## Editing config
| Name | Value |
| :--: | :---------: |


*The [editing config](https://webwriter.app/docs/packages/configuring/#editingconfig) defines how explorable authoring tools such as [WebWriter](https://webwriter.app) treat the widget.*

*No public fields, slots, events, custom CSS properties, or CSS parts.*


## `CodeJava` (`<webwriter-code-java>`)
Code widget for Java with compilation and execution capabilities using TeaVM (Java 21).

### Usage

Use with a CDN (e.g. [jsdelivr](https://jsdelivr.com)):
```html
<link href="https://cdn.jsdelivr.net/npm/@webwriter/code/widgets/webwriter-code-java.css" rel="stylesheet">
<script type="module" src="https://cdn.jsdelivr.net/npm/@webwriter/code/widgets/webwriter-code-java.js"></script>
<webwriter-code-java></webwriter-code-java>
```

Or use with a bundler (e.g. [Vite](https://vite.dev)):

```
npm install @webwriter/code
```

```html
<link href="@webwriter/code/widgets/webwriter-code-java.css" rel="stylesheet">
<script type="module" src="@webwriter/code/widgets/webwriter-code-java.js"></script>
<webwriter-code-java></webwriter-code-java>
```

## Editing config
| Name | Value |
| :--: | :---------: |


*The [editing config](https://webwriter.app/docs/packages/configuring/#editingconfig) defines how explorable authoring tools such as [WebWriter](https://webwriter.app) treat the widget.*

*No public fields, methods, slots, events, custom CSS properties, or CSS parts.*


## `CodeTypeScript` (`<webwriter-code-typescript>`)
Code widget for TypeScript with compilation and execution capabilities.

### Usage

Use with a CDN (e.g. [jsdelivr](https://jsdelivr.com)):
```html
<link href="https://cdn.jsdelivr.net/npm/@webwriter/code/widgets/webwriter-code-typescript.css" rel="stylesheet">
<script type="module" src="https://cdn.jsdelivr.net/npm/@webwriter/code/widgets/webwriter-code-typescript.js"></script>
<webwriter-code-typescript></webwriter-code-typescript>
```

Or use with a bundler (e.g. [Vite](https://vite.dev)):

```
npm install @webwriter/code
```

```html
<link href="@webwriter/code/widgets/webwriter-code-typescript.css" rel="stylesheet">
<script type="module" src="@webwriter/code/widgets/webwriter-code-typescript.js"></script>
<webwriter-code-typescript></webwriter-code-typescript>
```

## Methods
| Name | Description | Parameters |
| :--: | :---------: | :-------: |
| `build` | - | `code: string`

*[Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions) allow programmatic access to the widget.*

## Editing config
| Name | Value |
| :--: | :---------: |


*The [editing config](https://webwriter.app/docs/packages/configuring/#editingconfig) defines how explorable authoring tools such as [WebWriter](https://webwriter.app) treat the widget.*

*No public fields, slots, events, custom CSS properties, or CSS parts.*


## `CodePython` (`<webwriter-code-python>`)
Code widget for Python with execution capabilities using Pyodide.

### Usage

Use with a CDN (e.g. [jsdelivr](https://jsdelivr.com)):
```html
<link href="https://cdn.jsdelivr.net/npm/@webwriter/code/widgets/webwriter-code-python.css" rel="stylesheet">
<script type="module" src="https://cdn.jsdelivr.net/npm/@webwriter/code/widgets/webwriter-code-python.js"></script>
<webwriter-code-python></webwriter-code-python>
```

Or use with a bundler (e.g. [Vite](https://vite.dev)):

```
npm install @webwriter/code
```

```html
<link href="@webwriter/code/widgets/webwriter-code-python.css" rel="stylesheet">
<script type="module" src="@webwriter/code/widgets/webwriter-code-python.js"></script>
<webwriter-code-python></webwriter-code-python>
```

## Editing config
| Name | Value |
| :--: | :---------: |


*The [editing config](https://webwriter.app/docs/packages/configuring/#editingconfig) defines how explorable authoring tools such as [WebWriter](https://webwriter.app) treat the widget.*

*No public fields, methods, slots, events, custom CSS properties, or CSS parts.*


## `CodeWebAssembly` (`<webwriter-code-webassembly>`)
Code widget for WebAssembly with compilation and execution capabilities.

### Usage

Use with a CDN (e.g. [jsdelivr](https://jsdelivr.com)):
```html
<link href="https://cdn.jsdelivr.net/npm/@webwriter/code/widgets/webwriter-code-webassembly.css" rel="stylesheet">
<script type="module" src="https://cdn.jsdelivr.net/npm/@webwriter/code/widgets/webwriter-code-webassembly.js"></script>
<webwriter-code-webassembly></webwriter-code-webassembly>
```

Or use with a bundler (e.g. [Vite](https://vite.dev)):

```
npm install @webwriter/code
```

```html
<link href="@webwriter/code/widgets/webwriter-code-webassembly.css" rel="stylesheet">
<script type="module" src="@webwriter/code/widgets/webwriter-code-webassembly.js"></script>
<webwriter-code-webassembly></webwriter-code-webassembly>
```

## Editing config
| Name | Value |
| :--: | :---------: |


*The [editing config](https://webwriter.app/docs/packages/configuring/#editingconfig) defines how explorable authoring tools such as [WebWriter](https://webwriter.app) treat the widget.*

*No public fields, methods, slots, events, custom CSS properties, or CSS parts.*


---
*Generated with @webwriter/build@1.8.1*