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

Provides a specialized code editor for HTML content with real-time preview capabilities.
When code is executed, it displays the HTML output in a sandboxed iframe, allowing
users to see the visual results of their HTML code immediately.

## Key Features
- **HTML syntax highlighting** with CodeMirror's HTML language support
- **Live preview** - HTML output displayed in sandboxed iframe
- **Safe execution** - Uses iframe sandbox for security
- **Inherited functionality** - All base Code component features (visibility, auto-run, etc.)

## Security
The HTML preview is displayed in an iframe with `sandbox="allow-scripts allow-modals"`
which provides a secure execution environment while allowing interactive HTML content.

## Usage Examples

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

Provides a comprehensive JavaScript development environment with real-time execution,
console output capture, and rich object inspection. Uses a sandboxed web worker
for safe code execution while maintaining full access to JavaScript language features
and built-in objects.

## Key Features
- **Modern JavaScript support** - ES2022+ syntax and features
- **Console integration** - Full console.log, warn, error, and other methods
- **Object inspection** - Rich display of objects, arrays, and complex data types
- **Error handling** - Runtime error capture with stack traces
- **Sandboxed execution** - Safe execution environment using web workers
- **Real-time output** - Live console output as code executes
- **Interactive debugging** - Expandable object trees and detailed value display
- **Inherited functionality** - All base Code component features

## JavaScript Environment
The JavaScript execution environment runs in a dedicated web worker, providing:
- Isolation from the main thread for performance and security
- Access to standard JavaScript built-ins and Web APIs
- Console output capture and formatting
- Error handling with detailed stack traces
- Object serialization for rich display

## Execution Model
1. JavaScript code is sent to a web worker for execution
2. Console methods (log, warn, error) are intercepted and captured
3. Values are serialized with type information for rich display
4. Objects can be expanded on-demand for inspection
5. Errors are caught and formatted with line number information

## Console Features
The component captures and displays all console output with:
- **console.log()** - Standard output with value formatting
- **console.warn()** - Warning messages with appropriate styling
- **console.error()** - Error messages with stack traces
- **console.clear()** - Clears the output display
- **Return values** - Expression results displayed automatically

## Usage Examples

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

## Editing config
| Name | Value |
| :--: | :---------: |


