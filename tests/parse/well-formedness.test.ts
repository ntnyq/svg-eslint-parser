import { describe, expect, it } from 'vitest'
import { ParseError, ParseErrorType, parseForESLint } from '../../src'

function parseErrors(source: string) {
  return parseForESLint(source, { errorRecovery: true }).services.errors
}

describe('XML well-formedness validation', () => {
  it('accepts a well-formed SVG document', () => {
    const source = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="theme.css"?>
<!DOCTYPE svg [<!ELEMENT svg ANY>]>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
  <!-- content -->
  <g><![CDATA[<path />]]></g>
</svg>`

    expect(parseErrors(source)).toEqual([])
  })

  it.each([
    ['', 'An XML document must contain exactly one root element.'],
    [' \n\t ', 'An XML document must contain exactly one root element.'],
    [
      '<svg /><svg />',
      'An XML document cannot contain multiple root elements.',
    ],
  ])('rejects an invalid root structure: %j', (source, message) => {
    expect(parseErrors(source)).toContainEqual(
      expect.objectContaining({
        type: ParseErrorType.InvalidDocument,
        message,
      }),
    )
  })

  it('throws the first well-formedness diagnostic in strict mode', () => {
    expect(() => parseForESLint('<svg /><svg />')).toThrowError(
      expect.objectContaining({
        code: ParseErrorType.InvalidDocument,
        index: 7,
        name: ParseError.name,
      }),
    )
  })

  it('rejects character data and CDATA outside the root element', () => {
    const errors = parseErrors('before<![CDATA[outside]]><svg />after')

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: ParseErrorType.InvalidDocument,
          message: 'Character data is not allowed outside the root element.',
        }),
        expect.objectContaining({
          type: ParseErrorType.InvalidDocument,
          message: 'CDATA sections are not allowed outside the root element.',
        }),
      ]),
    )
    expect(
      errors.filter(
        error =>
          error.message ===
          'Character data is not allowed outside the root element.',
      ),
    ).toHaveLength(2)
  })

  it('requires unique, quoted element attributes with values', () => {
    const errors = parseErrors(
      '<svg disabled bare=value id="first" id="second" bad="<" />',
    )

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: ParseErrorType.InvalidAttribute,
          message: 'Attribute "disabled" must have a value.',
        }),
        expect.objectContaining({
          type: ParseErrorType.InvalidAttribute,
          message: 'Attribute "bare" value must be quoted.',
        }),
        expect.objectContaining({
          type: ParseErrorType.DuplicateAttribute,
          message: 'Duplicate attribute "id".',
        }),
        expect.objectContaining({
          type: ParseErrorType.InvalidAttribute,
          message: 'Attribute "bad" value must not contain "<".',
        }),
      ]),
    )
  })

  it('validates XML declaration placement and attributes', () => {
    const misplaced = parseErrors(' \n<?xml version="1.0"?>\n<svg />')
    const malformed = parseErrors(
      '<?xml encoding="UTF-8"?><?xml version="1.0"?><svg />',
    )

    expect(misplaced).toContainEqual(
      expect.objectContaining({
        type: ParseErrorType.InvalidXMLDeclaration,
        message:
          'The XML declaration must be the first construct in the document.',
      }),
    )
    expect(malformed).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: ParseErrorType.InvalidXMLDeclaration,
          message:
            'The XML declaration must start with a quoted version attribute.',
        }),
        expect.objectContaining({
          type: ParseErrorType.InvalidXMLDeclaration,
          message: 'An XML document cannot contain multiple XML declarations.',
        }),
      ]),
    )
  })

  it('rejects an XML declaration inside an element', () => {
    expect(parseErrors('<svg><?xml version="1.0"?></svg>')).toContainEqual(
      expect.objectContaining({
        type: ParseErrorType.InvalidXMLDeclaration,
        message:
          'The XML declaration must be the first construct in the document.',
      }),
    )
  })

  it('validates doctype placement, uniqueness, and root name', () => {
    const errors = parseErrors('<svg /><!DOCTYPE html><!DOCTYPE svg>')

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: ParseErrorType.InvalidDoctype,
          message:
            'The doctype declaration must appear before the root element.',
        }),
        expect.objectContaining({
          type: ParseErrorType.InvalidDoctype,
          message:
            'An XML document cannot contain multiple doctype declarations.',
        }),
        expect.objectContaining({
          type: ParseErrorType.InvalidDoctype,
          message: 'Doctype root "html" does not match document root "svg".',
        }),
      ]),
    )
  })

  it('validates XML names, processing-instruction targets, and comments', () => {
    const errors = parseErrors(
      '<?1bad?><1svg 2bad="value"><!-- invalid -- comment --></1svg>',
    )

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: ParseErrorType.InvalidProcessingInstruction,
          message: 'Invalid processing-instruction target "1bad".',
        }),
        expect.objectContaining({
          type: ParseErrorType.InvalidCharacter,
          message: 'Invalid element name "1svg".',
        }),
        expect.objectContaining({
          type: ParseErrorType.InvalidAttribute,
          message: 'Invalid attribute name "2bad".',
        }),
        expect.objectContaining({
          type: ParseErrorType.MalformedComment,
          message: 'XML comments must not contain "--".',
        }),
      ]),
    )
  })
})
