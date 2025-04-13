/**
 * @file Bridge Definition Language
 * @author tnraro <deokji53@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "bdl",

  rules: {
    source_file: $ => repeat(choice($._top_level_statement)),
    _ws: _ => token(repeat1(/[\x20\t\r\n]/)),
    comment: _ => token(seq("//", repeat(/[^\n]/))),
    identifier: _ => token(seq(/[_a-zA-Z]/, repeat(/[_a-zA-Z0-9]/))),
    _top_level_statement: $ =>
      choice(
        $.attribute,
        $.import,
        $.proc,
        $.struct,
        $.enum,
        $.union,
        $.oneof,
        $.custom,
      ),
    attribute: $ =>
      seq(
        field("decoration", choice("#", "@")),
        field("name", $.identifier),
        optional(field("text", $.attribute_text)),
      ),
    attribute_text: $ =>
      choice(
        seq("-", $.attribute_content),
        repeat1(
          seq(
            token.immediate(seq("\n", repeat(/[\x20\t\r]/), "|")),
            $.attribute_content,
          ),
        ),
      ),
    attribute_content: _ => token.immediate(repeat(/[^\n]/)),
    type_expression: $ =>
      seq(
        field("name", $.identifier),
        optional(choice($.type_expression_array, $.type_expression_dictionary)),
      ),
    type_expression_array: _ => token.immediate("[]"),
    type_expression_dictionary: $ =>
      seq(
        token.immediate("["),
        field("key", $.identifier),
        token.immediate("]"),
      ),
    import: $ =>
      prec.left(
        seq(
          "import",
          field("path", $.import_path),
          field("body", $.import_body),
        ),
      ),
    import_body: $ => seq("{", repeat($.import_field), "}"),
    import_path: $ =>
      choice(
        seq($.identifier, repeat(seq(".", $.identifier)), optional(".")),
        seq(".", repeat(seq($.identifier, ".")), optional($.identifier)),
      ),
    import_field: $ =>
      seq(
        field("name", $.identifier),
        optional(seq("as", field("alias", $.identifier))),
        optional(","),
      ),
    proc: $ =>
      prec.right(
        seq(
          "proc",
          field("name", $.identifier),
          "=",
          field("input", $.type_expression),
          "->",
          field("output", $.type_expression),
          optional(seq("throws", field("throws", $.type_expression))),
        ),
      ),
    struct: $ =>
      prec.right(
        seq(
          "struct",
          field("name", $.identifier),
          field("body", $.struct_body),
        ),
      ),
    struct_body: $ =>
      seq("{", repeat(choice($.attribute, $.struct_field)), "}"),
    struct_field: $ =>
      seq(
        field("key", $.identifier),
        optional(field("optional", $.struct_field_optional_type)),
        ":",
        field("type", $.type_expression),
        optional(","),
      ),
    struct_field_optional_type: $ => "?",
    enum: $ =>
      seq("enum", field("name", $.identifier), field("body", $.enum_body)),
    enum_body: $ => seq("{", repeat(choice($.attribute, $.enum_element)), "}"),
    enum_element: $ => seq(field("name", $.identifier), optional(",")),
    union: $ =>
      seq("union", field("name", $.identifier), field("body", $.union_body)),
    union_body: $ => seq("{", repeat(choice($.attribute, $.union_element)), "}"),
    union_element: $ =>
      seq(
        field("name", $.identifier),
        optional(seq("(", repeat(choice($.attribute, $.struct_field)), ")")),
        optional(","),
      ),
    oneof: $ =>
      seq("oneof", field("name", $.identifier), field("body", $.oneof_body)),
    oneof_body: $ => seq("{", repeat(choice($.attribute, $.oneof_element)), "}"),
    oneof_element: $ => seq($.type_expression, optional(",")),
    custom: $ =>
      seq(
        "custom",
        field("name", $.identifier),
        "=",
        field("type", $.type_expression),
      ),
  },

  word: $ => $.identifier,
  extras: $ => [$._ws, $.comment],
});
