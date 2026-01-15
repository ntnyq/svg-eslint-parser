import { unindent as $ } from '@ntnyq/utils'
import { expect, it } from 'vitest'
import { parseForESLint } from '../../src'

const SVG_SOURCE = $`
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN">
`

it('should parse', () => {
  const ast = parseForESLint(SVG_SOURCE).ast

  expect(ast).toMatchSnapshot()
  expect(ast.body).toMatchInlineSnapshot(`
    [
      {
        "children": [
          {
            "attributes": [
              {
                "loc": {
                  "end": {
                    "column": 13,
                    "line": 1,
                  },
                  "start": {
                    "column": 10,
                    "line": 1,
                  },
                },
                "range": [
                  10,
                  13,
                ],
                "type": "DoctypeAttribute",
                "value": {
                  "loc": {
                    "end": {
                      "column": 13,
                      "line": 1,
                    },
                    "start": {
                      "column": 10,
                      "line": 1,
                    },
                  },
                  "range": [
                    10,
                    13,
                  ],
                  "type": "DoctypeAttributeValue",
                  "value": "svg",
                },
              },
              {
                "loc": {
                  "end": {
                    "column": 20,
                    "line": 1,
                  },
                  "start": {
                    "column": 14,
                    "line": 1,
                  },
                },
                "range": [
                  14,
                  20,
                ],
                "type": "DoctypeAttribute",
                "value": {
                  "loc": {
                    "end": {
                      "column": 20,
                      "line": 1,
                    },
                    "start": {
                      "column": 14,
                      "line": 1,
                    },
                  },
                  "range": [
                    14,
                    20,
                  ],
                  "type": "DoctypeAttributeValue",
                  "value": "PUBLIC",
                },
              },
              {
                "loc": {
                  "end": {
                    "column": 46,
                    "line": 1,
                  },
                  "start": {
                    "column": 21,
                    "line": 1,
                  },
                },
                "quoteChar": """,
                "range": [
                  21,
                  46,
                ],
                "type": "DoctypeAttribute",
                "value": {
                  "loc": {
                    "end": {
                      "column": 45,
                      "line": 1,
                    },
                    "start": {
                      "column": 22,
                      "line": 1,
                    },
                  },
                  "range": [
                    22,
                    45,
                  ],
                  "type": "DoctypeAttributeValue",
                  "value": "-//W3C//DTD SVG 1.1//EN",
                },
              },
            ],
            "close": {
              "loc": {
                "end": {
                  "column": 47,
                  "line": 1,
                },
                "start": {
                  "column": 46,
                  "line": 1,
                },
              },
              "range": [
                46,
                47,
              ],
              "type": "DoctypeClose",
              "value": ">",
            },
            "loc": {
              "end": {
                "column": 47,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "open": {
              "loc": {
                "end": {
                  "column": 9,
                  "line": 1,
                },
                "start": {
                  "column": 0,
                  "line": 1,
                },
              },
              "range": [
                0,
                9,
              ],
              "type": "DoctypeOpen",
              "value": "<!DOCTYPE",
            },
            "range": [
              0,
              47,
            ],
            "type": "Doctype",
          },
        ],
        "loc": {
          "end": {
            "column": 47,
            "line": 1,
          },
          "start": {
            "column": 0,
            "line": 1,
          },
        },
        "range": [
          0,
          47,
        ],
        "type": "Document",
      },
    ]
  `)
})
