import "@shoelace-style/shoelace/dist/themes/light.css";
import { LitElementWw } from "@webwriter/lit";
import { LitElement, PropertyValueMap, html } from "lit";
import { property, query } from "lit/decorators.js";

import { style } from "./ww-code-css-single";

// CodeMirror
import { autocompletion } from "@codemirror/autocomplete";
import { LanguageSupport } from "@codemirror/language";
import { Compartment, StateEffect } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { lineLockEffect, lineLockField, setupCodeMirror } from "./codemirror-setup";

// Shoelace Components
import SlButton from "@shoelace-style/shoelace/dist/components/button/button.js";
import SlDetails from "@shoelace-style/shoelace/dist/components/details/details.js";
import SlIcon from "@shoelace-style/shoelace/dist/components/icon/icon.js";
import SlInput from "@shoelace-style/shoelace/dist/components/input/input.js";
import SlSwitch from "@shoelace-style/shoelace/dist/components/switch/switch.js";
import "./shoelace-icons";

import { msg } from "@lit/localize";
import LOCALIZE from "../../localization/generated";

/**
 * Configuration object that defines how a specific programming language is handled within the code editor.
 * 
 * @example
 * ```typescript
 * const pythonModule: LanguageModule = {
 *   name: "Python",
 *   executionFunction: async (code: string, context: Code) => {
 *     // Execute Python code and update context.results
 *   },
 *   languageExtension: python()
 * };
 * ```
 */
export type LanguageModule = {
    /** The display name of the programming language (e.g., "Python", "JavaScript", "HTML") */
    name: string;
    /** 
     * Function that executes code for this language. Should be undefined if execution is not supported.
     * The function receives the code string and the component context, and should update the context's
     * results and diagnostics properties. May be async.
     */
    executionFunction: ((code: string, context: Code) => any) | undefined;
    /** CodeMirror language extension that provides syntax highlighting and language-specific features */
    languageExtension: LanguageSupport;
};

/**
 * Represents a compilation or runtime error from code execution.
 * Used to display error information to users with optional position highlighting.
 */
export type Diagnostic = {
    /** Human-readable error message describing what went wrong */
    message: string;
    /** Character position in the source code where the error occurred (0-based) */
    start?: number;
    /** Line number where the error occurred (1-based) */
    line?: number;
    /** Column/character position within the line where the error occurred (1-based) */
    character?: number;
};

/**
 * Abstract base class for code editor widgets in WebWriter.
 * 
 * Provides a comprehensive code editing experience with syntax highlighting, execution capabilities,
 * error reporting, and configurable UI options. Designed to be extended by language-specific
 * implementations that provide their own execution logic and language modules.
 * 
 * ## Key Features
 * - **Syntax highlighting** via CodeMirror with language-specific extensions
 * - **Code execution** with configurable runners and result display
 * - **Error reporting** with clickable error locations
 * - **Line locking** to prevent editing of specific lines
 * - **Autocompletion** support
 * - **Execution metrics** including timing and run counts
 * - **Responsive visibility controls** for authoring vs. viewing modes
 * 
 * ## CSS Parts
 * - `options` - The options/settings panel (visible only in editing mode)
 * 
 * ## Events
 * This component does not emit custom events, but responds to standard DOM events
 * from its child elements (buttons, switches, etc.).
 * 
 * ## Slots
 * This component does not use slots - all content is rendered via templates.
 * 
 * @example Basic usage (extended by language-specific components):
 * ```typescript
 * class MyCodeWidget extends Code {
 *   constructor() {
 *     super({
 *       name: "MyLanguage",
 *       executionFunction: async (code, context) => {
 *         // Custom execution logic
 *         context.results = ["Execution completed"];
 *       },
 *       languageExtension: myLanguageExtension()
 *     });
 *   }
 * }
 * ```
 * 
 * @example HTML usage:
 * ```html
 * <webwriter-code-python 
 *   code="print('Hello World')"
 *   auto-run="true"
 *   visible="true"
 *   runnable="true">
 * </webwriter-code-python>
 * ```
 */
export default abstract class Code extends LitElementWw {
    static styles = style;

    static get scopedElements() {
        return {
            "sl-button": SlButton,
            "sl-input": SlInput,
            "sl-switch": SlSwitch,
            "sl-details": SlDetails,
            "sl-icon": SlIcon,
        };
    }

    static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

    localize = LOCALIZE;

    private codeMirror: EditorView = new EditorView();
    private languageModule!: LanguageModule;

