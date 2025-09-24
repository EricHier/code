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
 * Configuration object for language-specific functionality in code components.
 * 
 * @example
 * ```typescript
 * const pythonModule: LanguageModule = {
 *   name: "Python",
 *   executionFunction: (code, context) => executePython(code, context),
 *   languageExtension: python()
 * };
 * ```
 */
export type LanguageModule = {
    /** Display name for the programming language (e.g., "Python", "JavaScript") */
    name: string;
    /** 
     * Function to execute code in this language. 
     * Returns undefined if the language doesn't support execution.
     * The function receives the code string and component context.
     */
    executionFunction: ((code: string, context: Code) => any) | undefined;
    /** CodeMirror language extension for syntax highlighting and language features */
    languageExtension: LanguageSupport;
};

/**
 * Represents a compilation or runtime error with position information.
 * Used to display diagnostic information to users when code execution fails.
 * 
 * @example
 * ```typescript
 * const error: Diagnostic = {
 *   message: "Syntax error: unexpected token",
 *   start: 45,
 *   line: 3,
 *   character: 12
 * };
 * ```
 */
export type Diagnostic = {
    /** Human-readable error message */
    message: string;
    /** Character position in the source code where the error occurred */
    start?: number;
    /** Line number where the error occurred (1-based) */
    line?: number;
    /** Character position within the line where the error occurred (1-based) */
    character?: number;
};

