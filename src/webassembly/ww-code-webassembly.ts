import { localized } from "@lit/localize";
import { customElement } from "lit/decorators.js";
import Code from "../shared/ww-code-template";
import { webassemblyModule } from "./languageModules/webassemblyModule";

/**
 * Code widget for WebAssembly with compilation and execution capabilities.
 * 
 * Provides a comprehensive WebAssembly development environment supporting both
 * WebAssembly Text Format (WAT) and binary WebAssembly (WASM) compilation and execution.
 * Uses the WABT (WebAssembly Binary Toolkit) for client-side compilation and the
 * browser's native WebAssembly runtime for execution.
 * 
 * ## Key Features
 * - **WAT syntax support** - WebAssembly Text Format editing with syntax highlighting
 * - **Client-side compilation** - WAT to WASM compilation in the browser
 * - **Native execution** - Uses browser's WebAssembly runtime for optimal performance
 * - **Error reporting** - Detailed compilation and runtime error diagnostics
 * - **WABT integration** - Industry-standard WebAssembly toolchain
 * - **Memory inspection** - Access to WebAssembly linear memory
 * - **Function exports** - Call WebAssembly functions from JavaScript
 * - **Inherited functionality** - All base Code component features
 * 
 * ## WebAssembly Environment
 * The WebAssembly environment provides low-level programming capabilities with:
 * - Direct memory management
 * - Efficient numeric computations
 * - Near-native performance
 * - Secure sandboxed execution
 * - Interoperability with JavaScript
 * 
 * ## Compilation Process
 * 1. WebAssembly Text Format (WAT) source code is written by the user
 * 2. WABT's wat2wasm compiler converts WAT to binary WASM format
 * 3. Compilation errors are reported with line numbers and descriptions
 * 4. Successfully compiled modules are instantiated and executed
 * 5. Exported functions can be called and results displayed
 * 
 * ## Performance Characteristics
 * - **Compilation speed** - Fast WAT to WASM compilation
 * - **Execution speed** - Near-native performance for computational tasks
 * - **Memory efficiency** - Direct control over memory allocation
 * - **Startup time** - Quick instantiation of compiled modules
 * 
 * ## Usage Examples
 * 
 * @example Basic WebAssembly function:
 * ```html
 * <webwriter-code-webassembly 
 *   code="(module (func $add (param $a i32) (param $b i32) (result i32) local.get $a local.get $b i32.add) (export \"add\" (func $add)))"
 *   auto-run="true"
 *   show-execution-time="true">
 * </webwriter-code-webassembly>
 * ```
 * 
 * @example Memory manipulation example:
 * ```html
 * <webwriter-code-webassembly 
 *   code="(module (memory 1) (func $store (param $addr i32) (param $value i32) local.get $addr local.get $value i32.store) (func $load (param $addr i32) (result i32) local.get $addr i32.load) (export \"memory\" (memory 0)) (export \"store\" (func $store)) (export \"load\" (func $load)))"
 *   runnable="true"
 *   show-execution-count="true">
 * </webwriter-code-webassembly>
 * ```
 * 
 * @example Educational template with module structure:
 * ```html
 * <webwriter-code-webassembly 
 *   code="(module\n  ;; Your function here\n  (func $main (result i32)\n    ;; TODO: Add your logic\n    i32.const 42\n  )\n  (export \"main\" (func $main))\n)"
 *   locked-lines="[1, 2, 6, 7, 8]"
 *   autocomplete="true">
 * </webwriter-code-webassembly>
 * ```
 * 
 * @example Mathematical computation:
 * ```html
 * <webwriter-code-webassembly 
 *   code="(module (func $factorial (param $n i32) (result i32) (local $result i32) (local $i i32) i32.const 1 local.set $result i32.const 1 local.set $i (loop $loop local.get $i local.get $n i32.gt_s if return local.get $result end local.get $result local.get $i i32.mul local.set $result local.get $i i32.const 1 i32.add local.set $i br $loop) local.get $result) (export \"factorial\" (func $factorial)))"
 *   visible="true"
 *   show-execution-time="true">
 * </webwriter-code-webassembly>
 * ```
 * 
 * ## WebAssembly Features Supported
 * - **Core WebAssembly** - All standard WebAssembly instructions
 * - **Value types** - i32, i64, f32, f64 numeric types
 * - **Control flow** - Blocks, loops, branches, calls
 * - **Memory operations** - Linear memory load/store operations
 * - **Function calls** - Direct and indirect function calls
 * - **Imports/Exports** - Module interface definitions
 * - **Local variables** - Function-local variable management
 * - **Global variables** - Module-level global state
 * 
 * ## Limitations
 * - **WAT syntax only** - Does not support other WebAssembly source languages
 * - **WASI not included** - System interface not available
 * - **Limited imports** - Only basic JavaScript interop supported
 * - **Debugging tools** - Limited debugging capabilities compared to native tools
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
@customElement("webwriter-code-webassembly")
@localized()
export default class CodeWebAssembly extends Code {
    /**
     * Creates a new WebAssembly code widget.
     * 
     * Initializes the component with the WebAssembly language module, which provides:
     * - WebAssembly Text Format (WAT) syntax highlighting
     * - WABT-based compilation from WAT to WASM binary format
     * - WebAssembly module instantiation and execution
     * - Output capture for exported function results
     * - Compilation error handling with detailed diagnostics
     * - Memory and performance monitoring capabilities
     */
    constructor() {
        super(webassemblyModule);
    }
}