    /**
     * The source code content displayed in the editor.
     * 
     * This is the main content that users edit and execute. Changes to this property
     * will update the CodeMirror editor content. Supports multi-line code with
     * language-specific syntax highlighting.
     * 
     * @default "" (empty string)
     * @example
     * ```html
     * <webwriter-code-python code="print('Hello World')"></webwriter-code-python>
     * ```
     */
    @property({ attribute: true, reflect: true })
    accessor code = this.codeMirror.state.doc.toString();

    /**
     * Whether the code editor is visible to the user.
     * 
     * When `false`, the editor becomes either hidden (in view mode) or semi-transparent
     * (in edit mode). This allows for conditional display of code sections in educational
     * content or interactive documents.
     * 
     * @default true
     * @example
     * ```html
     * <!-- Hide the editor initially -->
     * <webwriter-code-javascript visible="false"></webwriter-code-javascript>
     * ```
     */
    @property({ type: Boolean, attribute: true, reflect: true })
    accessor visible = true;

    /**
     * Whether to automatically run the code when the component is first loaded.
     * 
     * If `true`, the code will execute immediately after the component is initialized
     * and the language module is ready. Only works if `runnable` is also `true` and
     * an execution function is available.
     * 
     * @default false
     * @example
     * ```html
     * <!-- Auto-execute on load -->
     * <webwriter-code-python code="print('Welcome!')" auto-run="true"></webwriter-code-python>
     * ```
     */
    @property({ type: Boolean, attribute: true, reflect: true })
    accessor autoRun = false;

    /**
     * Whether the code execution is allowed and the run button is enabled.
     * 
     * When `false`, disables the run button and prevents code execution, even if
     * an execution function is available. Useful for creating read-only code examples
     * or temporarily disabling execution during editing.
     * 
     * @default true
     * @example
     * ```html
     * <!-- Display code but prevent execution -->
     * <webwriter-code-javascript runnable="false"></webwriter-code-javascript>
     * ```
     */
    @property({ type: Boolean, attribute: true, reflect: true })
    accessor runnable = true;

    /**
     * Whether autocompletion is enabled in the code editor.
     * 
     * When `true`, enables CodeMirror's autocompletion feature, providing suggestions
     * for language keywords, variables, and functions as the user types. The specific
     * completions available depend on the language module.
     * 
     * @default false
     * @example
     * ```html
     * <!-- Enable autocompletion for better UX -->
     * <webwriter-code-python autocomplete="true"></webwriter-code-python>
     * ```
     */
    @property({ type: Boolean, attribute: true, reflect: true })
    accessor autocomplete = false;

    /**
     * Array of line numbers that should be locked from editing.
     * 
     * Locked lines cannot be modified by users and are visually indicated in the editor.
     * Line numbers are 1-based. Useful for template code, imports, or other code that
     * should remain unchanged. Invalid line numbers are ignored with console warnings.
     * 
     * @default []
     * @example
     * ```html
     * <!-- Lock the first two lines -->
     * <webwriter-code-python locked-lines="[1, 2]" code="import sys\nprint('Template:')\n# Your code here"></webwriter-code-python>
     * ```
     */
    @property({ type: Array, attribute: true, reflect: true })
    accessor lockedLines: number[] = [];

    /**
     * Whether to display the execution time in the controls.
     * 
     * When `true`, shows the execution time in milliseconds next to the run button
     * after code execution completes. Helps users understand performance characteristics
     * of their code.
     * 
     * @default false
     * @example
     * ```html
     * <!-- Show execution timing -->
     * <webwriter-code-python show-execution-time="true"></webwriter-code-python>
     * ```
     */
    @property({ type: Boolean, attribute: true, reflect: true })
    accessor showExecutionTime = false;

    /**
     * The execution time in milliseconds of the last code run.
     * 
     * Automatically updated after each code execution. Measured from the start
     * of the execution function call to its completion (including async operations).
     * Only displayed if `showExecutionTime` is `true`.
     * 
     * @default 0
     * @readonly This property is automatically updated and should not be set manually
     */
    @property({ type: Number, attribute: true, reflect: true })
    accessor executionTime: number = 0;

    /**
     * Whether to display the execution count in the run button.
     * 
     * When `true`, shows the number of times the code has been executed in parentheses
     * next to the "Run" button text. Useful for tracking execution frequency in
     * educational or debugging contexts.
     * 
     * @default false
     * @example
     * ```html
     * <!-- Show execution count: "Run (3)" -->
     * <webwriter-code-python show-execution-count="true"></webwriter-code-python>
     * ```
     */
    @property({ type: Boolean, attribute: true, reflect: true })
    accessor showExecutionCount = false;

