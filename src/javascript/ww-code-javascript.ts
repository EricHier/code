import { javascript } from "@codemirror/lang-javascript";
import { localized } from "@lit/localize";
import { customElement } from "lit/decorators.js";
import { style } from "../shared/ww-code-css-single";
import { jsTemplateStyle } from "./shared/ww-code-js-css";
import CodeJsTemplate from "./shared/ww-code-js-template";

/**
 * Code widget for JavaScript with execution capabilities.
 * 
 * This component provides a feature-rich JavaScript code editor with real-time
 * execution in the browser environment. Perfect for teaching JavaScript fundamentals,
 * web development concepts, and interactive programming exercises.
 * 
 * ## Features
 * - **Native JavaScript Execution**: Runs directly in the browser's JavaScript engine
 * - **Modern JavaScript**: Full ES6+ syntax support including async/await, modules, classes
 * - **DOM Access**: Direct access to browser APIs and DOM manipulation
 * - **Console Output**: Captures console.log() and other console methods
 * - **Error Handling**: Detailed error reporting with stack traces
 * - **Performance Tracking**: Execution time measurement for optimization
 * - **Auto-completion**: IntelliSense-style code completion
 * - **Syntax Highlighting**: Full JavaScript syntax highlighting
 * 
 * ## JavaScript Environment
 * The component provides access to:
 * - All standard JavaScript features (ES2023+)
 * - Browser APIs (fetch, localStorage, etc.)
 * - DOM manipulation (document, window objects)
 * - Console methods (log, warn, error, info)
 * - Async/await and Promise support
 * - Modern JavaScript features (destructuring, arrow functions, etc.)
 * 
 * ## Common Use Cases
 * 
 * ### Basic JavaScript Example
 * ```html
 * <webwriter-code-javascript 
 *   code="console.log('Hello, JavaScript!');\nconst numbers = [1, 2, 3, 4, 5];\nconst sum = numbers.reduce((a, b) => a + b, 0);\nconsole.log('Sum:', sum);"
 *   autoRun>
 * </webwriter-code-javascript>
 * ```
 * 
 * ### DOM Manipulation Demo
 * ```html
 * <webwriter-code-javascript code="
 * // Create and style a div element
 * const div = document.createElement('div');
 * div.textContent = 'Hello from JavaScript!';
 * div.style.padding = '10px';
 * div.style.backgroundColor = 'lightblue';
 * div.style.borderRadius = '5px';
 * 
 * // Add to page (note: this affects the parent document)
 * console.log('Element created:', div.outerHTML);
 * " showExecutionTime></webwriter-code-javascript>
 * ```
 * 
 * ### Async Programming Example
 * ```html
 * <webwriter-code-javascript code="
 * async function fetchData() {
 *   try {
 *     console.log('Fetching data...');
 *     // Simulate API call with timeout
 *     await new Promise(resolve => setTimeout(resolve, 1000));
 *     return { id: 1, name: 'John Doe', email: 'john@example.com' };
 *   } catch (error) {
 *     console.error('Error:', error);
 *   }
 * }
 * 
 * fetchData().then(data => {
 *   console.log('Received data:', data);
 * });
 * " autocomplete></webwriter-code-javascript>
 * ```
 * 
 * ### Algorithm Exercise Template
 * ```html
 * <webwriter-code-javascript 
 *   code="function bubbleSort(arr) {\n  // TODO: Implement bubble sort algorithm\n  return arr;\n}\n\nconst numbers = [64, 34, 25, 12, 22, 11, 90];\nconsole.log('Original:', numbers);\nconsole.log('Sorted:', bubbleSort([...numbers]));"
 *   locked-lines="[5,6,7]">
 * </webwriter-code-javascript>
 * ```
 * 
 * ### Object-Oriented Programming
 * ```html
 * <webwriter-code-javascript code="
 * class Vehicle {
 *   constructor(make, model, year) {
 *     this.make = make;
 *     this.model = model;
 *     this.year = year;
 *   }
 *   
 *   getInfo() {
 *     return `${this.year} ${this.make} ${this.model}`;
 *   }
 *   
 *   start() {
 *     console.log(`${this.getInfo()} is starting...`);
 *   }
 * }
 * 
 * class Car extends Vehicle {
 *   constructor(make, model, year, doors) {
 *     super(make, model, year);
 *     this.doors = doors;
 *   }
 *   
 *   getInfo() {
 *     return `${super.getInfo()} (${this.doors} doors)`;
 *   }
 * }
 * 
 * const myCar = new Car('Toyota', 'Camry', 2023, 4);
 * myCar.start();
 * console.log(myCar.getInfo());
 * " showExecutionCount></webwriter-code-javascript>
 * ```
 * 
 * ### Functional Programming
 * ```html
 * <webwriter-code-javascript code="
 * const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * 
 * // Functional programming pipeline
 * const result = numbers
 *   .filter(n => n % 2 === 0)        // Even numbers only
 *   .map(n => n * n)                 // Square each number
 *   .reduce((sum, n) => sum + n, 0); // Sum all values
 * 
 * console.log('Original numbers:', numbers);
 * console.log('Even numbers squared and summed:', result);
 * 
 * // Arrow functions and destructuring
 * const users = [
 *   { name: 'Alice', age: 25, city: 'New York' },
 *   { name: 'Bob', age: 30, city: 'San Francisco' },
 *   { name: 'Charlie', age: 35, city: 'Chicago' }
 * ];
 * 
 * const adultNames = users
 *   .filter(({ age }) => age >= 30)
 *   .map(({ name, city }) => `${name} from ${city}`);
 * 
 * console.log('Adults:', adultNames);
 * " visible></webwriter-code-javascript>
 * ```
 * 
 * ## Output Format
 * JavaScript execution results include:
 * - **Console Output**: All console.log(), console.warn(), console.error() messages
 * - **Return Values**: Final expression values (in REPL mode)
 * - **Error Messages**: Runtime errors with stack traces
 * - **Performance Data**: Execution time and memory usage
 * 
 * ## Error Handling
 * Comprehensive error reporting for:
 * - **Syntax Errors**: Invalid JavaScript syntax
 * - **Reference Errors**: Undefined variables or functions
 * - **Type Errors**: Invalid operations on values
 * - **Runtime Errors**: Exceptions thrown during execution
 * - **Async Errors**: Promise rejections and async/await errors
 * 
 * ## Security Considerations
 * - Code runs in the same context as the parent page
 * - Has access to all browser APIs and global objects
 * - Can potentially modify the parent document
 * - Use with trusted code only or implement sandboxing
 * 
 * ## Performance Characteristics
 * - **Execution Speed**: Native JavaScript performance
 * - **Startup Time**: Immediate execution (no compilation)
 * - **Memory Usage**: Shares browser's JavaScript heap
 * - **Async Support**: Full Promise and async/await support
 * 
 * ## Browser Compatibility
 * Supports modern JavaScript features available in:
 * - Chrome/Edge 90+
 * - Firefox 88+
 * - Safari 14+
 * - Modern mobile browsers
 * 
 * ## Best Practices
 * - Use console.log() for output instead of alert()
 * - Handle errors gracefully with try/catch
 * - Use const/let instead of var for block scoping
 * - Leverage modern JavaScript features (arrow functions, destructuring)
 * - Be mindful of async operations and Promises
 * - Use meaningful variable and function names
 * 
 * @example
 * ```typescript
 * // Programmatic usage
 * const jsEditor = document.createElement('webwriter-code-javascript');
 * jsEditor.code = `
 * const fibonacci = (n) => {
 *   if (n <= 1) return n;
 *   return fibonacci(n - 1) + fibonacci(n - 2);
 * };
 * 
 * console.log('Fibonacci sequence:');
 * for (let i = 0; i < 10; i++) {
 *   console.log(\`F(\${i}) = \${fibonacci(i)}\`);
 * }`;
 * jsEditor.autoRun = true;
 * jsEditor.showExecutionTime = true;
 * document.body.appendChild(jsEditor);
 * ```
 * 
 * @fires code-changed - When JavaScript code is modified
 * @fires execution-complete - When JavaScript execution finishes
 * 
 * @slot - No slots available
 * 
 * @csspart editor - The JavaScript code editor
 * @csspart output - JavaScript execution output area
 * @csspart controls - Control buttons (run, clear)
 * @csspart options - Configuration options panel
 * 
 * @cssprop --js-output-font - Font family for JavaScript output (default: monospace)
 * @cssprop --js-error-color - Color for JavaScript errors (default: red)
 * @cssprop --js-success-color - Color for successful output (default: green)
 * @cssprop --js-keyword-color - Color for JavaScript keywords in editor
 * @cssprop --js-string-color - Color for string literals in editor
 * @cssprop --js-number-color - Color for numeric literals in editor
 */
@customElement("webwriter-code-javascript")
@localized()
export default class CodeJavaScript extends CodeJsTemplate {
    static styles = [style, jsTemplateStyle] as any;

    constructor() {
        super("JavaScript", javascript());
    }

    /**
     * Builds JavaScript code for execution.
     * 
     * For JavaScript, this method returns the code as-is since no compilation
     * or transformation is needed. The code will be executed directly by the
     * browser's JavaScript engine.
     * 
     * @param code - The JavaScript source code to build
     * @returns The same code ready for execution
     */
    build(code: string): string {
        return code;
    }
}
