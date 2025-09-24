import { localized } from "@lit/localize";
import { customElement } from "lit/decorators.js";
import Code from "../shared/ww-code-template";
import { initializeJavacWorker, javaModule } from "./languageModules/javaModule";

/**
 * Code widget for Java with compilation and execution capabilities using TeaVM (Java 21).
 * 
 * This component provides a complete Java development environment in the browser,
 * including compilation and execution of Java code. Uses TeaVM to compile Java
 * bytecode to WebAssembly for high-performance execution.
 * 
 * ## Features
 * - **Full Java 21 Support**: Modern Java language features and syntax
 * - **Compilation**: Real Java compiler with detailed error reporting
 * - **Fast Execution**: TeaVM-compiled bytecode runs at near-native speed
 * - **Standard Library**: Core Java standard library classes available
 * - **Error Diagnostics**: Compilation errors with line-by-line navigation
 * - **Performance Tracking**: Compilation and execution time measurement
 * - **Template Support**: Lock boilerplate code for educational exercises
 * 
 * ## Java Environment
 * The component provides:
 * - Java 21 language compliance
 * - Core Java standard library (java.lang, java.util, java.io, etc.)
 * - System.out.println() and other console I/O
 * - Exception handling and stack traces
 * - Object-oriented programming features
 * - Generics, lambdas, and modern Java features
 * 
 * ## Common Use Cases
 * 
 * ### Hello World Example
 * ```html
 * <webwriter-code-java 
 *   code="public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, Java!\");\n    }\n}"
 *   autoRun>
 * </webwriter-code-java>
 * ```
 * 
 * ### Object-Oriented Programming
 * ```html
 * <webwriter-code-java code="
 * class Person {
 *     private String name;
 *     private int age;
 *     
 *     public Person(String name, int age) {
 *         this.name = name;
 *         this.age = age;
 *     }
 *     
 *     public void introduce() {
 *         System.out.println(\"Hi, I'm \" + name + \" and I'm \" + age + \" years old.\");
 *     }
 * }
 * 
 * public class Main {
 *     public static void main(String[] args) {
 *         Person person = new Person(\"Alice\", 25);
 *         person.introduce();
 *     }
 * }
 * " showExecutionTime></webwriter-code-java>
 * ```
 * 
 * ### Algorithm Exercise Template
 * ```html
 * <webwriter-code-java 
 *   code="public class SortingAlgorithm {\n    public static void main(String[] args) {\n        int[] numbers = {64, 34, 25, 12, 22, 11, 90};\n        // TODO: Implement your sorting algorithm here\n        \n        System.out.println(\"Sorted array:\");\n        for (int num : numbers) {\n            System.out.print(num + \" \");\n        }\n    }\n}"
 *   locked-lines="[1,2,3,6,7,8,9,10,11]">
 * </webwriter-code-java>
 * ```
 * 
 * ### Data Structures Example
 * ```html
 * <webwriter-code-java code="
 * import java.util.*;
 * 
 * public class CollectionsDemo {
 *     public static void main(String[] args) {
 *         List<String> fruits = new ArrayList<>();
 *         fruits.add(\"apple\");
 *         fruits.add(\"banana\");
 *         fruits.add(\"orange\");
 *         
 *         System.out.println(\"Fruits: \" + fruits);
 *         
 *         Map<String, Integer> scores = new HashMap<>();
 *         scores.put(\"Alice\", 95);
 *         scores.put(\"Bob\", 87);
 *         
 *         System.out.println(\"Scores: \" + scores);
 *     }
 * }
 * " autocomplete></webwriter-code-java>
 * ```
 * 
 * ### Exception Handling
 * ```html
 * <webwriter-code-java code="
 * public class ExceptionDemo {
 *     public static void main(String[] args) {
 *         try {
 *             int result = divide(10, 0);
 *             System.out.println(\"Result: \" + result);
 *         } catch (ArithmeticException e) {
 *             System.out.println(\"Error: \" + e.getMessage());
 *         }
 *     }
 *     
 *     public static int divide(int a, int b) {
 *         return a / b;
 *     }
 * }
 * " showExecutionCount></webwriter-code-java>
 * ```
 * 
 * ## Compilation Process
 * The Java compilation involves:
 * 1. **Source Parsing**: Java source code is parsed for syntax errors
 * 2. **Type Checking**: Variable types, method signatures, and class definitions are validated
 * 3. **Bytecode Generation**: Valid code is compiled to Java bytecode
 * 4. **TeaVM Transpilation**: Bytecode is converted to optimized WebAssembly
 * 5. **Execution**: WebAssembly code runs in the browser's VM
 * 
 * ## Output Format
 * Java execution results include:
 * - **System.out**: Output from println() and print() methods
 * - **System.err**: Error output and exception messages
 * - **Compilation Errors**: Detailed compiler diagnostics with line numbers
 * - **Runtime Exceptions**: Stack traces with clickable navigation
 * 
 * ## Error Handling
 * Comprehensive error reporting for:
 * - **Syntax Errors**: Missing semicolons, brackets, etc.
 * - **Type Errors**: Incompatible types, undefined variables
 * - **Compilation Errors**: Class not found, method signature mismatches
 * - **Runtime Exceptions**: NullPointerException, ArrayIndexOutOfBounds, etc.
 * 
 * ## Performance Characteristics
 * - **Compilation Time**: ~100-500ms for small programs
 * - **Execution Speed**: Near-native performance via WebAssembly
 * - **Memory Usage**: Efficient garbage collection
 * - **Startup Cost**: Initial compilation setup takes ~1-2 seconds
 * 
 * ## Limitations
 * - **Standard Library**: Limited to core Java classes (no Swing, AWT, etc.)
 * - **File I/O**: No actual file system access (use strings instead)
 * - **Threading**: Limited threading support
 * - **Native Code**: No JNI or native library support
 * - **Classpath**: Cannot load external JAR files
 * 
 * ## Best Practices
 * - Always include a main() method for executable code
 * - Use System.out.println() for output
 * - Handle exceptions appropriately
 * - Keep classes simple for educational purposes
 * - Use meaningful variable names for readability
 * 
 * @example
 * ```typescript
 * // Programmatic usage
 * const javaEditor = document.createElement('webwriter-code-java');
 * javaEditor.code = `
 * public class Calculator {
 *     public static void main(String[] args) {
 *         int sum = add(5, 3);
 *         System.out.println("5 + 3 = " + sum);
 *     }
 *     
 *     public static int add(int a, int b) {
 *         return a + b;
 *     }
 * }`;
 * javaEditor.autoRun = true;
 * document.body.appendChild(javaEditor);
 * ```
 * 
 * @fires code-changed - When Java code is modified
 * @fires compilation-complete - When Java compilation finishes
 * @fires execution-complete - When Java execution finishes
 * 
 * @slot - No slots available
 * 
 * @csspart editor - The Java code editor
 * @csspart output - Java execution output area  
 * @csspart controls - Control buttons (run, clear)
 * @csspart options - Configuration options panel
 * @csspart diagnostics - Compilation error display
 * 
 * @cssprop --java-output-font - Font family for Java output (default: monospace)
 * @cssprop --java-error-color - Color for compilation/runtime errors (default: red)
 * @cssprop --java-success-color - Color for successful output (default: green)
 * @cssprop --java-keyword-color - Color for Java keywords in editor
 */
@customElement("webwriter-code-java")
@localized()
export class CodeJava extends Code {
    constructor() {
        super(javaModule);
    }

    /**
     * Initializes the Java compilation worker after the component is first rendered.
     * 
     * This sets up the TeaVM compiler worker that handles Java compilation
     * in a separate thread to avoid blocking the main UI thread.
     * 
     * @override
     */
    firstUpdated(): void {
        super.firstUpdated();
        initializeJavacWorker();
    }
}
