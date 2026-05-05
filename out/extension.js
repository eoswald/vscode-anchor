"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
function activate(context) {
    context.subscriptions.push(vscode.languages.registerOnTypeFormattingEditProvider({ language: 'anchor', scheme: 'file' }, new AnchorIndentProvider(), '\n'));
}
function deactivate() { }
class AnchorIndentProvider {
    provideOnTypeFormattingEdits(document, position, _ch, options) {
        const indent = computeSchemeIndent(document, position, options.tabSize);
        if (indent < 0) {
            return [];
        }
        const line = document.lineAt(position.line);
        const currentIndent = line.firstNonWhitespaceCharacterIndex;
        const range = new vscode.Range(position.line, 0, position.line, currentIndent);
        return [vscode.TextEdit.replace(range, ' '.repeat(indent))];
    }
}
const MAX_SCAN = 5000;
/**
 * Scheme-style indent for Anchor.
 *
 * Scans backward from the cursor to find the matching open paren at depth 0,
 * skipping over strings and comments. Then chooses indent:
 *
 *   - Paren preceded by quote/backtick/@/#/, or followed by open paren
 *     -> col + 1 (data alignment)
 *   - Otherwise -> col + tabSize (body indent)
 */
function computeSchemeIndent(document, position, tabSize) {
    const text = document.getText();
    const cursorOffset = document.offsetAt(position);
    // Only build skip regions for the window we actually scan
    const scanStart = Math.max(0, cursorOffset - MAX_SCAN);
    const regions = buildSkipRegions(text, scanStart, cursorOffset);
    let depth = 0;
    let offset = cursorOffset - 1;
    // Skip past the newline and any trailing whitespace
    while (offset >= scanStart && isWhitespace(text.charCodeAt(offset))) {
        offset--;
    }
    while (offset >= scanStart) {
        if (isInSkipRegion(regions, offset)) {
            offset--;
            continue;
        }
        const ch = text[offset];
        if (ch === '(' || ch === '[') {
            if (depth === 0) {
                const col = document.positionAt(offset).character;
                const prevCh = offset > 0 ? text[offset - 1] : '';
                const isQuoted = prevCh === "'" || prevCh === '`' || prevCh === '@'
                    || prevCh === '#' || prevCh === ',';
                // Check char after paren, skipping whitespace
                let nextIdx = offset + 1;
                while (nextIdx < text.length && text[nextIdx] === ' ') {
                    nextIdx++;
                }
                const nextCh = nextIdx < text.length ? text[nextIdx] : '';
                const nextIsOpen = nextCh === '(' || nextCh === '[';
                return isQuoted || nextIsOpen ? col + 1 : col + tabSize;
            }
            depth--;
        }
        else if (ch === ')' || ch === ']') {
            depth++;
        }
        offset--;
    }
    return 0;
}
function isWhitespace(code) {
    return code === 10 || code === 13 || code === 32 || code === 9;
}
/**
 * Build sorted intervals for strings and comments in [from, to).
 * Used to skip parens inside non-code regions during the backward scan.
 */
function buildSkipRegions(text, from, to) {
    const regions = [];
    // We must scan from the beginning of the file to correctly track
    // string state (a string opened before `from` affects everything after).
    // But we only record regions that overlap [from, to).
    let i = 0;
    while (i < to) {
        if (text[i] === ';') {
            const start = i;
            while (i < to && text[i] !== '\n') {
                i++;
            }
            if (i > from) {
                regions.push({ start: Math.max(start, from), end: i - 1 });
            }
            continue;
        }
        if (text[i] === '"') {
            const start = i;
            i++;
            while (i < text.length && text[i] !== '"') {
                if (text[i] === '\\') {
                    i++;
                }
                i++;
            }
            if (i < text.length) {
                i++;
            } // skip closing quote
            const regionEnd = i - 1;
            if (regionEnd >= from && start < to) {
                regions.push({ start: Math.max(start, from), end: Math.min(regionEnd, to) });
            }
            continue;
        }
        i++;
    }
    return regions;
}
/** Binary search to check if an offset falls inside any skip region. */
function isInSkipRegion(regions, offset) {
    let lo = 0;
    let hi = regions.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const r = regions[mid];
        if (offset < r.start) {
            hi = mid - 1;
        }
        else if (offset > r.end) {
            lo = mid + 1;
        }
        else {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=extension.js.map