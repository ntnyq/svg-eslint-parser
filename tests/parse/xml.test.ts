import { unindent as $ } from '@ntnyq/utils'
import { expect, it } from 'vitest'
import { parseForESLint } from '../../src'

const SVG_SOURCE = $`
  <?xml version="1.0" encoding="UTF-8" standalone="no"?>
`

it('should parse', () => {
  const ast = parseForESLint(SVG_SOURCE).ast

  expect(ast).toMatchSnapshot()
  expect(ast.body).toMatchInlineSnapshot(`
    [
      {
        "children": [
          {
            "loc": {
              "end": {
                "column": 54,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "range": [
              0,
              54,
            ],
            "type": "Text",
            "value": "<?xml version="1.0" encoding="UTF-8" standalone="no"?>",
          },
        ],
        "loc": {
          "end": {
            "column": 54,
            "line": 1,
          },
          "start": {
            "column": 0,
            "line": 1,
          },
        },
        "range": [
          0,
          54,
        ],
        "type": "Document",
      },
    ]
  `)
})
