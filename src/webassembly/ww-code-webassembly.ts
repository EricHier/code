import { localized } from "@lit/localize";
import { customElement } from "lit/decorators.js";
import Code from "../shared/ww-code-template";
import { webassemblyModule } from "./languageModules/webassemblyModule";

/**
 * Code widget for WebAssembly with compilation and execution capabilities.
 * 
 * This component provides a WebAssembly Text format (WAT) editor with compilation
 * to WebAssembly binary format and execution in the browser's WebAssembly runtime.
 * Perfect for learning WebAssembly fundamentals, performance optimization, and
 * low-level programming concepts.
 * 
 * ## Features
 * - **WAT Syntax Highlighting**: Full WebAssembly Text format syntax support
 * - **Binary Compilation**: Compiles WAT to WebAssembly binary format (.wasm)
 * - **Instant Execution**: Runs compiled WebAssembly modules immediately
 * - **Error Diagnostics**: Detailed compilation errors with line navigation
 * - **Performance Tracking**: Precise execution timing for optimization work
 * - **Memory Inspection**: Access to WebAssembly linear memory
 * - **Function Exports**: Call exported WebAssembly functions
 * 
 * ## WebAssembly Environment
 * The component supports:
 * - WebAssembly Text format (WAT) syntax
 * - All WebAssembly instructions (arithmetic, memory, control flow)
 * - Function imports and exports
 * - Linear memory operations
 * - Global variables and constants
 * - Multiple value types (i32, i64, f32, f64)
 * 
 * ## Common Use Cases
 * 
 * ### Simple Function Example
 * ```html
 * <webwriter-code-webassembly 
 *   code="(module\n  (func $add (param $a i32) (param $b i32) (result i32)\n    local.get $a\n    local.get $b\n    i32.add)\n  (export \"add\" (func $add))\n)"
 *   autoRun>
 * </webwriter-code-webassembly>
 * ```
 * 
 * ### Memory Operations
 * ```html
 * <webwriter-code-webassembly code="
 * (module
 *   (memory 1)
 *   (func $store_and_load (result i32)
 *     i32.const 0    ;; address
 *     i32.const 42   ;; value
 *     i32.store      ;; store value at address 0
 *     
 *     i32.const 0    ;; address
 *     i32.load       ;; load value from address 0
 *   )
 *   (export \"memory\" (memory 0))
 *   (export \"store_and_load\" (func $store_and_load))
 * )
 * " showExecutionTime></webwriter-code-webassembly>
 * ```
 * 
 * ### Control Flow and Loops
 * ```html
 * <webwriter-code-webassembly code="
 * (module
 *   (func $factorial (param $n i32) (result i32)
 *     (local $result i32)
 *     i32.const 1
 *     local.set $result
 *     
 *     (loop $continue
 *       local.get $n
 *       i32.const 1
 *       i32.le_s
 *       if
 *         local.get $result
 *         return
 *       end
 *       
 *       local.get $result
 *       local.get $n
 *       i32.mul
 *       local.set $result
 *       
 *       local.get $n
 *       i32.const 1
 *       i32.sub
 *       local.set $n
 *       
 *       br $continue
 *     )
 *     local.get $result
 *   )
 *   (export \"factorial\" (func $factorial))
 * )
 * " autocomplete></webwriter-code-webassembly>
 * ```
 * 
 * ### Fibonacci Exercise Template
 * ```html
 * <webwriter-code-webassembly 
 *   code="(module\n  (func $fibonacci (param $n i32) (result i32)\n    ;; TODO: Implement fibonacci sequence\n    i32.const 0\n  )\n  (export \"fibonacci\" (func $fibonacci))\n)"
 *   locked-lines="[1,5,6]">
 * </webwriter-code-webassembly>
 * ```
 * 
 * ### Data Manipulation
 * ```html
 * <webwriter-code-webassembly code="
 * (module
 *   (data (i32.const 0) \"Hello, WASM!\")
 *   (memory 1)
 *   
 *   (func $get_string_length (result i32)
 *     i32.const 12  ;; length of \"Hello, WASM!\"
 *   )
 *   
 *   (func $get_char_at (param $index i32) (result i32)
 *     local.get $index
 *     i32.load8_u   ;; load unsigned byte
 *   )
 *   
 *   (export \"memory\" (memory 0))
 *   (export \"get_string_length\" (func $get_string_length))
 *   (export \"get_char_at\" (func $get_char_at))
 * )
 * " showExecutionCount></webwriter-code-webassembly>
 * ```
 * 
 * ## Compilation Process
 * The WebAssembly compilation involves:
 * 1. **WAT Parsing**: WebAssembly Text format is parsed for syntax errors
 * 2. **Validation**: Module structure, types, and instructions are validated
 * 3. **Binary Generation**: WAT is compiled to WebAssembly binary format
 * 4. **Module Instantiation**: Binary is loaded into WebAssembly runtime
 * 5. **Function Execution**: Exported functions are called automatically
 * 
 * ## Output Format
 * WebAssembly execution results include:
 * - **Function Results**: Return values from exported functions
 * - **Memory Dumps**: Contents of linear memory (when available)
 * - **Export List**: Available exported functions and their signatures
 * - **Compilation Errors**: Detailed WAT syntax and validation errors
 * 
 * ## Error Handling
 * Comprehensive error reporting for:
 * - **Syntax Errors**: Invalid WAT syntax, missing parentheses
 * - **Type Errors**: Incorrect value types, stack mismatches
 * - **Validation Errors**: Invalid module structure, undefined functions
 * - **Runtime Errors**: Traps, out-of-bounds memory access
 * 
 * ## Performance Characteristics
 * - **Compilation Time**: ~10-100ms for typical modules
 * - **Execution Speed**: Near-native performance
 * - **Memory Efficiency**: Direct access to linear memory
 * - **Startup Cost**: Minimal WebAssembly runtime overhead
 * 
 * ## WebAssembly Concepts
 * This component helps teach:
 * - **Stack Machine**: Understanding WebAssembly's stack-based execution
 * - **Memory Model**: Linear memory and addressing
 * - **Type System**: WebAssembly's simple type system (i32, i64, f32, f64)
 * - **Control Flow**: Structured control flow with blocks and branches
 * - **Module System**: Imports, exports, and module composition
 * 
 * ## Limitations
 * - **Host Functions**: Limited set of host function imports
 * - **WASI**: No WebAssembly System Interface support
 * - **Threading**: No multi-threading support
 * - **GC**: No garbage collection proposals support
 * - **Exception Handling**: Limited exception handling support
 * 
 * ## Best Practices
 * - Start with simple arithmetic functions
 * - Use meaningful function and parameter names
 * - Export functions for testing and demonstration
 * - Include memory exports for memory inspection
 * - Comment complex control flow logic
 * - Test edge cases (overflow, underflow, etc.)
 * 
 * @example
 * ```typescript
 * // Programmatic usage
 * const wasmEditor = document.createElement('webwriter-code-webassembly');
 * wasmEditor.code = `
 * (module
 *   (func $multiply (param $a i32) (param $b i32) (result i32)
 *     local.get $a
 *     local.get $b
 *     i32.mul
 *   )
 *   (export "multiply" (func $multiply))
 * )`;
 * wasmEditor.autoRun = true;
 * wasmEditor.showExecutionTime = true;
 * document.body.appendChild(wasmEditor);
 * ```
 * 
 * @fires code-changed - When WebAssembly code is modified
 * @fires compilation-complete - When WAT compilation finishes
 * @fires execution-complete - When WebAssembly execution finishes
 * 
 * @slot - No slots available
 * 
 * @csspart editor - The WebAssembly code editor
 * @csspart output - WebAssembly execution output area
 * @csspart controls - Control buttons (run, clear)
 * @csspart options - Configuration options panel
 * @csspart diagnostics - Compilation error display
 * 
 * @cssprop --wasm-output-font - Font family for WebAssembly output (default: monospace)
 * @cssprop --wasm-error-color - Color for compilation/runtime errors (default: red)
 * @cssprop --wasm-success-color - Color for successful output (default: green)
 * @cssprop --wasm-keyword-color - Color for WAT keywords in editor
 * @cssprop --wasm-number-color - Color for numeric literals in editor
 */
@customElement("webwriter-code-webassembly")
@localized()
export default class CodeWebAssembly extends Code {
    constructor() {
        super(webassemblyModule);
    }
}
