# Anchor Language for VS Code 

Syntax highlighting and language support for the [Anchor](https://github.com/allenj12/anchor) programming language - a systems language with Lisp syntax that compiles to C.

## Features

- Syntax highlighting for `.anc` files
- Bracket matching and auto-closing for `()`, `[]`, `""`
- Comment toggling with `;` (Ctrl+/ / Cmd+/)
- Indentation support for nested S-expressions

### Highlight groups

- **Keywords** - `fn`, `let`, `if`, `while`, `return`, `with-arena`, `struct`, `cast`, `sizeof`, `include`, `ffi`, `define-syntax`, and more
- **Function definitions** - name after `fn` / `fn-c`
- **Macro definitions** - name after `define-syntax`
- **Type definitions** - name after `struct` / `union` / `enum`
- **Builtins** - `cons`, `car`, `cdr`, `printf`, `list`, `null?`, `kb`/`mb`/`gb`, type conversions (`int->f64`, etc.)
- **Operators** - all prefix arithmetic (`+`, `f+`, `u+`, `f32+`), comparison (`==`, `<`, `f>=`), bitwise (`band`, `lshift`), and logical (`&&`, `||`, `!`)
- **Literals** - integers, hex (`0xFF`), floats, strings with escape sequences, character literals (`#\a`, `#\newline`), booleans (`#t`/`#f`)
- **Reader macros** - `'`, `` ` ``, `,`, `,@`, `#'`, `` #` ``, `#,`, `#,@`

## Installation

### Manual install

1. Open VS Code
2. Open the command palette (Ctrl+Shift+P / Cmd+Shift+P)
3. Run **Developer: Install Extension from Location...**
4. Select the `vscode-anchor/` directory
