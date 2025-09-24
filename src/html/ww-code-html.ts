import { localized } from "@lit/localize";
import { customElement } from "lit/decorators.js";
import Code from "../shared/ww-code-template";
import { htmlModule } from "./languageModules/htmlModule";

/**
 * Code widget for HTML with live preview functionality.
 * 
 * This component provides a specialized code editor for HTML content with instant
 * live preview in a sandboxed iframe. Perfect for teaching HTML basics, creating
 * interactive examples, or building small HTML demos.
 * 
 * ## Features
 * - **Live Preview**: HTML renders immediately in a sandboxed iframe
 * - **HTML Syntax Highlighting**: Full HTML syntax support including tags, attributes, and entities
 * - **Safe Execution**: Content runs in a sandboxed iframe with restricted permissions
 * - **Template Support**: Lock lines to create HTML templates for students
 * - **Auto-Run**: Perfect for demonstrations with instant visual feedback
 * 
 * ## Security
 * The HTML preview runs in a sandboxed iframe with:
 * - `allow-scripts`: JavaScript execution allowed within the iframe
 * - `allow-modals`: Modal dialogs (alert, confirm) are permitted
 * - No access to parent document or external resources
 * 
 * ## Common Use Cases
 * 
 * ### Basic HTML Demo
 * ```html
 * <webwriter-code-html 
 *   code="<h1>Hello World</h1><p>Welcome to HTML!</p>"
 *   autoRun>
 * </webwriter-code-html>
 * ```
 * 
 * ### HTML Template Exercise
 * ```html
 * <webwriter-code-html 
 *   code="<html><head><title>My Page</title></head><body><!-- Add your content here --></body></html>"
 *   locked-lines="[1,2,3,4]"
 *   autocomplete>
 * </webwriter-code-html>
 * ```
 * 
 * ### Hidden Editor (Preview Only)
 * ```html
 * <webwriter-code-html 
 *   code="<div class='card'><h2>Card Title</h2><p>Card content</p></div>"
 *   visible="false"
 *   autoRun>
 * </webwriter-code-html>
 * ```
 * 
 * ### Interactive HTML/CSS/JS Example
 * ```html
 * <webwriter-code-html code="
 * <style>
 *   .highlight { background: yellow; }
 * </style>
 * <div id='demo'>Click me!</div>
 * <script>
 *   document.getElementById('demo').onclick = function() {
 *     this.classList.toggle('highlight');
 *   };
 * </script>
 * " autoRun></webwriter-code-html>
 * ```
 * 
 * ## Limitations
 * - No external resource loading (images, stylesheets, scripts must be inline or data URLs)
 * - Limited iframe sandbox permissions
 * - Parent document interaction is blocked for security
 * 
 * ## Best Practices
 * - Use complete HTML documents for complex examples
 * - Include inline CSS and JavaScript for self-contained examples
 * - Test with `autoRun` for immediate feedback
 * - Use locked lines for template structures
 * 
 * @example
 * ```typescript
 * // Programmatic usage
 * const htmlEditor = document.createElement('webwriter-code-html');
 * htmlEditor.code = '<h1>Dynamic Content</h1>';
 * htmlEditor.autoRun = true;
 * document.body.appendChild(htmlEditor);
 * ```
 * 
 * @fires code-changed - When HTML content is modified
 * @fires execution-complete - When HTML is rendered in preview
 * 
 * @slot - No slots available
 * 
 * @csspart editor - The HTML code editor
 * @csspart preview - The HTML preview iframe
 * @csspart controls - Control buttons (run, clear)
 * @csspart options - Configuration options panel
 * 
 * @cssprop --html-preview-height - Height of the preview iframe (default: 300px)
 * @cssprop --html-preview-border - Border style for the preview iframe
 */
@customElement("webwriter-code-html")
@localized()
export default class CodeHTML extends Code {
    constructor() {
        super(htmlModule);
    }
}
