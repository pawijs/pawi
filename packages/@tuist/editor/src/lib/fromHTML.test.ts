import { describe, expect, it, elemValue } from 'test'
import { fromHTML } from './fromHTML'
import { toHTML } from './toHTML'

function testFromHTML(html: string): string[] {
  return Object.values(fromHTML(html).g)
    .sort((a, b) => (a.p < b.p ? -1 : 1))
    .map(elemValue)
}

describe('fromHTML', () => {
  it('should parse simple para', () => {
    expect(testFromHTML(`<body><p>Hop</p><p>La</p></body>`)).toEqual([
      '0:P: "Hop"',
      '1:P: "La"',
    ])
  })

  it('should parse bold and italics', () => {
    expect(
      testFromHTML(
        `<body>
          <p>With <strong>bold</strong> and not bold.</p>
          <p>With <strong>bold <em>and italic</em></strong> and plain</p>
        </body>`
      )
    ).toEqual([
      '0:P: [0:T: "With ", 1:B: "bold", 2:T: " and not bold."]',
      '1:P: [0:T: "With ", 1:B: "bold ", 2:B+I: "and italic", 3:T: " and plain"]',
    ])
  })

  it('should parse lists', () => {
    expect(
      testFromHTML(
        `<body>
          <ul>
            <li>With <strong>bold</strong> and not bold.</li>
          </ul>
          <ol>
            <li>With <em>italic <strong>bold</strong></em> and not <em>italic</em>.</li>
          </ol>
        </body>`
      )
    ).toEqual([
      '0:P {"l":"ul"}: [0:T: "With ", 1:B: "bold", 2:T: " and not bold."]',
      '1:P {"l":"ol"}: [0:T: "With ", 1:I: "italic ", 2:B+I: "bold", 3:T: " and not ", 4:I: "italic", 5:T: "."]',
    ])
  })

  it('should handle br', () => {
    expect(
      testFromHTML(
        `<body>
          <p>Foo.</p>
          <br/>
          <p>Bar.</p>
        </body>`
      )
    ).toEqual(['0:P: "Foo."', '1:P: ""', '2:P: "Bar."'])
  })

  it('should parse to and from html', () => {
    expect(
      toHTML(
        fromHTML(
          `<html><body>
          <p>Simple</p>
          <p>With <strong>bold</strong> and <em>italics <strong>and bold</strong></em></p>
          <ul>
            <li>With <strong>bold</strong> and not bold.</li>
          </ul>
          <ol>
            <li>With <em>italic <strong>bold</strong></em> and not <em>italic</em>.</li>
          </ol>
        </body></html>`
        )
      )
    ).toEqual(
      `<html><body>
<p>Simple</p>
<p>With <strong>bold</strong> and <em>italics </em><strong><em>and bold</em></strong></p>
<ul>
<li>With <strong>bold</strong> and not bold.</li>
</ul>
<ol>
<li>With <em>italic </em><strong><em>bold</em></strong> and not <em>italic</em>.</li>
</ol>
</body></html>`
    )
  })
})
