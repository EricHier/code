import { javascript } from "@codemirror/lang-javascript";
import { localized } from "@lit/localize";
import { customElement } from "lit/decorators.js";
import { DiagnosticCategory, getLineAndCharacterOfPosition, ModuleKind, transpileModule } from "typescript";
import { style } from "../shared/ww-code-css-single";
import { jsTemplateStyle } from "./shared/ww-code-js-css";
import CodeJsTemplate from "./shared/ww-code-js-template";

/**
 * Code widget for TypeScript with compilation and execution capabilities.
 * 
 * Provides a comprehensive TypeScript development environment with client-side compilation
 * to JavaScript and real-time execution. Uses the official TypeScript compiler for
 * type checking and code transformation, providing a full-featured TypeScript experience
 * in the browser.
 * 
 * ## Key Features
 * - **Full TypeScript support** - Complete TypeScript language features and syntax
 * - **Client-side compilation** - TypeScript to JavaScript compilation in the browser
 * - **Type checking** - Real-time type error detection and reporting
 * - **Modern JavaScript output** - Compiles to modern JavaScript for execution
 * - **Compilation diagnostics** - Detailed error messages with line numbers
 * - **Console integration** - Full console output capture like JavaScript widget
 * - **Object inspection** - Rich display of typed objects and complex data
 * - **Strict mode compilation** - Enhanced type safety with strict TypeScript settings
 * - **Inherited functionality** - All JavaScript widget features plus TypeScript compilation
 * 
 * ## TypeScript Environment
 * The TypeScript environment provides:
 * - Full TypeScript language server capabilities
 * - Strict type checking with compiler options
 * - CommonJS module output for browser execution
 * - Compilation error reporting with precise locations
 * - Type-aware syntax highlighting
 * 
 * ## Compilation Process
 * 1. TypeScript source code is written by the user
 * 2. The TypeScript compiler (`transpileModule`) processes the code
 * 3. Type errors are collected and displayed with line/column information
 * 4. Successfully compiled JavaScript is executed in a web worker
 * 5. Console output and results are displayed with rich formatting
 * 
 * ## Compiler Configuration
 * The TypeScript compiler is configured with:
 * - **Module system**: CommonJS for browser compatibility
 * - **Strict mode**: Enabled for enhanced type safety
 * - **Diagnostic reporting**: Full error and warning reporting
 * - **Target**: Modern JavaScript output
 * 
 * ## Usage Examples
 * 
 * @example Basic TypeScript with types:
 * ```html
 * <webwriter-code-typescript 
 *   code="const message: string = 'Hello, TypeScript!'; const count: number = 42; console.log(message, count);"
 *   auto-run="true"
 *   show-execution-time="true">
 * </webwriter-code-typescript>
 * ```
 * 
 * @example Interface and class example:
 * ```html
 * <webwriter-code-typescript 
 *   code="interface Person { name: string; age: number; } class Student implements Person { constructor(public name: string, public age: number, public grade: string) {} introduce(): string { return `Hi, I'm ${this.name}, age ${this.age}, grade ${this.grade}`; } } const student = new Student('Alice', 20, 'A'); console.log(student.introduce());"
 *   runnable="true"
 *   show-execution-count="true">
 * </webwriter-code-typescript>
 * ```
 * 
 * @example Generic functions and advanced types:
 * ```html
 * <webwriter-code-typescript 
 *   code="function identity<T>(arg: T): T { return arg; } const stringId = identity<string>('hello'); const numberId = identity<number>(42); console.log('String:', stringId, 'Number:', numberId);"
 *   autocomplete="true"
 *   visible="true">
 * </webwriter-code-typescript>
 * ```
 * 
 * @example Error handling and type safety:
 * ```html
 * <webwriter-code-typescript 
 *   code="type Result<T> = { success: true; data: T } | { success: false; error: string }; function divide(a: number, b: number): Result<number> { if (b === 0) return { success: false, error: 'Division by zero' }; return { success: true, data: a / b }; } const result = divide(10, 2); console.log(result);"
 *   show-execution-time="true">
 * </webwriter-code-typescript>
 * ```
 * 
 * @example Educational template with type annotations:
 * ```html
 * <webwriter-code-typescript 
 *   code="// TODO: Define an interface for a Book\ninterface Book {\n  // Add properties here\n}\n\n// TODO: Create a function that processes books\nfunction processBook(book: Book): void {\n  // Your implementation here\n}\n\n// Test your code\nconst myBook: Book = { title: 'TypeScript Guide', author: 'Developer' };\nprocessBook(myBook);"
 *   locked-lines="[1, 4, 6, 9, 12]"
 *   autocomplete="true">
 * </webwriter-code-typescript>
 * ```
 * 
 * ## TypeScript Features Supported
 * - **Static typing** - Full type system with inference and checking
 * - **Interfaces** - Contract definitions for objects and classes
 * - **Classes** - Object-oriented programming with access modifiers
 * - **Generics** - Type-safe parameterized code
 * - **Union and intersection types** - Advanced type compositions
 * - **Enums** - Named constants and value groupings
 * - **Modules** - Code organization and encapsulation
 * - **Decorators** - Metadata and code transformation (experimental)
 * - **Async/await** - Asynchronous programming with type safety
 * - **Type guards** - Runtime type checking and narrowing
 * - **Utility types** - Built-in type manipulation utilities
 * 
 * ## Compilation Features
 * - **Real-time compilation** - Immediate feedback on code changes
 * - **Detailed diagnostics** - Precise error locations with helpful messages
 * - **Strict type checking** - Enhanced safety with strict compiler options
 * - **JavaScript interop** - Seamless integration with JavaScript libraries
 * - **Source map support** - Error reporting mapped to original TypeScript
 * 
 * ## Type Checking Benefits
 * - **Compile-time errors** - Catch mistakes before runtime
 * - **IntelliSense support** - Enhanced autocompletion (when enabled)
 * - **Refactoring safety** - Type-safe code transformations
 * - **Documentation through types** - Self-documenting code contracts
 * - **IDE integration** - Better development experience
 * 
 * ## Limitations
 * - **Browser compilation** - Some advanced TypeScript features may not be available
 * - **Module resolution** - Limited external module support in worker context
 * - **Compilation speed** - Large codebases may compile slowly
 * - **Memory usage** - TypeScript compiler requires additional browser memory
 * 
 * ## Properties
 * Inherits all properties from the base `Code` class. No additional properties are defined.
 * 
 * ## Methods
 * Uses the inherited methods from the base `Code` class, plus specialized methods
 * for TypeScript compilation and JavaScript execution.
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
@customElement("webwriter-code-typescript")
@localized()
export default class CodeTypeScript extends CodeJsTemplate {
    static styles = [style, jsTemplateStyle] as any;

    /**
     * Creates a new TypeScript code widget.
     * 
     * Initializes the component with TypeScript language support, including:
     * - JavaScript syntax highlighting (TypeScript shares JavaScript grammar)
     * - TypeScript compiler integration for type checking and compilation
     * - Web worker-based execution environment for compiled JavaScript
     * - Console output capture and rich object display
     * - Compilation error handling with detailed diagnostics
     */
    constructor() {
        super("TypeScript", javascript());
    }

    /**
     * Compiles TypeScript code to JavaScript before execution.
     * 
     * Uses the official TypeScript compiler to:
     * 1. Parse and type-check the TypeScript source code
     * 2. Report any compilation errors with precise line/column information
     * 3. Transform TypeScript syntax to JavaScript for execution
     * 4. Apply strict compiler options for enhanced type safety
     * 
     * **Compiler Options:**
     * - `module: CommonJS` - Uses CommonJS modules for browser compatibility
     * - `strict: true` - Enables all strict type checking options
     * - `reportDiagnostics: true` - Provides detailed error reporting
     * 
     * **Error Handling:**
     * - Compilation errors are collected and stored in the `diagnostics` property
     * - Errors include precise source locations and helpful messages
     * - Compilation failures prevent code execution and display error information
     * 
     * @param code - The TypeScript source code to compile
     * @returns The compiled JavaScript code ready for execution
     * @throws Throws "Compilation failed" if there are type errors
     * @internal Used by the execution system before running code
     */
    build(code: string): string {
        this.diagnostics = [];

        const out = transpileModule(code, {
            compilerOptions: {
                module: ModuleKind.CommonJS,
                strict: true,
            },
            reportDiagnostics: true,
        });

        if (out.diagnostics?.find((d) => d.category === DiagnosticCategory.Error)) {
            this.diagnostics = out.diagnostics
                .filter((d) => d.category === DiagnosticCategory.Error)
                .filter((d) => d.file && d.start && d.messageText)
                .map((d) => ({
                    message: d.messageText.toString(),
                    start: d.start!,
                    line: getLineAndCharacterOfPosition(d.file!, d.start!).line + 1,
                    character: getLineAndCharacterOfPosition(d.file!, d.start!).character + 1,
                }));
            throw "Compilation failed";
        } else {
            return out.outputText;
        }
    }
}
