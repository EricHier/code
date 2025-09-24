import { localized } from "@lit/localize";
import { customElement } from "lit/decorators.js";
import Code from "../shared/ww-code-template";
import { htmlModule } from "./languageModules/htmlModule";

/**
 * Code widget for HTML with live preview functionality.
 * 
 * Provides a specialized code editor for HTML content with real-time preview capabilities.
 * When code is executed, it displays the HTML output in a sandboxed iframe, allowing
 * users to see the visual results of their HTML code immediately.
 * 
 * ## Key Features
 * - **HTML syntax highlighting** with CodeMirror's HTML language support
 * - **Live preview** - HTML output displayed in sandboxed iframe
 * - **Safe execution** - Uses iframe sandbox for security
 * - **Inherited functionality** - All base Code component features (visibility, auto-run, etc.)
 * 
 * ## Security
 * The HTML preview is displayed in an iframe with `sandbox="allow-scripts allow-modals"`
 * which provides a secure execution environment while allowing interactive HTML content.
 * 
 * ## Usage Examples
 * 
 * @example Basic HTML editing:
 * ```html
 * <webwriter-code-html 
 *   code="&lt;h1&gt;Hello World&lt;/h1&gt;&lt;p&gt;This is HTML!&lt;/p&gt;"
 *   visible="true"
 *   runnable="true">
 * </webwriter-code-html>
 * ```
 * 
 * @example Auto-running HTML with custom content:
 * ```html
 * <webwriter-code-html 
 *   code="&lt;div style='color: blue;'&gt;Styled content&lt;/div&gt;"
 *   auto-run="true"
 *   show-execution-time="true">
 * </webwriter-code-html>
 * ```
 * 
 * @example Educational template with locked structure:
 * ```html
 * <webwriter-code-html 
 *   code="&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;body&gt;\n  &lt;!-- Your content here --&gt;\n&lt;/body&gt;\n&lt;/html&gt;"
 *   locked-lines="[1, 2, 3, 5, 6]"
 *   visible="true">
 * </webwriter-code-html>
 * ```
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
@customElement("webwriter-code-html")
@localized()
export default class CodeHTML extends Code {
    /**
     * Creates a new HTML code widget.
     * 
     * Initializes the component with the HTML language module, which provides:
     * - HTML syntax highlighting and language features
     * - Live preview execution function that renders HTML in an iframe
     * - Proper handling of HTML-specific editor behaviors
     */
    constructor() {
        super(htmlModule);
    }
}
