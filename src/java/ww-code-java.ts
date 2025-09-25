import { localized } from "@lit/localize";
import { customElement } from "lit/decorators.js";
import Code from "../shared/ww-code-template";
import { initializeJavacWorker, javaModule } from "./languageModules/javaModule";

/**
 * Code widget for Java with compilation and execution capabilities using TeaVM (Java 21).
 * 
 * Provides a full Java development environment in the browser using TeaVM to compile
 * Java source code to WebAssembly and JavaScript. Supports modern Java language
 * features up to Java 21, with compilation and execution happening entirely client-side.
 * 
 * ## Key Features
 * - **Java 21 language support** with modern syntax and features
 * - **Client-side compilation** - No server required for Java development
 * - **Real-time execution** with output capture and display
 * - **Compilation error reporting** with line-by-line diagnostics
 * - **TeaVM-powered** - Mature Java-to-WebAssembly/JavaScript transpiler
 * - **Standard library support** - Core Java classes and utilities
 * - **Inherited functionality** - All base Code component features
 * 
 * ## Java Environment
 * The Java environment uses TeaVM to compile Java source code to JavaScript/WebAssembly
 * for execution in the browser. This provides good performance while maintaining
 * compatibility with standard Java syntax and core library classes.
 * 
 * ## Compilation Process
 * 1. Java source code is sent to a web worker running the Java compiler
 * 2. TeaVM compiles the code to JavaScript/WebAssembly
 * 3. Compilation errors are reported with line numbers and descriptions
 * 4. Successfully compiled code is executed and output is captured
 * 
 * ## Performance Considerations
 * - Initial compilation may take a moment as the compiler initializes
 * - Subsequent compilations are faster with the warm compiler
 * - Large programs or complex computations perform well via WebAssembly
 * - Memory usage is managed by the browser's JavaScript engine
 * 
 * ## Usage Examples
 * 
 * @example Basic Java Hello World:
 * ```html
 * <webwriter-code-java 
 *   code="public class Main { public static void main(String[] args) { System.out.println(\"Hello, Java!\"); } }"
 *   auto-run="true"
 *   show-execution-time="true">
 * </webwriter-code-java>
 * ```
 * 
 * @example Object-oriented example:
 * ```html
 * <webwriter-code-java 
 *   code="class Person { String name; Person(String n) { name = n; } void greet() { System.out.println(\"Hello, \" + name); } } public class Main { public static void main(String[] args) { Person p = new Person(\"World\"); p.greet(); } }"
 *   runnable="true"
 *   show-execution-count="true">
 * </webwriter-code-java>
 * ```
 * 
 * @example Educational template with locked class structure:
 * ```html
 * <webwriter-code-java 
 *   code="public class Exercise {\n    public static void main(String[] args) {\n        // TODO: Your code here\n        \n    }\n}"
 *   locked-lines="[1, 2, 4, 5]"
 *   autocomplete="true">
 * </webwriter-code-java>
 * ```
 * 
 * @example Mathematical computation:
 * ```html
 * <webwriter-code-java 
 *   code="public class Math { public static void main(String[] args) { int sum = 0; for(int i = 1; i <= 10; i++) sum += i; System.out.println(\"Sum: \" + sum); } }"
 *   visible="true"
 *   show-execution-time="true">
 * </webwriter-code-java>
 * ```
 * 
 * ## Supported Java Features
 * - **Java 21 syntax** - Records, pattern matching, switch expressions, etc.
 * - **Object-oriented programming** - Classes, inheritance, interfaces, polymorphism
 * - **Core collections** - ArrayList, HashMap, HashSet, etc.
 * - **String manipulation** - Full String API support
 * - **Mathematical operations** - Math class and numeric types
 * - **Control structures** - Loops, conditionals, exception handling
 * - **Generic types** - Type-safe collections and methods
 * 
 * ## Limitations
 * - **No file system access** - Browser security restrictions apply
 * - **No network operations** - HTTP requests not supported in compilation context
 * - **Limited reflection** - Some reflection features may not work
 * - **TeaVM compatibility** - Not all Java standard library features are available
 * 
 * ## Properties
 * Inherits all properties from the base `Code` class. No additional properties are defined.
 * 
 * ## Methods
 * Uses the inherited methods from the base `Code` class. No additional public methods.
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
@customElement("webwriter-code-java")
@localized()
export class CodeJava extends Code {
    /**
     * Creates a new Java code widget.
     * 
     * Initializes the component with the Java language module, which provides:
     * - Java syntax highlighting with modern language feature support
     * - TeaVM-based compilation and execution environment
     * - Output capture for System.out.println and other output methods
     * - Compilation error handling with detailed diagnostics
     * - Worker-based compilation for non-blocking UI performance
     */
    constructor() {
        super(javaModule);
    }

    /**
     * Initializes the Java compiler worker after the component is first updated.
     * 
     * This lifecycle method ensures that the Java compilation environment is
     * ready before any code execution attempts. The worker initialization
     * happens asynchronously to avoid blocking the UI.
     * 
     * @internal Called automatically by Lit lifecycle
     */
    firstUpdated(): void {
        super.firstUpdated();
        initializeJavacWorker();
    }
}