    /**
     * The number of times the code has been executed.
     * 
     * Automatically incremented each time the code is run. Can be reset to 0 using
     * the "Reset execution count" button in the options panel. Only displayed if
     * `showExecutionCount` is `true`.
     * 
     * @default 0
     * @example Reset programmatically:
     * ```javascript
     * codeWidget.executionCount = 0;
     * ```
     */
    @property({ type: Number, attribute: true, reflect: true })
    accessor executionCount = 0;

    /**
     * The results from the last code execution.
     * 
     * Format varies by language:
     * - **Python/Java/WebAssembly**: Array of objects with `text` and `color` properties
     * - **HTML**: Array containing the HTML string to display in iframe
     * - **JavaScript/TypeScript**: Array of log entries with `label` and `logs` properties
     * 
     * Cleared before each new execution and populated by the language's execution function.
     * 
     * @default []
     * @example Typical Python result:
     * ```javascript
     * // After running: print("Hello", "World")
     * results = [
     *   { text: "Hello World", color: "#000000" }
     * ]
     * ```
     */
    @property({ type: Array, attribute: true, reflect: true })
    accessor results: any = [];

    /**
     * Compilation or runtime errors from the last code execution.
     * 
     * Array of `Diagnostic` objects representing errors, warnings, or other issues
     * encountered during code execution. When present, these are displayed instead
     * of results, with clickable line numbers for navigation to error locations.
     * 
     * @default []
     * @example Typical diagnostic:
     * ```javascript
     * diagnostics = [{
     *   message: "SyntaxError: invalid syntax",
     *   line: 2,
     *   character: 15,
     *   start: 25
     * }]
     * ```
     */
    @property({ type: Array, attribute: true, reflect: true })
    accessor diagnostics: Diagnostic[] = [];

    /**
     * Reference to the iframe element used for HTML preview (HTML language only).
     * @internal Used internally for HTML code execution results
     */
    // @ts-expect-error
    @query("#iframePreview")
    accessor iframePreview: HTMLIFrameElement | undefined;

    /**
     * Reference to the pre element that contains the CodeMirror editor.
     * @internal Used internally for CodeMirror initialization
     */
    @query("pre")
    accessor pre!: HTMLPreElement;

    /**
     * Gets the code execution function for the current language module.
     * 
     * Returns `undefined` if the language doesn't support execution (e.g., read-only languages).
     * This is used internally to determine whether to show run controls and execute code.
     * 
     * @returns The execution function or undefined if not available
     */
    get codeRunner() {
        return this.languageModule.executionFunction;
    }

    /**
     * CodeMirror language compartment for dynamic language switching.
     * @internal
     */
    language = new Compartment();
    
    /**
     * CodeMirror autocompletion compartment for dynamic autocompletion toggling.
     * @internal
     */
    autocompletion = new Compartment();
    
    /**
     * CodeMirror highlight style compartment for dynamic theme switching.
     * @internal
     */
    highlightStyle = new Compartment();

    /**
     * Creates a new Code component instance.
     * 
     * @param languageModule - Configuration object defining the language support,
     *                        execution capabilities, and CodeMirror extensions
     * 
     * @example
     * ```typescript
     * constructor() {
     *   super({
     *     name: "Python",
     *     executionFunction: async (code, context) => {
     *       // Python execution logic
     *     },
     *     languageExtension: python()
     *   });
     * }
     * ```
     */
    constructor(languageModule: LanguageModule) {
        super();
        this.languageModule = languageModule;
    }

    /**
     * Determines if the component is in an editable state.
     * 
     * Checks the `contentEditable` attribute to determine whether the component
     * should show editing controls and allow code modification. This affects
     * visibility behavior and control display.
     * 
     * @returns `true` if the component is editable, `false` otherwise
     */
    isEditable() {
        return this.contentEditable === "true" || this.contentEditable === "";
    }

