((identifier) @type
  (#match? @type "^[A-Z]"))

(type_expression) @type

(import
  (import_body
    (import_field
      "as" @keyword)))

(enum_element
  name: (identifier) @constant)

(proc
  "throws" @keyword)

(struct_field
  key: (identifier) @property)

(union_element
  name: (identifier) @constant)

(attribute
  decoration: ["@" "#"] @keyword)
(attribute
  name: (identifier) @attribute)
(attribute_content) @string

(comment) @comment

[
  "="
  "->"
  "-"
] @operator
[
  "."
  ","
  ":"
  (struct_field_optional_type)
] @punctuation.delimiter
[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

[
  "import"
  "custom"
  "enum"
  "oneof"
  "union"
  "struct"
  "proc"
] @keyword