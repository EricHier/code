import { javascript } from "@codemirror/lang-javascript";
import { localized } from "@lit/localize";
import { customElement } from "lit/decorators.js";
import { style } from "../shared/ww-code-css-single";
import { jsTemplateStyle } from "./shared/ww-code-js-css";
import CodeJsTemplate from "./shared/ww-code-js-template";

/**
 * Code widget for JavaScript with execution capabilities.
 * 
 * Provides a comprehensive JavaScript development environment with real-time execution,
 * console output capture, and rich object inspection. Uses a sandboxed web worker
 * for safe code execution while maintaining full access to JavaScript language features
 * and built-in objects.
 * 
 * ## Key Features
 * - **Modern JavaScript support** - ES2022+ syntax and features
 * - **Console integration** - Full console.log, warn, error, and other methods
 * - **Object inspection** - Rich display of objects, arrays, and complex data types
 * - **Error handling** - Runtime error capture with stack traces
 * - **Sandboxed execution** - Safe execution environment using web workers
 * - **Real-time output** - Live console output as code executes
 * - **Interactive debugging** - Expandable object trees and detailed value display
 * - **Inherited functionality** - All base Code component features
 * 
 * ## JavaScript Environment
 * The JavaScript execution environment runs in a dedicated web worker, providing:
 * - Isolation from the main thread for performance and security
 * - Access to standard JavaScript built-ins and Web APIs
 * - Console output capture and formatting
 * - Error handling with detailed stack traces
 * - Object serialization for rich display
 * 
 * ## Execution Model
 * 1. JavaScript code is sent to a web worker for execution
 * 2. Console methods (log, warn, error) are intercepted and captured
 * 3. Values are serialized with type information for rich display
 * 4. Objects can be expanded on-demand for inspection
 * 5. Errors are caught and formatted with line number information
 * 
 * ## Console Features
 * The component captures and displays all console output with:
 * - **console.log()** - Standard output with value formatting
 * - **console.warn()** - Warning messages with appropriate styling
 * - **console.error()** - Error messages with stack traces
 * - **console.clear()** - Clears the output display
 * - **Return values** - Expression results displayed automatically
 * 
 * ## Usage Examples
 * 
 * @example Basic JavaScript execution:
 * ```html
 * <webwriter-code-javascript 
 *   code="console.log('Hello, JavaScript!'); console.log(2 + 2);"
 *   auto-run="true"
 *   show-execution-time="true">
 * </webwriter-code-javascript>
 * ```
 * 
 * @example Object manipulation and inspection:
 * ```html
 * <webwriter-code-javascript 
 *   code="const person = { name: 'Alice', age: 30, hobbies: ['reading', 'coding'] }; console.log(person); console.log(person.hobbies.length);"
 *   runnable="true"
 *   show-execution-count="true">
 * </webwriter-code-javascript>
 * ```
 * 
 * @example Array operations and modern syntax:
 * ```html
 * <webwriter-code-javascript 
 *   code="const numbers = [1, 2, 3, 4, 5]; const doubled = numbers.map(n => n * 2); console.log('Original:', numbers); console.log('Doubled:', doubled);"
 *   autocomplete="true"
 *   visible="true">
 * </webwriter-code-javascript>
 * ```
 * 
 * @example Error handling demonstration:
 * ```html
 * <webwriter-code-javascript 
 *   code="try { console.log('Starting...'); throw new Error('Demo error'); } catch (e) { console.error('Caught:', e.message); } finally { console.log('Done!'); }"
 *   show-execution-time="true">
 * </webwriter-code-javascript>
 * ```
 * 
 * @example Educational template with function structure:
 * ```html
 * <webwriter-code-javascript 
 *   code="function calculate(a, b) {\n  // TODO: Add your calculation here\n  return 0;\n}\n\nconsole.log('Result:', calculate(5, 3));"
 *   locked-lines="[1, 4, 6]"
 *   autocomplete="true">
 * </webwriter-code-javascript>
 * ```
 * 
 * ## Supported JavaScript Features
 * - **ES2022+ syntax** - Modern JavaScript language features
 * - **Arrow functions** - Concise function syntax
 * - **Template literals** - String interpolation and formatting
 * - **Destructuring** - Object and array destructuring
 * - **Async/await** - Asynchronous programming patterns
 * - **Classes** - Object-oriented programming
 * - **Modules** - Import/export statements (limited in worker context)
 * - **Built-in objects** - Array, Object, Math, Date, JSON, etc.
 * - **Regular expressions** - Pattern matching and text processing
 * 
 * ## Output Display Features
 * - **Type-aware formatting** - Different display for strings, numbers, objects, etc.
 * - **Expandable objects** - Click to expand object properties
 * - **Color coding** - Visual distinction between log levels
 * - **Interactive exploration** - Drill down into complex data structures
 * - **Null and undefined handling** - Clear display of falsy values
 * - **Function inspection** - Display function definitions and metadata
 * - **Array visualization** - Indexed display of array contents
 * 
 * ## Limitations
 * - **Worker context** - Some browser APIs may not be available
 * - **No DOM access** - Cannot manipulate the page DOM directly
 * - **Limited imports** - Module imports restricted by worker security
 * - **Memory constraints** - Subject to browser memory limits
 * 
 * ## Properties
 * Inherits all properties from the base `Code` class. No additional properties are defined.
 * 
 * ## Methods
 * Uses the inherited methods from the base `Code` class, plus specialized methods
 * for JavaScript-specific functionality (defined in the parent CodeJsTemplate class).
 * 
 * ## Events
 * Uses the inherited event handling from the base `Code` class.
 * 
 * ## CSS Parts
 * - `options` - The settings panel (inherited from base class)
 * 
 * ## Slots
 * This component does not use slots.
 */
@customElement("webwriter-code-javascript")
@localized()
export default class CodeJavaScript extends CodeJsTemplate {
    static styles = [style, jsTemplateStyle] as any;

    /**
     * Creates a new JavaScript code widget.
     * 
     * Initializes the component with JavaScript language support, including:
     * - JavaScript syntax highlighting with CodeMirror
     * - Web worker-based execution environment
     * - Console output capture and rich object display
     * - Error handling with stack trace information
     * - Interactive object inspection capabilities
     */
    constructor() {
        super("JavaScript", javascript());
    }

    /**
     * Builds/preprocesses the JavaScript code before execution.
     * 
     * For JavaScript, no preprocessing is needed - the code is executed as-is.
     * This method exists to satisfy the abstract requirement from CodeJsTemplate
     * and allows other language implementations (like TypeScript) to perform
     * compilation steps.
     * 
     * @param code - The JavaScript source code to build
     * @returns The unchanged JavaScript code ready for execution
     * @internal Used by the execution system
     */
    build(code: string): string {
        return code;
    }
}
