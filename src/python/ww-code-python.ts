import { localized } from "@lit/localize";
import { customElement } from "lit/decorators.js";
import Code from "../shared/ww-code-template";
import { pythonModule } from "./languageModules/pythonModule";

/**
 * Code widget for Python with execution capabilities using Pyodide.
 * 
 * This component provides a full-featured Python code editor with real Python
 * execution in the browser using Pyodide (Python compiled to WebAssembly).
 * Supports most Python standard library functionality and many popular packages.
 * 
 * ## Features
 * - **Real Python Execution**: Full Python 3.x interpreter in the browser
 * - **Standard Library**: Most Python standard library modules available
 * - **Package Support**: Many popular packages pre-installed (NumPy, Pandas, etc.)
 * - **Syntax Highlighting**: Full Python syntax highlighting with CodeMirror
 * - **Error Reporting**: Detailed traceback information with clickable line numbers
 * - **Performance Metrics**: Execution time tracking for performance analysis
 * - **Interactive Output**: Support for print statements and multiple outputs
 * 
 * ## Python Environment
 * The component uses Pyodide which provides:
 * - Python 3.11+ interpreter
 * - Access to `print()`, `input()`, and standard I/O
 * - Mathematical libraries (NumPy, SciPy, Matplotlib)
 * - Data science tools (Pandas, scikit-learn)
 * - Standard library modules (json, re, datetime, etc.)
 * 
 * ## Common Use Cases
 * 
 * ### Basic Python Example
 * ```html
 * <webwriter-code-python 
 *   code="print('Hello, Python!')\nfor i in range(3):\n    print(f'Count: {i}')"
 *   autoRun>
 * </webwriter-code-python>
 * ```
 * 
 * ### Math and Science
 * ```html
 * <webwriter-code-python code="
 * import numpy as np
 * import matplotlib.pyplot as plt
 * 
 * x = np.linspace(0, 2*np.pi, 100)
 * y = np.sin(x)
 * 
 * plt.plot(x, y)
 * plt.title('Sine Wave')
 * plt.show()
 * " showExecutionTime></webwriter-code-python>
 * ```
 * 
 * ### Data Analysis
 * ```html
 * <webwriter-code-python code="
 * import pandas as pd
 * 
 * data = {'name': ['Alice', 'Bob', 'Charlie'], 
 *         'age': [25, 30, 35]}
 * df = pd.DataFrame(data)
 * print(df)
 * print(f'Average age: {df.age.mean()}')
 * " autocomplete></webwriter-code-python>
 * ```
 * 
 * ### Algorithm Template
 * ```html
 * <webwriter-code-python 
 *   code="def fibonacci(n):\n    # TODO: Implement fibonacci sequence\n    pass\n\n# Test your function\nprint(fibonacci(10))"
 *   locked-lines="[4,5]">
 * </webwriter-code-python>
 * ```
 * 
 * ### Performance Comparison
 * ```html
 * <webwriter-code-python 
 *   code="import time\n\nstart = time.time()\n# Your code here\nend = time.time()\nprint(f'Execution time: {end-start:.4f} seconds')"
 *   showExecutionTime
 *   showExecutionCount>
 * </webwriter-code-python>
 * ```
 * 
 * ## Output Format
 * Python execution results are displayed as:
 * - **Standard Output**: Text from `print()` statements in default color
 * - **Error Output**: Exception tracebacks in red color
 * - **Return Values**: Final expression values (in interactive mode)
 * - **Plots**: Matplotlib figures (when using `plt.show()`)
 * 
 * ## Error Handling
 * Python errors are captured and displayed with:
 * - Full traceback information
 * - Clickable line numbers for error navigation
 * - Syntax error highlighting
 * - Runtime exception details
 * 
 * ## Performance Considerations
 * - **Initial Load**: First execution may be slow due to Pyodide initialization
 * - **Memory Usage**: Large datasets may impact browser performance
 * - **Long Running Code**: No built-in timeout protection
 * - **Package Loading**: First import of packages may take time
 * 
 * ## Limitations
 * - No file system access (use string-based data)
 * - No network requests (CORS restrictions)
 * - Limited GUI library support
 * - No subprocess or threading support
 * - Some native extensions may not be available
 * 
 * @example
 * ```typescript
 * // Programmatic usage
 * const pythonEditor = document.createElement('webwriter-code-python');
 * pythonEditor.code = 'import math\nprint(f"π = {math.pi}")';
 * pythonEditor.autoRun = true;
 * pythonEditor.showExecutionTime = true;
 * document.body.appendChild(pythonEditor);
 * ```
 * 
 * @fires code-changed - When Python code is modified
 * @fires execution-complete - When Python execution finishes
 * 
 * @slot - No slots available
 * 
 * @csspart editor - The Python code editor
 * @csspart output - Python execution output area
 * @csspart controls - Control buttons (run, clear)
 * @csspart options - Configuration options panel
 * 
 * @cssprop --python-output-font - Font family for Python output (default: monospace)
 * @cssprop --python-error-color - Color for Python error messages (default: red)
 * @cssprop --python-success-color - Color for successful output (default: green)
 */
@customElement("webwriter-code-python")
@localized()
export default class CodePython extends Code {
    constructor() {
        super(pythonModule);
    }
}