*The [editing config](https://webwriter.app/docs/packages/configuring/#editingconfig) defines how explorable authoring tools such as [WebWriter](https://webwriter.app) treat the widget.*

*No public fields, methods, slots, events, custom CSS properties, or CSS parts.*


## `CodeJava` (`<webwriter-code-java>`)
Code widget for Java with compilation and execution capabilities using TeaVM (Java 21).

Provides a full Java development environment in the browser using TeaVM to compile
Java source code to WebAssembly and JavaScript. Supports modern Java language
features up to Java 21, with compilation and execution happening entirely client-side.

## Key Features
- **Java 21 language support** with modern syntax and features
- **Client-side compilation** - No server required for Java development
- **Real-time execution** with output capture and display
- **Compilation error reporting** with line-by-line diagnostics
- **TeaVM-powered** - Mature Java-to-WebAssembly/JavaScript transpiler
- **Standard library support** - Core Java classes and utilities
- **Inherited functionality** - All base Code component features

## Java Environment
The Java environment uses TeaVM to compile Java source code to JavaScript/WebAssembly
for execution in the browser. This provides good performance while maintaining
compatibility with standard Java syntax and core library classes.

## Compilation Process
1. Java source code is sent to a web worker running the Java compiler
2. TeaVM compiles the code to JavaScript/WebAssembly
3. Compilation errors are reported with line numbers and descriptions
4. Successfully compiled code is executed and output is captured

## Performance Considerations
- Initial compilation may take a moment as the compiler initializes
- Subsequent compilations are faster with the warm compiler
- Large programs or complex computations perform well via WebAssembly
- Memory usage is managed by the browser's JavaScript engine

## Usage Examples

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

Provides a comprehensive TypeScript development environment with client-side compilation
to JavaScript and real-time execution. Uses the official TypeScript compiler for
type checking and code transformation, providing a full-featured TypeScript experience
in the browser.

## Key Features
- **Full TypeScript support** - Complete TypeScript language features and syntax
- **Client-side compilation** - TypeScript to JavaScript compilation in the browser
- **Type checking** - Real-time type error detection and reporting
- **Modern JavaScript output** - Compiles to modern JavaScript for execution
- **Compilation diagnostics** - Detailed error messages with line numbers
- **Console integration** - Full console output capture like JavaScript widget
- **Object inspection** - Rich display of typed objects and complex data
- **Strict mode compilation** - Enhanced type safety with strict TypeScript settings
- **Inherited functionality** - All JavaScript widget features plus TypeScript compilation

## TypeScript Environment
The TypeScript environment provides:
- Full TypeScript language server capabilities
- Strict type checking with compiler options
- CommonJS module output for browser execution
- Compilation error reporting with precise locations
- Type-aware syntax highlighting

## Compilation Process
1. TypeScript source code is written by the user
2. The TypeScript compiler (`transpileModule`) processes the code
3. Type errors are collected and displayed with line/column information
4. Successfully compiled JavaScript is executed in a web worker
5. Console output and results are displayed with rich formatting

## Compiler Configuration
The TypeScript compiler is configured with:
- **Module system**: CommonJS for browser compatibility
- **Strict mode**: Enabled for enhanced type safety
- **Diagnostic reporting**: Full error and warning reporting
- **Target**: Modern JavaScript output

## Usage Examples

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

## Editing config
| Name | Value |
| :--: | :---------: |


*The [editing config](https://webwriter.app/docs/packages/configuring/#editingconfig) defines how explorable authoring tools such as [WebWriter](https://webwriter.app) treat the widget.*

*No public fields, methods, slots, events, custom CSS properties, or CSS parts.*


## `CodePython` (`<webwriter-code-python>`)
Code widget for Python with execution capabilities using Pyodide.

Provides a comprehensive Python code editor with full execution support via Pyodide,
a Python distribution for the browser. Supports most Python standard library
functionality and many popular packages like NumPy, Pandas, and Matplotlib.

## Key Features
- **Full Python 3.x support** via Pyodide WebAssembly runtime
- **Rich library ecosystem** - Access to NumPy, Pandas, Matplotlib, and more
- **Real-time execution** with output capture and display
- **Error reporting** with line-by-line diagnostics
- **Package installation** support for pure Python packages
- **Matplotlib integration** for data visualization
- **Inherited functionality** - All base Code component features

## Python Environment
The Python environment is isolated and runs entirely in the browser using WebAssembly.
Each execution creates a fresh context, so variables don't persist between runs
unless explicitly managed by the execution environment.

## Performance Considerations
- Initial load may take time as Pyodide is downloaded and initialized
- Large computations run entirely in the browser
- Memory is limited by browser constraints
- Some CPU-intensive operations may be slower than native Python

## Usage Examples

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

Provides a comprehensive WebAssembly development environment supporting both
WebAssembly Text Format (WAT) and binary WebAssembly (WASM) compilation and execution.
Uses the WABT (WebAssembly Binary Toolkit) for client-side compilation and the
browser's native WebAssembly runtime for execution.

## Key Features
- **WAT syntax support** - WebAssembly Text Format editing with syntax highlighting
- **Client-side compilation** - WAT to WASM compilation in the browser
- **Native execution** - Uses browser's WebAssembly runtime for optimal performance
- **Error reporting** - Detailed compilation and runtime error diagnostics
- **WABT integration** - Industry-standard WebAssembly toolchain
- **Memory inspection** - Access to WebAssembly linear memory
- **Function exports** - Call WebAssembly functions from JavaScript
- **Inherited functionality** - All base Code component features

## WebAssembly Environment
The WebAssembly environment provides low-level programming capabilities with:
- Direct memory management
- Efficient numeric computations
- Near-native performance
- Secure sandboxed execution
- Interoperability with JavaScript

## Compilation Process
1. WebAssembly Text Format (WAT) source code is written by the user
2. WABT's wat2wasm compiler converts WAT to binary WASM format
3. Compilation errors are reported with line numbers and descriptions
4. Successfully compiled modules are instantiated and executed
5. Exported functions can be called and results displayed

## Performance Characteristics
- **Compilation speed** - Fast WAT to WASM compilation
- **Execution speed** - Near-native performance for computational tasks
- **Memory efficiency** - Direct control over memory allocation
- **Startup time** - Quick instantiation of compiled modules

## Usage Examples

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