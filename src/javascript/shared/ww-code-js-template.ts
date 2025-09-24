import { LanguageSupport } from "@codemirror/language";
import { html, TemplateResult } from "lit";
import JavaScriptWorker from "worker:./javascript.worker";
import Code from "../../shared/ww-code-template";
import type {
    ExecuteCodeMessage,
    FromWorkerMessage,
    RealizeObjectMessage,
    SerializedArray,
    SerializedObject,
    SerializedValue,
} from "./javascript.worker";

/**
 * Abstract base class for JavaScript-based code editors with worker-based execution.
 * 
 * Provides a specialized implementation of the Code base class designed for JavaScript
 * and JavaScript-derived languages (like TypeScript). Features a sophisticated execution
 * model using web workers for sandboxed code execution, rich console output capture,
 * and interactive object inspection capabilities.
 * 
 * ## Architecture
 * - **Web Worker Execution** - Code runs in isolated web worker for performance and security
 * - **Console Interception** - Captures all console methods (log, warn, error, etc.)
 * - **Object Serialization** - Complex objects are serialized with type information
 * - **Lazy Object Realization** - Large objects are loaded on-demand for performance
 * - **Rich Display System** - Type-aware rendering of values and objects
 * 
 * ## Worker Communication
 * The class communicates with a web worker using a message-passing protocol:
 * - **ExecuteCodeMessage** - Sends code to worker for execution
 * - **RealizeObjectMessage** - Requests full object details for inspection
 * - **FromWorkerMessage** - Receives log entries, console output, and object data
 * 
 * ## Object Serialization System
 * Complex objects are serialized to preserve their structure while enabling:
 * - Type information preservation (object, array, function, etc.)
 * - Lazy loading of large object trees
 * - Interactive expansion in the UI
 * - Circular reference handling
 * - Prototype chain inspection
 * 
 * ## Subclass Implementation
 * Subclasses must implement the `build()` method to handle language-specific
 * preprocessing (e.g., TypeScript compilation, Babel transformation, etc.).
 * 
 * @example Extending for a custom language:
 * ```typescript
 * class MyLanguageCode extends CodeJsTemplate {
 *   constructor() {
 *     super("MyLanguage", myLanguageExtension());
 *   }
 * 
 *   build(code: string): string {
 *     // Custom preprocessing logic
 *     return processMyLanguage(code);
 *   }
 * }
 * ```
 * 
 * ## Console Methods Supported
 * - `console.log()` - Standard output with value formatting
 * - `console.warn()` - Warning messages with distinct styling
 * - `console.error()` - Error messages with stack traces
 * - `console.clear()` - Clears the output display
 * - `console.info()` - Informational messages
 * - `console.debug()` - Debug output (when enabled)
 * 
 * ## Value Display Features
 * - **Primitive values** - Numbers, strings, booleans with type-specific formatting
 * - **Objects** - Expandable property trees with type information
 * - **Arrays** - Indexed display with length information
 * - **Functions** - Function signatures and source code preview
 * - **Null/undefined** - Clear visual distinction for falsy values
 * - **Circular references** - Safe handling without infinite loops
 * - **Symbols** - Symbol description and registry information
 * 
 * @internal This is an abstract base class for JavaScript-family languages
 */
export default abstract class CodeJsTemplate extends Code {
    /**
     * The web worker instance used for code execution.
     * @internal
     */
    private worker: Worker | null = null;

    /**
     * Tracks whether the worker is currently alive and responsive.
     * @internal
     */
    private workerAlive = false;

