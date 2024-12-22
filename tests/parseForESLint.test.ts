import { unindent as $ } from '@ntnyq/utils'
import { describe, expect, it } from 'vitest'
import { parseForESLint } from '../src'

const SVG_SOURCE = $`
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <!-- eslint logo from https://icones.js.org -->
    <path fill="#4b32c3" d="m29.832 16.7l-6.354 10.717A1.26 1.26 0 0 1 22.36 28H9.647a1.26 1.26 0 0 1-1.118-.59l-6.356-10.7a1.26 1.26 0 0 1 0-1.272L8.527 4.676A1.34 1.34 0 0 1 9.647 4h12.709a1.34 1.34 0 0 1 1.118.678l6.354 10.786a1.2 1.2 0 0 1 0 1.238Zm-5.262 4.2v-9.614L16 6.466l-8.56 4.82V20.9L16 25.719Z"/>
    <path fill="#8080f2" d="m21.802 19.188l-5.747 3.235l-5.742-3.235v-6.47l5.742-3.236l5.747 3.236z"/>
  </svg>
`

describe('parseForESLint', () => {
  it('should work', () => {
    expect(parseForESLint(SVG_SOURCE).ast).toMatchInlineSnapshot(`
      {
        "body": [
          {
            "children": [
              {
                "attributes": [
                  {
                    "endWrapper": {
                      "loc": {
                        "end": {
                          "column": 39,
                          "line": 1,
                        },
                        "start": {
                          "column": 38,
                          "line": 1,
                        },
                      },
                      "range": [
                        38,
                        39,
                      ],
                      "type": "AttributeValueWrapperEnd",
                      "value": """,
                    },
                    "key": {
                      "loc": {
                        "end": {
                          "column": 10,
                          "line": 1,
                        },
                        "start": {
                          "column": 5,
                          "line": 1,
                        },
                      },
                      "range": [
                        5,
                        10,
                      ],
                      "type": "AttributeKey",
                      "value": "xmlns",
                    },
                    "loc": {
                      "end": {
                        "column": 39,
                        "line": 1,
                      },
                      "start": {
                        "column": 5,
                        "line": 1,
                      },
                    },
                    "range": [
                      5,
                      39,
                    ],
                    "startWrapper": {
                      "loc": {
                        "end": {
                          "column": 12,
                          "line": 1,
                        },
                        "start": {
                          "column": 11,
                          "line": 1,
                        },
                      },
                      "range": [
                        11,
                        12,
                      ],
                      "type": "AttributeValueWrapperStart",
                      "value": """,
                    },
                    "type": "Attribute",
                    "value": {
                      "loc": {
                        "end": {
                          "column": 38,
                          "line": 1,
                        },
                        "start": {
                          "column": 12,
                          "line": 1,
                        },
                      },
                      "range": [
                        12,
                        38,
                      ],
                      "type": "AttributeValue",
                      "value": "http://www.w3.org/2000/svg",
                    },
                  },
                  {
                    "endWrapper": {
                      "loc": {
                        "end": {
                          "column": 50,
                          "line": 1,
                        },
                        "start": {
                          "column": 49,
                          "line": 1,
                        },
                      },
                      "range": [
                        49,
                        50,
                      ],
                      "type": "AttributeValueWrapperEnd",
                      "value": """,
                    },
                    "key": {
                      "loc": {
                        "end": {
                          "column": 45,
                          "line": 1,
                        },
                        "start": {
                          "column": 40,
                          "line": 1,
                        },
                      },
                      "range": [
                        40,
                        45,
                      ],
                      "type": "AttributeKey",
                      "value": "width",
                    },
                    "loc": {
                      "end": {
                        "column": 50,
                        "line": 1,
                      },
                      "start": {
                        "column": 40,
                        "line": 1,
                      },
                    },
                    "range": [
                      40,
                      50,
                    ],
                    "startWrapper": {
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
                      "type": "AttributeValueWrapperStart",
                      "value": """,
                    },
                    "type": "Attribute",
                    "value": {
                      "loc": {
                        "end": {
                          "column": 49,
                          "line": 1,
                        },
                        "start": {
                          "column": 47,
                          "line": 1,
                        },
                      },
                      "range": [
                        47,
                        49,
                      ],
                      "type": "AttributeValue",
                      "value": "32",
                    },
                  },
                  {
                    "endWrapper": {
                      "loc": {
                        "end": {
                          "column": 62,
                          "line": 1,
                        },
                        "start": {
                          "column": 61,
                          "line": 1,
                        },
                      },
                      "range": [
                        61,
                        62,
                      ],
                      "type": "AttributeValueWrapperEnd",
                      "value": """,
                    },
                    "key": {
                      "loc": {
                        "end": {
                          "column": 57,
                          "line": 1,
                        },
                        "start": {
                          "column": 51,
                          "line": 1,
                        },
                      },
                      "range": [
                        51,
                        57,
                      ],
                      "type": "AttributeKey",
                      "value": "height",
                    },
                    "loc": {
                      "end": {
                        "column": 62,
                        "line": 1,
                      },
                      "start": {
                        "column": 51,
                        "line": 1,
                      },
                    },
                    "range": [
                      51,
                      62,
                    ],
                    "startWrapper": {
                      "loc": {
                        "end": {
                          "column": 59,
                          "line": 1,
                        },
                        "start": {
                          "column": 58,
                          "line": 1,
                        },
                      },
                      "range": [
                        58,
                        59,
                      ],
                      "type": "AttributeValueWrapperStart",
                      "value": """,
                    },
                    "type": "Attribute",
                    "value": {
                      "loc": {
                        "end": {
                          "column": 61,
                          "line": 1,
                        },
                        "start": {
                          "column": 59,
                          "line": 1,
                        },
                      },
                      "range": [
                        59,
                        61,
                      ],
                      "type": "AttributeValue",
                      "value": "32",
                    },
                  },
                  {
                    "endWrapper": {
                      "loc": {
                        "end": {
                          "column": 82,
                          "line": 1,
                        },
                        "start": {
                          "column": 81,
                          "line": 1,
                        },
                      },
                      "range": [
                        81,
                        82,
                      ],
                      "type": "AttributeValueWrapperEnd",
                      "value": """,
                    },
                    "key": {
                      "loc": {
                        "end": {
                          "column": 70,
                          "line": 1,
                        },
                        "start": {
                          "column": 63,
                          "line": 1,
                        },
                      },
                      "range": [
                        63,
                        70,
                      ],
                      "type": "AttributeKey",
                      "value": "viewBox",
                    },
                    "loc": {
                      "end": {
                        "column": 82,
                        "line": 1,
                      },
                      "start": {
                        "column": 63,
                        "line": 1,
                      },
                    },
                    "range": [
                      63,
                      82,
                    ],
                    "startWrapper": {
                      "loc": {
                        "end": {
                          "column": 72,
                          "line": 1,
                        },
                        "start": {
                          "column": 71,
                          "line": 1,
                        },
                      },
                      "range": [
                        71,
                        72,
                      ],
                      "type": "AttributeValueWrapperStart",
                      "value": """,
                    },
                    "type": "Attribute",
                    "value": {
                      "loc": {
                        "end": {
                          "column": 81,
                          "line": 1,
                        },
                        "start": {
                          "column": 72,
                          "line": 1,
                        },
                      },
                      "range": [
                        72,
                        81,
                      ],
                      "type": "AttributeValue",
                      "value": "0 0 32 32",
                    },
                  },
                ],
                "children": [
                  {
                    "loc": {
                      "end": {
                        "column": 5,
                        "line": 2,
                      },
                      "start": {
                        "column": 83,
                        "line": 1,
                      },
                    },
                    "range": [
                      83,
                      89,
                    ],
                    "type": "Text",
                    "value": "
        ",
                  },
                  {
                    "close": {
                      "loc": {
                        "end": {
                          "column": 1,
                          "line": 3,
                        },
                        "start": {
                          "column": 48,
                          "line": 2,
                        },
                      },
                      "range": [
                        132,
                        135,
                      ],
                      "type": "CommentClose",
                      "value": "-->",
                    },
                    "loc": {
                      "end": {
                        "column": 1,
                        "line": 3,
                      },
                      "start": {
                        "column": 2,
                        "line": 2,
                      },
                    },
                    "open": {
                      "loc": {
                        "end": {
                          "column": 6,
                          "line": 2,
                        },
                        "start": {
                          "column": 2,
                          "line": 2,
                        },
                      },
                      "range": [
                        86,
                        90,
                      ],
                      "type": "CommentOpen",
                      "value": "<!--",
                    },
                    "range": [
                      86,
                      135,
                    ],
                    "type": "Comment",
                    "value": {
                      "loc": {
                        "end": {
                          "column": 48,
                          "line": 2,
                        },
                        "start": {
                          "column": 6,
                          "line": 2,
                        },
                      },
                      "range": [
                        90,
                        132,
                      ],
                      "type": "CommentContent",
                      "value": " eslint logo from https://icones.js.org ",
                    },
                  },
                  {
                    "loc": {
                      "end": {
                        "column": 3,
                        "line": 3,
                      },
                      "start": {
                        "column": 49,
                        "line": 2,
                      },
                    },
                    "range": [
                      133,
                      137,
                    ],
                    "type": "Text",
                    "value": "
        ",
                  },
                  {
                    "attributes": [
                      {
                        "endWrapper": {
                          "loc": {
                            "end": {
                              "column": 22,
                              "line": 3,
                            },
                            "start": {
                              "column": 21,
                              "line": 3,
                            },
                          },
                          "range": [
                            155,
                            156,
                          ],
                          "type": "AttributeValueWrapperEnd",
                          "value": """,
                        },
                        "key": {
                          "loc": {
                            "end": {
                              "column": 12,
                              "line": 3,
                            },
                            "start": {
                              "column": 8,
                              "line": 3,
                            },
                          },
                          "range": [
                            142,
                            146,
                          ],
                          "type": "AttributeKey",
                          "value": "fill",
                        },
                        "loc": {
                          "end": {
                            "column": 22,
                            "line": 3,
                          },
                          "start": {
                            "column": 8,
                            "line": 3,
                          },
                        },
                        "range": [
                          142,
                          156,
                        ],
                        "startWrapper": {
                          "loc": {
                            "end": {
                              "column": 14,
                              "line": 3,
                            },
                            "start": {
                              "column": 13,
                              "line": 3,
                            },
                          },
                          "range": [
                            147,
                            148,
                          ],
                          "type": "AttributeValueWrapperStart",
                          "value": """,
                        },
                        "type": "Attribute",
                        "value": {
                          "loc": {
                            "end": {
                              "column": 21,
                              "line": 3,
                            },
                            "start": {
                              "column": 14,
                              "line": 3,
                            },
                          },
                          "range": [
                            148,
                            155,
                          ],
                          "type": "AttributeValue",
                          "value": "#4b32c3",
                        },
                      },
                      {
                        "endWrapper": {
                          "loc": {
                            "end": {
                              "column": 305,
                              "line": 3,
                            },
                            "start": {
                              "column": 304,
                              "line": 3,
                            },
                          },
                          "range": [
                            438,
                            439,
                          ],
                          "type": "AttributeValueWrapperEnd",
                          "value": """,
                        },
                        "key": {
                          "loc": {
                            "end": {
                              "column": 24,
                              "line": 3,
                            },
                            "start": {
                              "column": 23,
                              "line": 3,
                            },
                          },
                          "range": [
                            157,
                            158,
                          ],
                          "type": "AttributeKey",
                          "value": "d",
                        },
                        "loc": {
                          "end": {
                            "column": 305,
                            "line": 3,
                          },
                          "start": {
                            "column": 23,
                            "line": 3,
                          },
                        },
                        "range": [
                          157,
                          439,
                        ],
                        "startWrapper": {
                          "loc": {
                            "end": {
                              "column": 26,
                              "line": 3,
                            },
                            "start": {
                              "column": 25,
                              "line": 3,
                            },
                          },
                          "range": [
                            159,
                            160,
                          ],
                          "type": "AttributeValueWrapperStart",
                          "value": """,
                        },
                        "type": "Attribute",
                        "value": {
                          "loc": {
                            "end": {
                              "column": 304,
                              "line": 3,
                            },
                            "start": {
                              "column": 26,
                              "line": 3,
                            },
                          },
                          "range": [
                            160,
                            438,
                          ],
                          "type": "AttributeValue",
                          "value": "m29.832 16.7l-6.354 10.717A1.26 1.26 0 0 1 22.36 28H9.647a1.26 1.26 0 0 1-1.118-.59l-6.356-10.7a1.26 1.26 0 0 1 0-1.272L8.527 4.676A1.34 1.34 0 0 1 9.647 4h12.709a1.34 1.34 0 0 1 1.118.678l6.354 10.786a1.2 1.2 0 0 1 0 1.238Zm-5.262 4.2v-9.614L16 6.466l-8.56 4.82V20.9L16 25.719Z",
                        },
                      },
                    ],
                    "children": [],
                    "loc": {
                      "end": {
                        "column": 305,
                        "line": 3,
                      },
                      "start": {
                        "column": 2,
                        "line": 3,
                      },
                    },
                    "name": "path",
                    "openEnd": {
                      "loc": {
                        "end": {
                          "column": 305,
                          "line": 3,
                        },
                        "start": {
                          "column": 305,
                          "line": 3,
                        },
                      },
                      "range": [
                        439,
                        439,
                      ],
                      "type": "OpenTagEnd",
                      "value": "/>",
                    },
                    "openStart": {
                      "loc": {
                        "end": {
                          "column": 7,
                          "line": 3,
                        },
                        "start": {
                          "column": 2,
                          "line": 3,
                        },
                      },
                      "range": [
                        136,
                        141,
                      ],
                      "type": "OpenTagStart",
                      "value": "<path",
                    },
                    "range": [
                      136,
                      439,
                    ],
                    "selfClosing": true,
                    "type": "Tag",
                  },
                  {
                    "loc": {
                      "end": {
                        "column": 3,
                        "line": 4,
                      },
                      "start": {
                        "column": 307,
                        "line": 3,
                      },
                    },
                    "range": [
                      441,
                      445,
                    ],
                    "type": "Text",
                    "value": "
        ",
                  },
                  {
                    "attributes": [
                      {
                        "endWrapper": {
                          "loc": {
                            "end": {
                              "column": 22,
                              "line": 4,
                            },
                            "start": {
                              "column": 21,
                              "line": 4,
                            },
                          },
                          "range": [
                            463,
                            464,
                          ],
                          "type": "AttributeValueWrapperEnd",
                          "value": """,
                        },
                        "key": {
                          "loc": {
                            "end": {
                              "column": 12,
                              "line": 4,
                            },
                            "start": {
                              "column": 8,
                              "line": 4,
                            },
                          },
                          "range": [
                            450,
                            454,
                          ],
                          "type": "AttributeKey",
                          "value": "fill",
                        },
                        "loc": {
                          "end": {
                            "column": 22,
                            "line": 4,
                          },
                          "start": {
                            "column": 8,
                            "line": 4,
                          },
                        },
                        "range": [
                          450,
                          464,
                        ],
                        "startWrapper": {
                          "loc": {
                            "end": {
                              "column": 14,
                              "line": 4,
                            },
                            "start": {
                              "column": 13,
                              "line": 4,
                            },
                          },
                          "range": [
                            455,
                            456,
                          ],
                          "type": "AttributeValueWrapperStart",
                          "value": """,
                        },
                        "type": "Attribute",
                        "value": {
                          "loc": {
                            "end": {
                              "column": 21,
                              "line": 4,
                            },
                            "start": {
                              "column": 14,
                              "line": 4,
                            },
                          },
                          "range": [
                            456,
                            463,
                          ],
                          "type": "AttributeValue",
                          "value": "#8080f2",
                        },
                      },
                      {
                        "endWrapper": {
                          "loc": {
                            "end": {
                              "column": 98,
                              "line": 4,
                            },
                            "start": {
                              "column": 97,
                              "line": 4,
                            },
                          },
                          "range": [
                            539,
                            540,
                          ],
                          "type": "AttributeValueWrapperEnd",
                          "value": """,
                        },
                        "key": {
                          "loc": {
                            "end": {
                              "column": 24,
                              "line": 4,
                            },
                            "start": {
                              "column": 23,
                              "line": 4,
                            },
                          },
                          "range": [
                            465,
                            466,
                          ],
                          "type": "AttributeKey",
                          "value": "d",
                        },
                        "loc": {
                          "end": {
                            "column": 98,
                            "line": 4,
                          },
                          "start": {
                            "column": 23,
                            "line": 4,
                          },
                        },
                        "range": [
                          465,
                          540,
                        ],
                        "startWrapper": {
                          "loc": {
                            "end": {
                              "column": 26,
                              "line": 4,
                            },
                            "start": {
                              "column": 25,
                              "line": 4,
                            },
                          },
                          "range": [
                            467,
                            468,
                          ],
                          "type": "AttributeValueWrapperStart",
                          "value": """,
                        },
                        "type": "Attribute",
                        "value": {
                          "loc": {
                            "end": {
                              "column": 97,
                              "line": 4,
                            },
                            "start": {
                              "column": 26,
                              "line": 4,
                            },
                          },
                          "range": [
                            468,
                            539,
                          ],
                          "type": "AttributeValue",
                          "value": "m21.802 19.188l-5.747 3.235l-5.742-3.235v-6.47l5.742-3.236l5.747 3.236z",
                        },
                      },
                    ],
                    "children": [],
                    "loc": {
                      "end": {
                        "column": 98,
                        "line": 4,
                      },
                      "start": {
                        "column": 2,
                        "line": 4,
                      },
                    },
                    "name": "path",
                    "openEnd": {
                      "loc": {
                        "end": {
                          "column": 98,
                          "line": 4,
                        },
                        "start": {
                          "column": 98,
                          "line": 4,
                        },
                      },
                      "range": [
                        540,
                        540,
                      ],
                      "type": "OpenTagEnd",
                      "value": "/>",
                    },
                    "openStart": {
                      "loc": {
                        "end": {
                          "column": 7,
                          "line": 4,
                        },
                        "start": {
                          "column": 2,
                          "line": 4,
                        },
                      },
                      "range": [
                        444,
                        449,
                      ],
                      "type": "OpenTagStart",
                      "value": "<path",
                    },
                    "range": [
                      444,
                      540,
                    ],
                    "selfClosing": true,
                    "type": "Tag",
                  },
                  {
                    "loc": {
                      "end": {
                        "column": 1,
                        "line": 5,
                      },
                      "start": {
                        "column": 100,
                        "line": 4,
                      },
                    },
                    "range": [
                      542,
                      544,
                    ],
                    "type": "Text",
                    "value": "
      ",
                  },
                ],
                "close": {
                  "loc": {
                    "end": {
                      "column": 4,
                      "line": 5,
                    },
                    "start": {
                      "column": 0,
                      "line": 5,
                    },
                  },
                  "range": [
                    543,
                    547,
                  ],
                  "type": "CloseTag",
                  "value": "</svg>",
                },
                "loc": {
                  "end": {
                    "column": 4,
                    "line": 5,
                  },
                  "start": {
                    "column": 0,
                    "line": 1,
                  },
                },
                "name": "svg",
                "openEnd": {
                  "loc": {
                    "end": {
                      "column": 81,
                      "line": 1,
                    },
                    "start": {
                      "column": 82,
                      "line": 1,
                    },
                  },
                  "range": [
                    82,
                    81,
                  ],
                  "type": "OpenTagEnd",
                  "value": ">",
                },
                "openStart": {
                  "loc": {
                    "end": {
                      "column": 4,
                      "line": 1,
                    },
                    "start": {
                      "column": 0,
                      "line": 1,
                    },
                  },
                  "range": [
                    0,
                    4,
                  ],
                  "type": "OpenTagStart",
                  "value": "<svg",
                },
                "range": [
                  0,
                  547,
                ],
                "selfClosing": false,
                "type": "Tag",
              },
            ],
            "loc": {
              "end": {
                "column": 4,
                "line": 5,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "range": [
              0,
              547,
            ],
            "type": "Document",
          },
        ],
        "comments": [
          {
            "loc": {
              "end": {
                "column": 48,
                "line": 2,
              },
              "start": {
                "column": 6,
                "line": 2,
              },
            },
            "range": [
              90,
              132,
            ],
            "type": "CommentContent",
            "value": " eslint logo from https://icones.js.org ",
          },
        ],
        "loc": {
          "end": {
            "column": 4,
            "line": 5,
          },
          "start": {
            "column": 0,
            "line": 1,
          },
        },
        "range": [
          0,
          547,
        ],
        "tokens": [
          {
            "loc": {
              "end": {
                "column": 4,
                "line": 1,
              },
              "start": {
                "column": 0,
                "line": 1,
              },
            },
            "range": [
              0,
              4,
            ],
            "type": "OpenTagStart",
            "value": "<svg",
          },
          {
            "loc": {
              "end": {
                "column": 10,
                "line": 1,
              },
              "start": {
                "column": 5,
                "line": 1,
              },
            },
            "range": [
              5,
              10,
            ],
            "type": "AttributeKey",
            "value": "xmlns",
          },
          {
            "loc": {
              "end": {
                "column": 9,
                "line": 1,
              },
              "start": {
                "column": 10,
                "line": 1,
              },
            },
            "range": [
              10,
              9,
            ],
            "type": "AttributeAssignment",
            "value": "=",
          },
          {
            "loc": {
              "end": {
                "column": 12,
                "line": 1,
              },
              "start": {
                "column": 11,
                "line": 1,
              },
            },
            "range": [
              11,
              12,
            ],
            "type": "AttributeValueWrapperStart",
            "value": """,
          },
          {
            "loc": {
              "end": {
                "column": 38,
                "line": 1,
              },
              "start": {
                "column": 12,
                "line": 1,
              },
            },
            "range": [
              12,
              38,
            ],
            "type": "AttributeValue",
            "value": "http://www.w3.org/2000/svg",
          },
          {
            "loc": {
              "end": {
                "column": 39,
                "line": 1,
              },
              "start": {
                "column": 38,
                "line": 1,
              },
            },
            "range": [
              38,
              39,
            ],
            "type": "AttributeValueWrapperEnd",
            "value": """,
          },
          {
            "loc": {
              "end": {
                "column": 45,
                "line": 1,
              },
              "start": {
                "column": 40,
                "line": 1,
              },
            },
            "range": [
              40,
              45,
            ],
            "type": "AttributeKey",
            "value": "width",
          },
          {
            "loc": {
              "end": {
                "column": 44,
                "line": 1,
              },
              "start": {
                "column": 45,
                "line": 1,
              },
            },
            "range": [
              45,
              44,
            ],
            "type": "AttributeAssignment",
            "value": "=",
          },
          {
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
            "type": "AttributeValueWrapperStart",
            "value": """,
          },
          {
            "loc": {
              "end": {
                "column": 49,
                "line": 1,
              },
              "start": {
                "column": 47,
                "line": 1,
              },
            },
            "range": [
              47,
              49,
            ],
            "type": "AttributeValue",
            "value": "32",
          },
          {
            "loc": {
              "end": {
                "column": 50,
                "line": 1,
              },
              "start": {
                "column": 49,
                "line": 1,
              },
            },
            "range": [
              49,
              50,
            ],
            "type": "AttributeValueWrapperEnd",
            "value": """,
          },
          {
            "loc": {
              "end": {
                "column": 57,
                "line": 1,
              },
              "start": {
                "column": 51,
                "line": 1,
              },
            },
            "range": [
              51,
              57,
            ],
            "type": "AttributeKey",
            "value": "height",
          },
          {
            "loc": {
              "end": {
                "column": 56,
                "line": 1,
              },
              "start": {
                "column": 57,
                "line": 1,
              },
            },
            "range": [
              57,
              56,
            ],
            "type": "AttributeAssignment",
            "value": "=",
          },
          {
            "loc": {
              "end": {
                "column": 59,
                "line": 1,
              },
              "start": {
                "column": 58,
                "line": 1,
              },
            },
            "range": [
              58,
              59,
            ],
            "type": "AttributeValueWrapperStart",
            "value": """,
          },
          {
            "loc": {
              "end": {
                "column": 61,
                "line": 1,
              },
              "start": {
                "column": 59,
                "line": 1,
              },
            },
            "range": [
              59,
              61,
            ],
            "type": "AttributeValue",
            "value": "32",
          },
          {
            "loc": {
              "end": {
                "column": 62,
                "line": 1,
              },
              "start": {
                "column": 61,
                "line": 1,
              },
            },
            "range": [
              61,
              62,
            ],
            "type": "AttributeValueWrapperEnd",
            "value": """,
          },
          {
            "loc": {
              "end": {
                "column": 70,
                "line": 1,
              },
              "start": {
                "column": 63,
                "line": 1,
              },
            },
            "range": [
              63,
              70,
            ],
            "type": "AttributeKey",
            "value": "viewBox",
          },
          {
            "loc": {
              "end": {
                "column": 69,
                "line": 1,
              },
              "start": {
                "column": 70,
                "line": 1,
              },
            },
            "range": [
              70,
              69,
            ],
            "type": "AttributeAssignment",
            "value": "=",
          },
          {
            "loc": {
              "end": {
                "column": 72,
                "line": 1,
              },
              "start": {
                "column": 71,
                "line": 1,
              },
            },
            "range": [
              71,
              72,
            ],
            "type": "AttributeValueWrapperStart",
            "value": """,
          },
          {
            "loc": {
              "end": {
                "column": 81,
                "line": 1,
              },
              "start": {
                "column": 72,
                "line": 1,
              },
            },
            "range": [
              72,
              81,
            ],
            "type": "AttributeValue",
            "value": "0 0 32 32",
          },
          {
            "loc": {
              "end": {
                "column": 82,
                "line": 1,
              },
              "start": {
                "column": 81,
                "line": 1,
              },
            },
            "range": [
              81,
              82,
            ],
            "type": "AttributeValueWrapperEnd",
            "value": """,
          },
          {
            "loc": {
              "end": {
                "column": 81,
                "line": 1,
              },
              "start": {
                "column": 82,
                "line": 1,
              },
            },
            "range": [
              82,
              81,
            ],
            "type": "OpenTagEnd",
            "value": ">",
          },
          {
            "loc": {
              "end": {
                "column": 5,
                "line": 2,
              },
              "start": {
                "column": 83,
                "line": 1,
              },
            },
            "range": [
              83,
              89,
            ],
            "type": "Text",
            "value": "
        ",
          },
          {
            "loc": {
              "end": {
                "column": 3,
                "line": 3,
              },
              "start": {
                "column": 49,
                "line": 2,
              },
            },
            "range": [
              133,
              137,
            ],
            "type": "Text",
            "value": "
        ",
          },
          {
            "loc": {
              "end": {
                "column": 7,
                "line": 3,
              },
              "start": {
                "column": 2,
                "line": 3,
              },
            },
            "range": [
              136,
              141,
            ],
            "type": "OpenTagStart",
            "value": "<path",
          },
          {
            "loc": {
              "end": {
                "column": 12,
                "line": 3,
              },
              "start": {
                "column": 8,
                "line": 3,
              },
            },
            "range": [
              142,
              146,
            ],
            "type": "AttributeKey",
            "value": "fill",
          },
          {
            "loc": {
              "end": {
                "column": 11,
                "line": 3,
              },
              "start": {
                "column": 12,
                "line": 3,
              },
            },
            "range": [
              146,
              145,
            ],
            "type": "AttributeAssignment",
            "value": "=",
          },
          {
            "loc": {
              "end": {
                "column": 14,
                "line": 3,
              },
              "start": {
                "column": 13,
                "line": 3,
              },
            },
            "range": [
              147,
              148,
            ],
            "type": "AttributeValueWrapperStart",
            "value": """,
          },
          {
            "loc": {
              "end": {
                "column": 21,
                "line": 3,
              },
              "start": {
                "column": 14,
                "line": 3,
              },
            },
            "range": [
              148,
              155,
            ],
            "type": "AttributeValue",
            "value": "#4b32c3",
          },
          {
            "loc": {
              "end": {
                "column": 22,
                "line": 3,
              },
              "start": {
                "column": 21,
                "line": 3,
              },
            },
            "range": [
              155,
              156,
            ],
            "type": "AttributeValueWrapperEnd",
            "value": """,
          },
          {
            "loc": {
              "end": {
                "column": 24,
                "line": 3,
              },
              "start": {
                "column": 23,
                "line": 3,
              },
            },
            "range": [
              157,
              158,
            ],
            "type": "AttributeKey",
            "value": "d",
          },
          {
            "loc": {
              "end": {
                "column": 23,
                "line": 3,
              },
              "start": {
                "column": 24,
                "line": 3,
              },
            },
            "range": [
              158,
              157,
            ],
            "type": "AttributeAssignment",
            "value": "=",
          },
          {
            "loc": {
              "end": {
                "column": 26,
                "line": 3,
              },
              "start": {
                "column": 25,
                "line": 3,
              },
            },
            "range": [
              159,
              160,
            ],
            "type": "AttributeValueWrapperStart",
            "value": """,
          },
          {
            "loc": {
              "end": {
                "column": 304,
                "line": 3,
              },
              "start": {
                "column": 26,
                "line": 3,
              },
            },
            "range": [
              160,
              438,
            ],
            "type": "AttributeValue",
            "value": "m29.832 16.7l-6.354 10.717A1.26 1.26 0 0 1 22.36 28H9.647a1.26 1.26 0 0 1-1.118-.59l-6.356-10.7a1.26 1.26 0 0 1 0-1.272L8.527 4.676A1.34 1.34 0 0 1 9.647 4h12.709a1.34 1.34 0 0 1 1.118.678l6.354 10.786a1.2 1.2 0 0 1 0 1.238Zm-5.262 4.2v-9.614L16 6.466l-8.56 4.82V20.9L16 25.719Z",
          },
          {
            "loc": {
              "end": {
                "column": 305,
                "line": 3,
              },
              "start": {
                "column": 304,
                "line": 3,
              },
            },
            "range": [
              438,
              439,
            ],
            "type": "AttributeValueWrapperEnd",
            "value": """,
          },
          {
            "loc": {
              "end": {
                "column": 305,
                "line": 3,
              },
              "start": {
                "column": 305,
                "line": 3,
              },
            },
            "range": [
              439,
              439,
            ],
            "type": "OpenTagEnd",
            "value": "/>",
          },
          {
            "loc": {
              "end": {
                "column": 3,
                "line": 4,
              },
              "start": {
                "column": 307,
                "line": 3,
              },
            },
            "range": [
              441,
              445,
            ],
            "type": "Text",
            "value": "
        ",
          },
          {
            "loc": {
              "end": {
                "column": 7,
                "line": 4,
              },
              "start": {
                "column": 2,
                "line": 4,
              },
            },
            "range": [
              444,
              449,
            ],
            "type": "OpenTagStart",
            "value": "<path",
          },
          {
            "loc": {
              "end": {
                "column": 12,
                "line": 4,
              },
              "start": {
                "column": 8,
                "line": 4,
              },
            },
            "range": [
              450,
              454,
            ],
            "type": "AttributeKey",
            "value": "fill",
          },
          {
            "loc": {
              "end": {
                "column": 11,
                "line": 4,
              },
              "start": {
                "column": 12,
                "line": 4,
              },
            },
            "range": [
              454,
              453,
            ],
            "type": "AttributeAssignment",
            "value": "=",
          },
          {
            "loc": {
              "end": {
                "column": 14,
                "line": 4,
              },
              "start": {
                "column": 13,
                "line": 4,
              },
            },
            "range": [
              455,
              456,
            ],
            "type": "AttributeValueWrapperStart",
            "value": """,
          },
          {
            "loc": {
              "end": {
                "column": 21,
                "line": 4,
              },
              "start": {
                "column": 14,
                "line": 4,
              },
            },
            "range": [
              456,
              463,
            ],
            "type": "AttributeValue",
            "value": "#8080f2",
          },
          {
            "loc": {
              "end": {
                "column": 22,
                "line": 4,
              },
              "start": {
                "column": 21,
                "line": 4,
              },
            },
            "range": [
              463,
              464,
            ],
            "type": "AttributeValueWrapperEnd",
            "value": """,
          },
          {
            "loc": {
              "end": {
                "column": 24,
                "line": 4,
              },
              "start": {
                "column": 23,
                "line": 4,
              },
            },
            "range": [
              465,
              466,
            ],
            "type": "AttributeKey",
            "value": "d",
          },
          {
            "loc": {
              "end": {
                "column": 23,
                "line": 4,
              },
              "start": {
                "column": 24,
                "line": 4,
              },
            },
            "range": [
              466,
              465,
            ],
            "type": "AttributeAssignment",
            "value": "=",
          },
          {
            "loc": {
              "end": {
                "column": 26,
                "line": 4,
              },
              "start": {
                "column": 25,
                "line": 4,
              },
            },
            "range": [
              467,
              468,
            ],
            "type": "AttributeValueWrapperStart",
            "value": """,
          },
          {
            "loc": {
              "end": {
                "column": 97,
                "line": 4,
              },
              "start": {
                "column": 26,
                "line": 4,
              },
            },
            "range": [
              468,
              539,
            ],
            "type": "AttributeValue",
            "value": "m21.802 19.188l-5.747 3.235l-5.742-3.235v-6.47l5.742-3.236l5.747 3.236z",
          },
          {
            "loc": {
              "end": {
                "column": 98,
                "line": 4,
              },
              "start": {
                "column": 97,
                "line": 4,
              },
            },
            "range": [
              539,
              540,
            ],
            "type": "AttributeValueWrapperEnd",
            "value": """,
          },
          {
            "loc": {
              "end": {
                "column": 98,
                "line": 4,
              },
              "start": {
                "column": 98,
                "line": 4,
              },
            },
            "range": [
              540,
              540,
            ],
            "type": "OpenTagEnd",
            "value": "/>",
          },
          {
            "loc": {
              "end": {
                "column": 1,
                "line": 5,
              },
              "start": {
                "column": 100,
                "line": 4,
              },
            },
            "range": [
              542,
              544,
            ],
            "type": "Text",
            "value": "
      ",
          },
          {
            "loc": {
              "end": {
                "column": 4,
                "line": 5,
              },
              "start": {
                "column": 0,
                "line": 5,
              },
            },
            "range": [
              543,
              547,
            ],
            "type": "CloseTag",
            "value": "</svg>",
          },
        ],
        "type": "Program",
      }
    `)
  })
})
