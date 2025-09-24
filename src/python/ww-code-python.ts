import { localized } from "@lit/localize";
import { customElement } from "lit/decorators.js";
import Code from "../shared/ww-code-template";
import { pythonModule } from "./languageModules/pythonModule";

/**
 * Code widget for Python with execution capabilities using Pyodide.
 * 
 * Provides a comprehensive Python code editor with full execution support via Pyodide,
 * a Python distribution for the browser. Supports most Python standard library
 * functionality and many popular packages like NumPy, Pandas, and Matplotlib.
 * 
 * ## Key Features
 * - **Full Python 3.x support** via Pyodide WebAssembly runtime
 * - **Rich library ecosystem** - Access to NumPy, Pandas, Matplotlib, and more
 * - **Real-time execution** with output capture and display
 * - **Error reporting** with line-by-line diagnostics
 * - **Package installation** support for pure Python packages
 * - **Matplotlib integration** for data visualization
 * - **Inherited functionality** - All base Code component features
 * 
 * ## Python Environment
 * The Python environment is isolated and runs entirely in the browser using WebAssembly.
 * Each execution creates a fresh context, so variables don't persist between runs
 * unless explicitly managed by the execution environment.
 * 
 * ## Performance Considerations
 * - Initial load may take time as Pyodide is downloaded and initialized
 * - Large computations run entirely in the browser
 * - Memory is limited by browser constraints
 * - Some CPU-intensive operations may be slower than native Python
 * 
 * ## Usage Examples
 * 
 * @example Basic Python execution:
 * ```html
 * <webwriter-code-python 
 *   code="print('Hello, Python World!')\nprint(2 + 2)"
 *   auto-run="true"
 *   show-execution-time="true">
 * </webwriter-code-python>
 * ```
 * 
 * @example Data science example:
 * ```html
 * <webwriter-code-python 
 *   code="import numpy as np\ndata = np.array([1, 2, 3, 4, 5])\nprint(f'Mean: {data.mean()}')"
 *   runnable="true"
 *   show-execution-count="true">
 * </webwriter-code-python>
 * ```
 * 
 * @example Educational template with locked imports:
 * ```html
 * <webwriter-code-python 
 *   code="import math\nimport random\n\n# Your code here\nprint('Ready to code!')"
 *   locked-lines="[1, 2]"
 *   autocomplete="true">
 * </webwriter-code-python>
 * ```
 * 
 * @example Interactive exercise:
 * ```html
 * <webwriter-code-python 
 *   code="# Calculate the area of a circle\nradius = 5\n# TODO: Complete the calculation\narea = 0  # Replace this\nprint(f'Area: {area}')"
 *   visible="true"
 *   runnable="true">
 * </webwriter-code-python>
 * ```
 * 
 * ## Supported Libraries
 * Common Python libraries available in Pyodide include:
 * - **NumPy** - Numerical computing
 * - **Pandas** - Data analysis and manipulation
 * - **Matplotlib** - Plotting and visualization
 * - **SciPy** - Scientific computing
 * - **SymPy** - Symbolic mathematics
 * - **Requests** - HTTP library
 * - And many more from the Python Package Index
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
@customElement("webwriter-code-python")
@localized()
export default class CodePython extends Code {
    /**
     * Creates a new Python code widget.
     * 
     * Initializes the component with the Python language module, which provides:
     * - Python syntax highlighting and language features
     * - Pyodide-based execution environment with full Python standard library
     * - Output capture and formatting for Python print statements and expressions
     * - Error handling with Python traceback information
     * - Support for matplotlib plots and rich output formats
     */
    constructor() {
        super(pythonModule);
    }
}