    /**
     * Creates a new JavaScript-based code editor.
     * 
     * Sets up a language module with worker-based execution and provides
     * the execution function that handles:
     * - Worker lifecycle management
     * - Code preprocessing via the abstract `build()` method
     * - Message passing for execution requests
     * - Cleanup of previous execution contexts
     * 
     * @param name - Display name for the language (e.g., "JavaScript", "TypeScript")
     * @param languageExtension - CodeMirror language extension for syntax highlighting
     */
    constructor(name: string, languageExtension: LanguageSupport) {
        super({
            name,
            executionFunction: (code: string) => {
                this.worker?.terminate();
                this.workerAlive = false;
                this.objectRealizationRequests.clear();

                try {
                    code = this.build(code);
                } catch (e) {
                    return;
                }

                this.worker = new Worker(
                    URL.createObjectURL(new Blob([JavaScriptWorker], { type: "application/javascript" })),
                    { type: "module" },
                );
                this.workerAlive = true;

                return new Promise<void>((resolve) => {
                    this.worker!.onmessage = (event: MessageEvent) => {
                        if (event.data.type === "executionStatus" && event.data.status === "terminated") {
                            resolve();
                        } else {
                            this.handleMessage(event);
                        }
                    };
                    this.worker!.postMessage({
                        type: "execute",
                        executionId: "main", // Currently, no simultaneous executions are supported
                        code: code,
                    } as ExecuteCodeMessage);
                });
            },
            languageExtension,
        });
    }

    /**
     * Builds/preprocesses the source code before execution.
     * 
     * This abstract method must be implemented by subclasses to handle
     * language-specific transformations:
     * - **JavaScript**: Returns code unchanged
     * - **TypeScript**: Compiles TypeScript to JavaScript
     * - **Other languages**: Apply appropriate transformations
     * 
     * @param code - The source code to preprocess
     * @returns The processed code ready for execution in the worker
     * @throws May throw compilation errors that prevent execution
     */
    abstract build(code: string): string;

    /**
     * Map of pending object realization requests to prevent duplicate requests.
     * @internal
     */
    private objectRealizationRequests = new Map<number, SerializedObject | SerializedArray>();

    /**
     * Requests full object details from the worker for interactive inspection.
     * 
     * When users interact with expandable objects in the output, this method
     * sends a request to the worker to load the complete object structure.
     * Prevents duplicate requests for the same object.
     * 
     * @param ref - The serialized object reference to realize
     * @internal
     */
    private requestObjectRealization(ref: SerializedObject | SerializedArray) {
        if (ref.value.realized || this.objectRealizationRequests.has(ref.value.objectId)) return;

        this.objectRealizationRequests.set(ref.value.objectId, ref);
        this.worker?.postMessage({
            type: "realizeObject",
            objectId: ref.value.objectId,
        } as RealizeObjectMessage);
    }

    /**
     * Handles messages received from the web worker.
     * 
     * Processes different message types:
     * - **log messages** - Console output with formatted values
     * - **consoleClear** - Clears the output display
     * - **realizedObject** - Updates object data for interactive inspection
     * 
     * @param event - The message event from the worker
     * @internal
     */
    private handleMessage(event: MessageEvent) {
        const message = event.data as FromWorkerMessage;

        if (message.type == "log") {
            this.results = [...this.results, { label: message.label, logs: message.logs }];
        } else if (message.type === "consoleClear") {
            this.results = [];
        } else if (message.type == "realizedObject") {
            if (!this.objectRealizationRequests.has(message.objectId)) {
                console.warn("Received invalid object id", message.objectId);
                return;
            }

            this.objectRealizationRequests.get(message.objectId)!.value = message.value.value;
            this.results = [...this.results];
            this.requestUpdate();
        }
    }

    /**
     * Renders execution results with rich console output formatting.
     * 
     * Overrides the base class Result() method to provide JavaScript-specific
     * result display with:
     * - Console log levels (log, warn, error) with appropriate icons
     * - Type-aware value formatting
     * - Interactive object inspection
     * - Multiple values per log entry
     * 
     * @returns Template for displaying JavaScript execution results
     * @internal Called by Output() when there are no diagnostics
     */
    Result(): TemplateResult<1> {
        return this.results.map((result: { label: string; logs: SerializedValue[] }) => {
            return html`<div class="log-line log-level-${result.label}">
                ${this.LogIcon(result.label)}
                <div class="log-values">
                    ${result.logs.map((log: SerializedValue) => html`${this.LogValue(log, true)} `)}
                </div>
            </div>`;
        });
    }