    /**
     * Initializes the CodeMirror editor and sets up all necessary extensions.
     * 
     * This lifecycle hook is called once when the component is first updated.
     * It creates the CodeMirror instance, configures language support, sets up
     * line locking, and triggers auto-run if enabled.
     * 
     * **Key initialization steps:**
     * - Creates CodeMirror editor with language-specific extensions
     * - Sets up document change listeners to sync with the `code` property
     * - Applies line locking for protected code sections
     * - Executes code automatically if `autoRun` is enabled
     * 
     * @internal This is a Lit lifecycle method called automatically
     */
    firstUpdated() {
        this.codeMirror = setupCodeMirror(
            this.code,
            this.pre,
            this.isEditable(),
            [
                this.language.of(this.languageModule.languageExtension),
                this.autocompletion.of(autocompletion()),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        this.code = update.state.doc.toString();
                    }
                }),
            ],
            () => msg("This section of code is locked and cannot be edited"),
        );

        if (this.lockedLines.length > 0) {
            this.codeMirror.dispatch({
                effects: this.lockedLines
                    .map((lineNumber) => {
                        try {
                            const line = this.codeMirror.state.doc.line(lineNumber);
                            return lineLockEffect.of({ pos: line.from, on: true });
                        } catch (error) {
                            console.warn(`Line number ${lineNumber} is out of bounds for the document.`);
                            return null;
                        }
                    })
                    .filter((effect) => effect !== null),
            });
        }
        this.codeMirror.state.field(lineLockField).onLockedLinesChange = (lockedLines: number[]) => {
            this.lockedLines = lockedLines;
        };

        if (this.autoRun) {
            this.runCode();
        }
    }

    /**
     * Handles property changes and updates the CodeMirror editor accordingly.
     * 
     * This lifecycle method responds to changes in component properties and
     * updates the CodeMirror editor state as needed. Handles:
     * - Autocompletion toggling
     * - Code content synchronization
     * - Line locking updates
     * 
     * @param _changedProperties - Map of changed properties and their previous values
     * @internal This is a Lit lifecycle method called automatically
     */
    protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        if (_changedProperties.has("autocomplete")) {
            this.setAutocompletion(this.autocomplete);
        }

        if (_changedProperties.has("code")) {
            if (this.codeMirror.state.doc.toString() !== this.code) {
                this.codeMirror.dispatch({
                    changes: { from: 0, to: this.codeMirror.state.doc.length, insert: this.code },
                });
            }
        }

        if (_changedProperties.has("lockedLines")) {
            let remainingLinesToLock = this.lockedLines;

            let effects: StateEffect<any>[] = [];
            this.codeMirror.state.field(lineLockField).markers.between(0, this.codeMirror.state.doc.length, (from) => {
                const line = this.codeMirror.state.doc.lineAt(from);
                if (!remainingLinesToLock.includes(line.number)) {
                    effects.push(lineLockEffect.of({ pos: from, on: false }));
                } else {
                    remainingLinesToLock = remainingLinesToLock.filter((l) => l !== line.number);
                }
            });

            remainingLinesToLock.forEach((lineNumber) => {
                if (lineNumber < 1 || lineNumber > this.codeMirror.state.doc.lines) {
                    console.warn(`Line number ${lineNumber} is out of bounds for the document.`);
                    return;
                }
                const line = this.codeMirror.state.doc.line(lineNumber);
                effects.push(lineLockEffect.of({ pos: line.from, on: true }));
            });

            if (effects.length > 0) this.codeMirror.dispatch({ effects });
        }
    }

    /**
     * Determines the appropriate CSS styles for visibility control.
     * 
     * Returns different styles based on whether the component is in editing
     * or viewing mode:
     * - **Editing mode**: Returns opacity control (semi-transparent when hidden)
     * - **Viewing mode**: Returns display control (completely hidden when not visible)
     * 
     * @returns CSS style string for the current visibility state
     * @internal Used by template methods to control element visibility
     */
    getVisibleStyle() {
        if (this.isEditable()) {
            return this.visible ? "" : "opacity: 0.5";
        }
        return this.visible ? "" : "display: none";
    }

    /**
     * Renders the complete component template.
     * 
     * The component is structured with:
     * 1. **Code editor** - The main CodeMirror editing area
     * 2. **Controls** - Run button, timing display, and clear button
     * 3. **Output** - Results or diagnostics from code execution (if execution is supported)
     * 4. **Options** - Settings panel (only visible in editing mode)
     * 
     * @returns The complete component template
     * @internal This is a Lit lifecycle method called automatically
     */
    render() {
        return html`
            ${this.Code()} ${this.Controls()} ${this.codeRunner !== undefined ? this.Output() : null}
            ${this.isEditable() ? this.Options() : ""}
        `;
    }

    /**
     * Renders the code editor area.
     * 
     * Creates a `<pre>` element that serves as the container for the CodeMirror editor.
     * The editor is initialized in `firstUpdated()` and attached to this element.
     * 
     * @returns Template for the code editor container
     * @internal Called by render()
     */
    Code() {
        return html`<pre style=${this.getVisibleStyle()}></pre>`;
    }

    /**
     * Renders the control buttons and execution information.
     * 
     * Includes:
     * - **Run button** - Executes the code (visible only if execution is supported and runnable)
     * - **Execution time** - Shows timing if `showExecutionTime` is enabled
     * - **Language label** - Displays the language name
     * - **Clear button** - Clears results and diagnostics
     * 
     * All controls respect the visibility settings and execution capabilities.
     * 
     * @returns Template for the control area
     * @internal Called by render()
     */
    Controls() {
        return html`<div class="controls" style=${this.getVisibleStyle()}>
            <sl-button
                variant="primary"
                size="small"
                ?disabled=${this.codeRunner === undefined}
                @click="${this.runCode}"
                style=${this.runnable && this.codeRunner !== undefined ? "" : "display: none"}
            >
                <sl-icon name="${this.autoRun ? "play-circle" : "play-fill"}" slot="prefix"></sl-icon>
                ${msg("Run")} ${this.showExecutionCount ? `(${this.executionCount})` : ""}
            </sl-button>
            ${this.showExecutionTime ? html`<div class="executionTime">${this.executionTime.toFixed(1)}ms</div>` : ""}
            <div class="language-label">${this.languageModule.name}</div>
            <sl-button
                size="small"
                @click=${() => {
                    this.results = [];
                    this.diagnostics = [];
                    this.executionTime = 0;
                }}
                style=${this.runnable && this.codeRunner !== undefined ? "" : "display: none"}
            >
                ${msg("Clear Output")}
            </sl-button>
        </div>`;
    }

    /**
     * Renders the output area for execution results or diagnostics.
     * 
     * Displays either:
     * - **Diagnostics** - If there are compilation/runtime errors
     * - **Results** - If execution completed successfully
     * 
     * The output format varies by language and is handled by language-specific
     * implementations of the `Result()` method.
     * 
     * @returns Template for the output area
     * @internal Called by render()
     */
    Output() {
        return html`<output style=${this.getVisibleStyle()}>
            ${this.diagnostics?.length > 0 ? this.Diagnostics() : this.Result()}
        </output>`;
    }

    /**
     * Renders the options/settings panel for the component.
     * 
     * Only visible in editing mode. Provides toggles for:
     * 
     * **Execution Settings:**
     * - Allow code execution (runnable)
     * - Run on load (autoRun)
     * 
     * **Editor Settings:**
     * - Autocompletion
     * - Visibility
     * 
     * **Results Settings:**
     * - Show execution time
     * - Show execution count
     * - Reset execution count button
     * 
     * @returns Template for the options panel (CSS part: "options")
     * @internal Called by render() in editing mode only
     */
    Options() {
        return html`<aside part="options" style="z-index: 1000">
            <h2>${msg("Execution")}</h2>
            <sl-switch
                @sl-change=${(event: any) => {
                    if (event.target) {
                        let target = event.target as SlSwitch;
                        this.runnable = target.checked;
                    }
                }}
                ?checked=${this.runnable}
                ?disabled=${this.codeRunner === undefined}
                >${msg("Allow Code execution")}</sl-switch
            >
            <sl-switch
                @sl-change=${(e: any) => (this.autoRun = e.target.checked)}
                ?checked=${this.autoRun}
                ?disabled=${this.codeRunner === undefined}
                >${msg("Run on load")}</sl-switch
            >
            <h2>${msg("Editor")}</h2>
            <sl-switch
                @sl-change=${(event: any) => {
                    if (event.target) {
                        let target = event.target as SlSwitch;
                        this.setAutocompletion(target.checked);
                    }
                }}
                ?checked=${this.autocomplete}
                >${msg("Autocompletion")}</sl-switch
            >

            <sl-switch @sl-change=${(e: any) => (this.visible = e.target.checked)} ?checked=${this.visible}
                >${msg("Visible")}</sl-switch
            >

            <h2>${msg("Results")}</h2>
            <sl-switch
                @sl-change=${(e: any) => (this.showExecutionTime = e.target.checked)}
                ?checked=${this.showExecutionTime}
                >${msg("Show execution time")}</sl-switch
            >
            <sl-switch
                @sl-change=${(e: any) => (this.showExecutionCount = e.target.checked)}
                ?checked=${this.showExecutionCount}
                >${msg("Show execution count")}</sl-switch
            >
            <sl-button @click=${() => (this.executionCount = 0)}
                ><span class="button-label-linebreak">${msg("Reset execution count")}</span></sl-button
            >
        </aside>`;
    }

    /**
     * Renders execution results based on the language type.
     * 
     * **Language-specific result formats:**
     * - **Python/Java/WebAssembly**: Displays text outputs with optional colors
     * - **HTML**: Shows live preview in a sandboxed iframe
     * - **Other languages**: No default result display (override in subclass)
     * 
     * Language-specific implementations should override this method to provide
     * custom result rendering (e.g., JavaScript/TypeScript components do this).
     * 
     * @returns Template for displaying execution results
     * @internal Called by Output() when there are no diagnostics
     */
    Result() {
        switch (this.languageModule.name) {
            case "Python":
            case "WebAssembly":
            case "Java":
                const outputs = this.results
                    .filter((r: any) => r !== undefined)
                    .map((r: any) => html`<pre style="color:${r?.color}">${r?.text}</pre>`);
                return html` <div class="outputs">${outputs}</div>`;
            case "HTML":
                return html` <iframe
                    id="iframePreview"
                    class="htmlPreview"
                    srcdoc=${this.results[0]}
                    sandbox="allow-scripts allow-modals"
                ></iframe>`;
            default:
                return html``;
        }
    }

    /**
     * Renders compilation or runtime errors.
     * 
     * Displays a list of diagnostic messages with:
     * - Error icons
     * - Clickable line numbers (when position information is available)
     * - Human-readable error messages
     * 
     * Clicking on line numbers focuses the editor and navigates to the error location.
     * 
     * @returns Template for displaying diagnostics/errors
     * @internal Called by Output() when there are diagnostics
     */
    Diagnostics() {
        return html`
            <div class="diagnostics-container">
                ${this.languageModule.name} compilation failed with ${this.diagnostics.length}
                error${this.diagnostics.length > 1 ? "s" : ""}:
                <div class="diagnostics-list">
                    ${this.diagnostics.map(
                        (d) => html`
                            <sl-icon name="exclamation-triangle-fill" class="diagnostic-icon"></sl-icon>
                            ${d.start
                                ? html` <a
                                      class="diagnostic-line-number"
                                      href="#"
                                      @click=${(event: Event) => {
                                          event.preventDefault();
                                          this.codeMirror.focus();
                                          if (typeof d.start === "number") {
                                              this.codeMirror.dispatch({
                                                  selection: { anchor: d.start },
                                              });
                                          }
                                      }}
                                      >${d.line}:${d.character}</a
                                  >`
                                : ""}
                            <div class="diagnostic-message">${d.message}</div>
                        `,
                    )}
                </div>
            </div>
        `;
    }

    /**
     * Executes the current code using the language module's execution function.
     * 
     * **Execution process:**
     * 1. Clears previous results and diagnostics
     * 2. Increments execution count
     * 3. Measures execution time
     * 4. Calls the language-specific execution function
     * 5. Updates execution time and triggers re-render
     * 
     * The execution function receives the code string and component context,
     * and should populate the `results` and/or `diagnostics` properties.
     * 
     * **Edge cases:**
     * - Does nothing if no execution function is available
     * - Handles both synchronous and asynchronous execution functions
     * - Execution timing includes async operations
     * 
     * @example Manual execution:
     * ```javascript
     * await codeWidget.runCode();
     * ```
     * 
     * @returns Promise that resolves when execution completes
     */
    async runCode() {
        if (!this.codeRunner) {
            return;
        }
        this.results = [];
        this.diagnostics = [];

        this.executionCount++;
        const code = this.codeMirror.state.doc.toString();
        const startTime = performance.now();
        await this.codeRunner(code, this);
        const endTime = performance.now();
        this.executionTime = endTime - startTime;
    }

    /**
     * Toggles autocompletion in the CodeMirror editor.
     * 
     * Dynamically reconfigures the CodeMirror editor to enable or disable
     * autocompletion features. The specific completions available depend on
     * the language module being used.
     * 
     * @param value - `true` to enable autocompletion, `false` to disable
     * 
     * @example
     * ```javascript
     * codeWidget.setAutocompletion(true);  // Enable completions
     * codeWidget.setAutocompletion(false); // Disable completions
     * ```
     */
    setAutocompletion(value: boolean) {
        this.autocomplete = value;
        this.codeMirror.dispatch({
            effects: this.autocompletion.reconfigure(value ? autocompletion() : []),
        });
    }
}