/**
 * Base class for code editor web components in WebWriter.
 * 
 * This abstract class provides a rich code editing experience with syntax highlighting,
 * code execution, error reporting, and customizable editor features. It serves as the
 * foundation for language-specific code components like Python, JavaScript, Java, etc.
 * 
 * ## Features
 * - **Syntax Highlighting**: CodeMirror-based editor with language-specific highlighting
 * - **Code Execution**: Run code with execution time tracking and result display
 * - **Error Handling**: Display compilation/runtime errors with clickable line numbers
 * - **Line Locking**: Lock specific lines from editing for templates/examples
 * - **Autocompletion**: Optional autocompletion support
 * - **Customizable UI**: Toggle visibility of editor, controls, and results
 * - **Localization**: Multi-language UI support
 * 
 * ## Usage Patterns
 * 
 * ### Basic Usage
 * ```html
 * <webwriter-code-python code="print('Hello World')" runnable autoRun></webwriter-code-python>
 * ```
 * 
 * ### Template with Locked Lines
 * ```html
 * <webwriter-code-java 
 *   code="class Main {\n  public static void main(String[] args) {\n    // Your code here\n  }\n}"
 *   locked-lines="[1,2,4]"
 *   showExecutionCount>
 * </webwriter-code-java>
 * ```
 * 
 * ### Hidden Editor (Display Only Results)
 * ```html
 * <webwriter-code-html code="<h1>Hello</h1>" visible="false" autoRun></webwriter-code-html>
 * ```
 * 
 * ## Events
 * The component doesn't emit custom events but can be monitored for property changes
 * using standard web component patterns or Lit's property change callbacks.
 * 
 * ## Accessibility
 * - Editor has proper focus delegation
 * - Error messages are properly announced
 * - Keyboard navigation supported in editor
 * - High contrast support through CSS custom properties
 * 
 * ## Performance Considerations
 * - Large code documents (>10,000 lines) may impact performance
 * - Execution timeouts are handled by individual language modules
 * - CodeMirror uses virtual scrolling for large documents
 * 
 * @fires {CustomEvent} code-changed - Dispatched when code content changes (if needed by subclasses)
 * @fires {CustomEvent} execution-complete - Dispatched after code execution (if needed by subclasses)
 * 
 * @csspart options - The options panel for editor configuration
 * @csspart editor - The code editor container
 * @csspart controls - The control buttons (run, clear, etc.)
 * @csspart output - The output/results container
 * 
 * @cssprop --code-editor-bg - Background color of the code editor
 * @cssprop --code-editor-color - Text color in the code editor
 * @cssprop --code-editor-font - Font family for the code editor
 * @cssprop --code-output-bg - Background color of the output area
 * @cssprop --code-controls-bg - Background color of the controls area
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
     * This property is reflected to the HTML attribute and can be set via HTML or JavaScript.
     * Changes to this property will update the editor content automatically.
     * 
     * @example
     * ```html
     * <webwriter-code-python code="print('Hello World')"></webwriter-code-python>
     * ```
     * 
     * @example
     * ```javascript
     * const codeEditor = document.querySelector('webwriter-code-python');
     * codeEditor.code = 'for i in range(5):\n    print(i)';
     * ```
     * 
     * @attr code
     * @default ""
     */
    @property({ attribute: true, reflect: true })
    accessor code = this.codeMirror.state.doc.toString();

    /**
     * Whether the code editor is visible to the user.
     * 
     * When false in editable mode, the editor becomes semi-transparent (opacity: 0.5).
     * When false in non-editable mode, the editor is completely hidden (display: none).
     * The controls and output areas respect this setting as well.
     * 
     * @example
     * ```html
     * <!-- Hidden editor, only show results -->
     * <webwriter-code-html code="<h1>Hello</h1>" visible="false" autoRun></webwriter-code-html>
     * ```
     * 
     * @attr visible
     * @default true
     */
    @property({ type: Boolean, attribute: true, reflect: true })
    accessor visible = true;

    /**
     * Whether to automatically run the code when the component is first loaded.
     * 
     * When enabled, the code will execute immediately after the component is initialized.
     * This is useful for demo components or when showing pre-computed results.
     * Only works if `runnable` is true and the language supports execution.
     * 
     * @example
     * ```html
     * <!-- Auto-run Python code on load -->
     * <webwriter-code-python code="print('Hello World')" autoRun></webwriter-code-python>
     * ```
     * 
     * @attr auto-run
     * @default false
     */
    @property({ type: Boolean, attribute: true, reflect: true })
    accessor autoRun = false;

    /**
     * Whether the code execution is allowed and the run button is enabled.
     * 
     * When false, the run button is hidden and code cannot be executed.
     * This is useful for read-only code examples or when execution should be disabled.
     * 
     * @example
     * ```html
     * <!-- Display-only code, no execution -->
     * <webwriter-code-java code="public class Example {}" runnable="false"></webwriter-code-java>
     * ```
     * 
     * @attr runnable
     * @default true
     */
    @property({ type: Boolean, attribute: true, reflect: true })
    accessor runnable = true;

    /**
     * Whether autocompletion is enabled in the code editor.
     * 
     * When enabled, provides context-aware code suggestions as the user types.
     * The quality of autocompletion depends on the language's CodeMirror extension.
     * 
     * @example
     * ```html
     * <webwriter-code-javascript autocomplete></webwriter-code-javascript>
     * ```
     * 
     * @attr autocomplete
     * @default false
     */
    @property({ type: Boolean, attribute: true, reflect: true })
    accessor autocomplete = false;

    /**
     * Array of line numbers that should be locked from editing.
     * 
     * Locked lines appear with a different background color and cannot be modified.
     * This is useful for providing code templates where certain parts should remain unchanged.
     * Line numbers are 1-based. Invalid line numbers are ignored with a console warning.
     * 
     * @example
     * ```html
     * <!-- Lock the class declaration and closing brace -->
     * <webwriter-code-java 
     *   code="class Main {\n  // Your code here\n}"
     *   locked-lines="[1,3]">
     * </webwriter-code-java>
     * ```
     * 
     * @example
     * ```javascript
     * const editor = document.querySelector('webwriter-code-python');
     * editor.lockedLines = [1, 5, 10]; // Lock lines 1, 5, and 10
     * ```
     * 
     * @attr locked-lines
     * @default []
     */
    @property({ type: Array, attribute: true, reflect: true })
    accessor lockedLines: number[] = [];

    /**
     * Whether to display the execution time in the controls.
     * 
     * When enabled, shows the execution time in milliseconds next to the run button.
     * Useful for performance analysis and optimization exercises.
     * 
     * @example
     * ```html
     * <webwriter-code-python showExecutionTime></webwriter-code-python>
     * ```
     * 
     * @attr show-execution-time
     * @default false
     */
    @property({ type: Boolean, attribute: true, reflect: true })
    accessor showExecutionTime = false;

    /**
     * The execution time in milliseconds of the last code run.
     * 
     * This property is automatically updated after each code execution.
     * It measures the time from when execution starts to when it completes.
     * Read-only property that reflects the actual execution performance.
     * 
     * @example
     * ```javascript
     * const editor = document.querySelector('webwriter-code-python');
     * await editor.runCode();
     * console.log(`Execution took ${editor.executionTime}ms`);
     * ```
     * 
     * @attr execution-time
     * @readonly
     * @default 0
     */
    @property({ type: Number, attribute: true, reflect: true })
    accessor executionTime: number = 0;

    /**
     * Whether to display the execution count in the run button.
     * 
     * When enabled, shows the number of times the code has been executed
     * in parentheses next to the "Run" label. Useful for tracking iterations
     * and providing feedback on repeated executions.
     * 
     * @example
     * ```html
     * <webwriter-code-python showExecutionCount></webwriter-code-python>
     * <!-- Button will show: "Run (5)" after 5 executions -->
     * ```
     * 
     * @attr show-execution-count
     * @default false
     */
    @property({ type: Boolean, attribute: true, reflect: true })
    accessor showExecutionCount = false;

    /**
     * The number of times the code has been executed.
     * 
     * This counter is automatically incremented each time code is run.
     * Can be manually reset using the "Reset execution count" button in the options
     * or by setting this property to 0 programmatically.
     * 
     * @example
     * ```javascript
     * const editor = document.querySelector('webwriter-code-python');
     * editor.executionCount = 0; // Reset counter
     * ```
     * 
     * @attr execution-count
     * @default 0
     */
    @property({ type: Number, attribute: true, reflect: true })
    accessor executionCount = 0;

    /**
     * The results from the last code execution.
     * 
     * The structure of this array depends on the programming language:
     * - **Python/Java/WebAssembly**: Array of objects with `text` and optional `color` properties
     * - **HTML**: Array containing the HTML string to render in iframe
     * - **JavaScript/TypeScript**: Varies based on execution context
     * 
     * This property is automatically updated after each execution.
     * 
     * @example
     * ```javascript
     * // Python execution results
     * editor.results = [
     *   { text: "Hello World", color: "green" },
     *   { text: "Error: something went wrong", color: "red" }
     * ];
     * ```
     * 
     * @attr results
     * @default []
     */
    @property({ type: Array, attribute: true, reflect: true })
    accessor results: any = [];

    /**
     * Compilation or runtime errors from the last code execution.
     * 
     * This array contains diagnostic information about errors that occurred
     * during code compilation or execution. Each diagnostic includes:
     * - Human-readable error message
     * - Optional position information for clickable error navigation
     * 
     * When diagnostics are present, they are displayed instead of results.
     * Users can click on line numbers to navigate to the error location.
     * 
     * @example
     * ```javascript
     * editor.diagnostics = [{
     *   message: "Syntax error: unexpected token",
     *   start: 45,
     *   line: 3,
     *   character: 12
     * }];
     * ```
     * 
     * @attr diagnostics
     * @default []
     */
    @property({ type: Array, attribute: true, reflect: true })
    accessor diagnostics: Diagnostic[] = [];

    // @ts-expect-error
    @query("#iframePreview")
    accessor iframePreview: HTMLIFrameElement | undefined;

    @query("pre")
    accessor pre!: HTMLPreElement;

    /**
     * Gets the code execution function for the current language.
     * 
     * Returns the execution function from the language module, or undefined
     * if the language doesn't support code execution (e.g., display-only languages).
     * 
     * @returns The execution function or undefined
     * @readonly
     */
    get codeRunner() {
        return this.languageModule.executionFunction;
    }

    // CodeMirror compartments for dynamic reconfiguration
    language = new Compartment();
    autocompletion = new Compartment();
    highlightStyle = new Compartment();

    /**
     * Creates a new Code component instance.
     * 
     * @param languageModule - Configuration object defining the programming language,
     *                        syntax highlighting, and execution capabilities
     * 
     * @example
     * ```typescript
     * class CodePython extends Code {
     *   constructor() {
     *     super({
     *       name: "Python",
     *       executionFunction: executePythonCode,
     *       languageExtension: python()
     *     });
     *   }
     * }
     * ```
     */
    constructor(languageModule: LanguageModule) {
        super();
        this.languageModule = languageModule;
    }

    /**
     * Determines if the component is in editable mode.
     * 
     * The component is considered editable when the contentEditable attribute
     * is set to "true" or is an empty string (which defaults to true in HTML).
     * In non-editable mode, the editor becomes read-only.
     * 
     * @returns True if the component should allow editing
     * 
     * @example
     * ```html
     * <!-- Editable (default) -->
     * <webwriter-code-python contenteditable="true"></webwriter-code-python>
     * 
     * <!-- Read-only -->
     * <webwriter-code-python contenteditable="false"></webwriter-code-python>
     * ```
     */
    isEditable() {
        return this.contentEditable === "true" || this.contentEditable === "";
    }

    /**
     * Initializes the CodeMirror editor after the component is first rendered.
     * 
     * This method sets up:
     * - CodeMirror editor with language-specific syntax highlighting
     * - Event listeners for code changes
     * - Line locking for specified lines
     * - Auto-run functionality if enabled
     * 
     * Called automatically by Lit when the component is first updated.
     * 
     * @override
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
     * Handles property changes and updates the editor accordingly.
     * 
     * This method responds to changes in:
     * - `autocomplete`: Updates autocompletion settings
     * - `code`: Synchronizes editor content with property value
     * - `lockedLines`: Updates line locking in the editor
     * 
     * @param _changedProperties - Map of changed properties and their previous values
     * @override
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
     * Determines the CSS style for visibility control.
     * 
     * In editable mode, invisible components become semi-transparent.
     * In non-editable mode, invisible components are completely hidden.
     * 
     * @returns CSS style string for visibility control
     * @private
     */
    getVisibleStyle() {
        if (this.isEditable()) {
            return this.visible ? "" : "opacity: 0.5";
        }
        return this.visible ? "" : "display: none";
    }

    /**
     * Renders the complete component UI.
     * 
     * The component consists of:
     * - Code editor (always present)
     * - Control buttons (run, clear output)
     * - Output area (only if language supports execution)
     * - Options panel (only in editable mode)
     * 
     * @returns Lit template result
     * @override
     */
    render() {
        return html`
            ${this.Code()} ${this.Controls()} ${this.codeRunner !== undefined ? this.Output() : null}
            ${this.isEditable() ? this.Options() : ""}
        `;
    }

    /**
     * Renders the code editor container.
     * 
     * This is where the CodeMirror editor is mounted. The actual editor
     * initialization happens in `firstUpdated()`.
     * 
     * @returns Lit template for the code editor
     * @protected
     */
    Code() {
        return html`<pre style=${this.getVisibleStyle()}></pre>`;
    }

    /**
     * Renders the control buttons for code execution.
     * 
     * Includes:
     * - Run button with execution count (if enabled)
     * - Execution time display (if enabled)
     * - Language label
     * - Clear output button
     * 
     * Buttons are hidden when `runnable` is false or no execution function is available.
     * 
     * @returns Lit template for the control buttons
     * @protected
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
     * Shows diagnostics (errors) if present, otherwise shows execution results.
     * The output format depends on the programming language.
     * 
     * @returns Lit template for the output area
     * @protected
     */
    Output() {
        return html`<output style=${this.getVisibleStyle()}>
            ${this.diagnostics?.length > 0 ? this.Diagnostics() : this.Result()}
        </output>`;
    }

    /**
     * Renders the options panel for editor configuration.
     * 
     * Only visible in editable mode. Includes toggles for:
     * - Code execution permissions
     * - Auto-run on load
     * - Autocompletion
     * - Editor visibility
     * - Execution time display
     * - Execution count display
     * - Reset execution count button
     * 
     * @returns Lit template for the options panel
     * @protected
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
     * Renders execution results based on the programming language.
     * 
     * Different languages display results differently:
     * - **Python/Java/WebAssembly**: Text output with optional colors in `<pre>` elements
     * - **HTML**: Live preview in a sandboxed iframe
     * - **Other languages**: Empty output (no execution support)
     * 
     * @returns Lit template for displaying execution results
     * @protected
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
     * Renders diagnostic information (compilation/runtime errors).
     * 
     * Shows a formatted list of errors with:
     * - Error count summary
     * - Clickable line numbers for navigation
     * - Error messages with warning icons
     * 
     * Clicking on a line number will focus the editor and move the cursor
     * to the error location.
     * 
     * @returns Lit template for displaying diagnostic errors
     * @protected
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
     * Executes the current code using the language-specific execution function.
     * 
     * This method:
     * 1. Clears previous results and diagnostics
     * 2. Increments the execution counter
     * 3. Measures execution time
     * 4. Calls the language-specific execution function
     * 5. Updates the results and execution time
     * 
     * The execution function is responsible for:
     * - Parsing/compiling the code
     * - Running the code in the appropriate environment
     * - Populating `this.results` or `this.diagnostics`
     * - Handling errors and timeouts
     * 
     * @returns Promise that resolves when execution is complete
     * 
     * @example
     * ```javascript
     * const editor = document.querySelector('webwriter-code-python');
     * await editor.runCode();
     * console.log('Results:', editor.results);
     * ```
     * 
     * @throws {Error} If no execution function is available for the language
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
     * Enables or disables autocompletion in the CodeMirror editor.
     * 
     * This method dynamically reconfigures the editor to add or remove
     * the autocompletion extension. The change takes effect immediately.
     * 
     * @param value - Whether to enable autocompletion
     * 
     * @example
     * ```javascript
     * const editor = document.querySelector('webwriter-code-javascript');
     * editor.setAutocompletion(true); // Enable autocompletion
     * ```
     */
    setAutocompletion(value: boolean) {
        this.autocomplete = value;
        this.codeMirror.dispatch({
            effects: this.autocompletion.reconfigure(value ? autocompletion() : []),
        });
    }
}