    /**
     * Renders a serialized value with type-aware formatting.
     * 
     * This method handles the display of all JavaScript value types with appropriate
     * formatting, colors, and interactive features:
     * 
     * **Primitive Types:**
     * - `null` - Displayed as "null" with distinct styling
     * - `undefined` - Displayed as "undefined" with distinct styling
     * - `string` - Quoted strings (except at top level)
     * - `number` - Numeric values with number styling
     * - `boolean` - true/false with boolean styling
     * - `bigint` - Large integers with "n" suffix
     * - `symbol` - Symbol display with description
     * 
     * **Complex Types:**
     * - `function` - Function signature with truncation for long functions
     * - `array` - Delegates to ArrayValue() for interactive array display
     * - `object` - Delegates to ObjectValue() for interactive object display
     * 
     * @param value - The serialized value to display
     * @param topLevel - Whether this is a top-level console output (affects string quoting)
     * @param inline - Whether to use compact inline display (affects object/array rendering)
     * @returns Template for displaying the value
     * @internal Used by Result() and recursive object/array display
     */
    private LogValue(value: SerializedValue, topLevel: boolean = false, inline: boolean = false) {
        switch (value.type) {
            case "null":
                return html`<div class="log-value log-null">null</div>`;
            case "undefined":
                return html`<div class="log-value log-undefined">undefined</div>`;
            case "string":
                if (topLevel) {
                    return html`<div class="log-value">${value.value}</div>`;
                } else {
                    return html`<div class="log-value log-string">"${value.value}"</div>`;
                }
            case "number":
                return html`<div class="log-value log-number">${value.value}</div>`;
            case "boolean":
                return html`<div class="log-value log-boolean">${value.value}</div>`;
            case "bigint":
                return html`<div class="log-value log-bigint">${value.value}n</div>`;
            case "symbol":
                return html`<div class="log-value log-symbol">Symbol(${value.description})</div>`;
            case "function":
                const lines = value.value.trim().split("\n");
                let name = lines[0] + (lines.length > 1 ? " … }" : "");
                return html`<div class="log-value log-function">${name}</div>`;
            case "array":
                if (value.value.realized) {
                    return this.ArrayValue(
                        {
                            ...value,
                            value: value.value as { realized: true; values: SerializedValue[]; expanded: boolean },
                        },
                        topLevel,
                        inline,
                    );
                } else {
                    return this.ArrayValue(value, topLevel, inline);
                }
            case "object":
                return this.ObjectValue(value, topLevel, inline);
            default:
                return html``;
        }
    }

    /**
     * Renders an object with interactive property inspection.
     * 
     * Provides a collapsible object display that shows:
     * - Preview of first few properties when collapsed
     * - Full property list when expanded
     * - Recursive object inspection for nested objects
     * - On-demand loading of object properties from the worker
     * 
     * **Display Modes:**
     * - **Inline**: Shows `{…}` for compact display
     * - **Unrealized**: Shows `{…}` for objects not yet loaded from worker
     * - **Empty**: Shows `{}` for objects with no properties
     * - **Interactive**: Expandable object with property details
     * 
     * **Interaction:**
     * - Click to expand/collapse object properties
     * - Automatic loading of nested objects when expanded
     * - Property names and values displayed with proper formatting
     * 
     * @param object - The serialized object to display
     * @param _topLevel - Whether this is a top-level display (unused)
     * @param inline - Whether to use compact inline display
     * @returns Template for displaying the interactive object
     * @internal Used by LogValue() for object display
     */
    private ObjectValue(object: SerializedObject, _topLevel: boolean, inline: boolean): TemplateResult<1> {
        if (inline) return html`{…}`;
        if (!object.value.realized) return html`<span class="log-unrealizable">{…}</span>`;
        if (object.value.properties.length === 0) return html`{}`;

        return html`<div class="log-value log-object">
            <div
                class="log-clickable"
                @click=${() => {
                    if (object.value.realized) {
                        object.value.expanded = !object.value.expanded;
                        if (this.workerAlive) {
                            for (const { value } of object.value.properties) {
                                if (value.type === "array" || value.type == "object") {
                                    this.requestObjectRealization(value);
                                }
                            }
                        }
                    }
                    this.requestUpdate();
                }}
            >
                <sl-icon
                    name="${object.value.expanded ? "caret-down-fill" : "caret-right-fill"}"
                    class="log-expand-icon"
                ></sl-icon
                >{${object.value.properties.slice(0, 3).map(({ key, value }, index) => {
                    if (index == 2) return ", …";
                    return html`${index === 1 ? ", " : ""}${key}: ${this.LogValue(value, false, true)}`;
                })}}
            </div>
            ${!object.value.expanded
                ? undefined
                : html`<div class="log-properties">
                      ${object.value.properties.map(({ key, value }) => {
                          return html`<div class="log-field">${key}: ${this.LogValue(value, false, false)}</div>`;
                      })}
                  </div>`}
        </div>`;
    }

    /**
     * Renders an array with interactive element inspection.
     * 
     * Provides a collapsible array display that shows:
     * - Preview of first few elements when collapsed
     * - Full element list with indices when expanded
     * - Recursive array inspection for nested arrays
     * - On-demand loading of array elements from the worker
     * 
     * **Display Modes:**
     * - **Inline**: Shows `[…]` for compact display
     * - **Unrealized**: Shows `[…]` for arrays not yet loaded from worker
     * - **Empty**: Shows `[]` for empty arrays
     * - **Interactive**: Expandable array with indexed elements
     * 
     * **Interaction:**
     * - Click to expand/collapse array elements
     * - Automatic loading of nested objects/arrays when expanded
     * - Array indices and values displayed with proper formatting
     * - Truncation for very long arrays with "…" indicator
     * 
     * @param array - The serialized array to display
     * @param _topLevel - Whether this is a top-level display (unused)
     * @param inline - Whether to use compact inline display
     * @returns Template for displaying the interactive array
     * @internal Used by LogValue() for array display
     */
    private ArrayValue(array: SerializedArray, _topLevel: boolean, inline: boolean): TemplateResult<1> {
        if (inline) return html`[…]`;
        if (!array.value.realized) return html`<span class="log-unrealizable">[…]</span>`;
        if (array.value.values.length === 0) return html`[]`;

        return html`<div class="log-value log-array">
            <div
                class="log-clickable"
                @click=${() => {
                    if (array.value.realized) {
                        array.value.expanded = !array.value.expanded;
                        if (this.workerAlive) {
                            for (const value of array.value.values) {
                                if (value.type === "array" || value.type == "object") {
                                    this.requestObjectRealization(value);
                                }
                            }
                        }
                    }
                    this.requestUpdate();
                }}
            >
                <sl-icon
                    name="${array.value.expanded ? "caret-down-fill" : "caret-right-fill"}"
                    class="log-expand-icon"
                ></sl-icon
                >[
                ${array.value.values.slice(0, 5).map((value, index) => {
                    if (index == 4) return ", …";
                    return html`${index > 0 ? ", " : ""}${this.LogValue(value, false, true)}`;
                })}
                ]
            </div>
            ${!array.value.expanded
                ? undefined
                : html`<div class="log-properties">
                      ${array.value.values.map((value, idx) => {
                          return html`<div class="log-field">${idx}: ${this.LogValue(value, false, false)}</div>`;
                      })}
                  </div>`}
        </div>`;
    }

    /**
     * Renders icons for different console log levels.
     * 
     * Provides visual indicators for different types of console output:
     * - **Warning**: Triangle icon for console.warn() output
     * - **Error**: Circle icon for console.error() output
     * - **Default**: Empty placeholder for console.log() and other output
     * 
     * Icons help users quickly identify the severity and type of log messages
     * in the console output display.
     * 
     * @param label - The log level label ("warning", "error", or other)
     * @returns Template for the appropriate log level icon
     * @internal Used by Result() to display log level indicators
     */
    private LogIcon(label: string) {
        switch (label) {
            case "warning":
                return html`<sl-icon class="log-icon" name="exclamation-triangle-fill"></sl-icon>`;
            case "error":
                return html`<sl-icon class="log-icon" name="exclamation-circle-fill"></sl-icon>`;
            default:
                return html`<div class="log-icon-placeholder"></div>`;
        }
    }
}
