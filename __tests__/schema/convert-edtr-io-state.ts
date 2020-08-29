import { convert } from '@/schema/convert-edtr-io-state'

function log(result) {
  console.log('-------------------------')
  console.log(JSON.stringify(result))
  console.log('-------------------------')
}

describe('general compat cases / sanity checks', () => {
  test('undefined node, return empty array', () => {
    //@ts-expect-error not covered by type, should not happen, but might?
    const result = convert(undefined)
    expect(result).toEqual([])
  })

  test('node is empty object, return empty array', () => {
    //@ts-expect-error not covered by type, should not happen, but might?
    const result = convert({})
    expect(result).toEqual([])
  })

  test('unsupported plugin, return empty array', () => {
    const result = convert({ plugin: 'woah-nice-plugin', state: [] })
    expect(result).toEqual([])
  })

  test('unsupported text type, return empty array', () => {
    //@ts-expect-error not covered by type, should not happen, but might?
    const result = convert({ type: 'super-bold', children: [] })
    expect(result).toEqual([])
  })
})

describe('edtr io plugins', () => {
  // plugin: files currently not supported in editor or frontend
  // plugin: inputExercise not handled in converter
  // plugin: scMcExercise not handled in converter

  //TODO: Add test for Equations

  test('plugin: image', () => {
    const result = convert({
      plugin: 'image',
      state: {
        src:
          'https://assets.serlo.org/5c77cd8b27d83_b56b69f307447a110a5ae915e517c73e385c37e8.jpg',
        alt: 'Lernen im eigenen Tempo mit serlo.org',
      },
    })
    expect(result).toEqual([
      {
        type: 'img',
        src:
          'https://assets.serlo.org/5c77cd8b27d83_b56b69f307447a110a5ae915e517c73e385c37e8.jpg',
        alt: 'Lernen im eigenen Tempo mit serlo.org',
        maxWidth: undefined,
      },
    ])
  })

  test('plugin: important?', () => {
    const result = convert({
      plugin: 'important',
      state: {
        plugin: 'text',
        state: [{ type: 'p', children: [{ text: '"Merksatz"' }] }],
      },
    })
    expect(result).toEqual([
      {
        type: 'important',
        children: [
          { type: 'p', children: [{ type: 'text', text: '"Merksatz"' }] },
        ],
      },
    ])
  })

  //TODO: is this a regular plugin?
  test('plugin: layout?', () => {
    const result = convert({
      plugin: 'layout',
      state: [
        {
          child: {
            plugin: 'rows',
            state: [
              {
                plugin: 'text',
                state: [],
              },
            ],
          },
          width: 6,
        },
        {
          child: {
            plugin: 'rows',
            state: [
              {
                plugin: 'text',
                state: [],
              },
            ],
          },
          width: 6,
        },
      ],
    })
    expect(result).toEqual([
      {
        type: 'row',
        children: [
          { type: 'col', size: 6, children: [] },
          { type: 'col', size: 6, children: [] },
        ],
      },
    ])
  })

  test('plugin: anchor', () => {
    const result = convert({ plugin: 'anchor', state: 'AnchorTest' })
    expect(result).toEqual([{ type: 'anchor', id: 'AnchorTest' }])
  })

  //TODO: currently unsupported in frontend
  test('plugin: blockquote', () => {
    const result = convert({
      plugin: 'blockquote',
      state: { plugin: 'text', state: [] },
    })
    expect(result).toEqual([])
  })

  test('plugin: geogebra', () => {
    const result = convert({ plugin: 'geogebra', state: 'jybewqhg' })
    expect(result).toEqual([{ type: 'geogebra', id: 'jybewqhg' }])
  })

  test('plugin: highlight', () => {
    const result = convert({
      plugin: 'highlight',
      state: {
        code: '\n<html>Code</html>',
        language: 'html',
        showLineNumbers: true,
      },
    })
    expect(result).toEqual([{ type: 'code', code: '\n<html>Code</html>' }])
  })

  test('plugin: multimediaExplanation', () => {
    const result = convert({
      plugin: 'multimedia',
      state: {
        explanation: {
          plugin: 'rows',
          state: [
            {
              plugin: 'text',
              state: [],
            },
          ],
        },
        multimedia: {
          plugin: 'image',
          state: {
            src: 'test.jpg',
          },
        },
        illustrating: true,
        width: 50,
      },
    })
    expect(result).toEqual([
      {
        type: 'row',
        children: [
          { type: 'col', size: 50, children: [] },
          {
            type: 'col',
            size: 50,
            children: [{ type: 'img', src: 'test.jpg' }],
          },
        ],
      },
    ])
  })

  test('plugin: rows', () => {
    const result = convert({
      plugin: 'rows',
      state: [
        {
          plugin: 'text',
          state: {
            type: 'h',
            level: 2,
            children: [],
          },
        },
        {
          plugin: 'image',
          state: {
            src: '',
            alt: '',
          },
        },
      ],
    })
    expect(result).toEqual([
      { type: 'h', level: 2, children: [] },
      {
        type: 'img',
        src: '',
        alt: '',
        maxWidth: undefined,
      },
    ])
  })

  test('plugin: serloInjection', () => {
    const result = convert({ plugin: 'injection', state: '/145590' })
    expect(result).toEqual([{ type: 'injection', href: '/145590' }])
  })

  test('plugin: spoiler', () => {
    const result = convert({
      plugin: 'spoiler',
      state: {
        title: 'Mehr Infos',
        content: { plugin: 'rows', state: [] },
      },
    })
    expect(result).toEqual([
      {
        type: 'spoiler-container',
        children: [
          {
            type: 'spoiler-title',
            children: [{ type: 'text', text: 'Mehr Infos' }],
          },
          { type: 'spoiler-body', children: [] },
        ],
      },
    ])
  })

  test('plugin: table', () => {
    const result = convert({
      plugin: 'table',
      state:
        '|||\n' +
        '|||\n' +
        '|Woche 1|Einstieg in die redaktionelle Arbeit|\n' +
        '|Woche 2|Vertiefung der redaktionellen Arbeit|\n' +
        '|Woche 3|Mitarbeit im Projektmanagement der Redaktion|\n' +
        '|Woche 4|vertiefte Mitarbeit im Projektmanagement der Redaktion|',
    })

    expect(result).toEqual([
      { type: 'text', text: ' ' },
      {
        type: 'table',
        children: [
          {
            type: 'tr',
            children: [
              { type: 'th', children: [] },
              { type: 'th', children: [] },
            ],
          },
          {
            type: 'tr',
            children: [
              {
                type: 'td',
                children: [
                  { type: 'p', children: [{ type: 'text', text: 'Woche 1' }] },
                ],
              },
              {
                type: 'td',
                children: [
                  {
                    type: 'p',
                    children: [
                      {
                        type: 'text',
                        text: 'Einstieg in die redaktionelle Arbeit',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'tr',
            children: [
              {
                type: 'td',
                children: [
                  { type: 'p', children: [{ type: 'text', text: 'Woche 2' }] },
                ],
              },
              {
                type: 'td',
                children: [
                  {
                    type: 'p',
                    children: [
                      {
                        type: 'text',
                        text: 'Vertiefung der redaktionellen Arbeit',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'tr',
            children: [
              {
                type: 'td',
                children: [
                  { type: 'p', children: [{ type: 'text', text: 'Woche 3' }] },
                ],
              },
              {
                type: 'td',
                children: [
                  {
                    type: 'p',
                    children: [
                      {
                        type: 'text',
                        text: 'Mitarbeit im Projektmanagement der Redaktion',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'tr',
            children: [
              {
                type: 'td',
                children: [
                  { type: 'p', children: [{ type: 'text', text: 'Woche 4' }] },
                ],
              },
              {
                type: 'td',
                children: [
                  {
                    type: 'p',
                    children: [
                      {
                        type: 'text',
                        text:
                          'vertiefte Mitarbeit im Projektmanagement der Redaktion',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      { type: 'text', text: ' ' },
    ])
  })

  test('plugin: text', () => {
    const result = convert({
      plugin: 'text',
      state: {
        plugin: 'text',
        state: [
          {
            type: 'h',
            level: 2,
            children: [],
          },
          { type: 'p', children: [] },
        ],
      },
    })
    expect(result).toEqual([
      { type: 'h', level: 2, children: [] },
      { type: 'p', children: [] },
    ])
  })

  test('plugin: video', () => {
    const result = convert({
      plugin: 'video',
      state: {
        src: 'https://www.youtube.com/watch?v=IPOnn9EBX74',
        alt: 'Beschreibung.',
      },
    })
    expect(result).toEqual([
      { type: 'video', src: 'https://www.youtube.com/watch?v=IPOnn9EBX74' },
    ])
  })
})

describe('text types', () => {
  test('plain text', () => {
    const input = { text: ' auf die Straße. äÖü"' }
    const result = convert(input)

    expect(result).toEqual([
      {
        type: 'text',
        text: ' auf die Straße. äÖü"',
        em: undefined,
        strong: undefined,
        color: undefined,
      },
    ])
  })

  test('text-type: p', () => {
    const input = {
      type: 'p',
      children: [{ text: 'test' }, { text: 'test2' }],
    }
    const result = convert(input)

    expect(result.length).toBe(1)
    expect(result[0].type).toBe('p')
    expect(result[0]?.children?.length).toBe(2)
  })

  test('text-type: a (anchor)', () => {
    const result = convert({
      type: 'a',
      href: '#top',
      children: [{ text: 'anchor link' }],
    })
    expect(result).toEqual([
      {
        type: 'a',
        href: '#top',
        children: [{ type: 'text', text: 'anchor link' }],
      },
    ])
  })

  test('text-type: a (no href)', () => {
    const result = convert({
      type: 'a',
      children: [{ text: 'link' }],
    })
    expect(result).toEqual([
      {
        type: 'a',
        href: '',
        children: [{ type: 'text', text: 'link' }],
      },
    ])
  })

  test('text-type: h', () => {
    const result = convert({
      type: 'h',
      level: 1,
      children: [{ text: 'H1' }],
    })
    expect(result).toEqual([
      { type: 'h', level: 1, children: [{ type: 'text', text: 'H1' }] },
    ])
  })

  test('text-type: math (inline)', () => {
    const result = convert({
      type: 'math',
      src: '\\tan^{-1}',
      inline: true,
      children: [{ text: '\\tan^{-1}', strong: true }],
    })
    expect(result).toEqual([
      {
        type: 'inline-math',
        formula: '\\tan^{-1}',
      },
    ])
  })

  test('text-type: math (block)', () => {
    const result = convert({
      type: 'math',
      src: 'Math Block',
      inline: false,
      children: [{ text: '' }],
    })
    expect(result).toEqual([{ type: 'math', formula: 'Math Block' }])
  })

  test('text-type: unodered-list', () => {
    const result = convert({
      type: 'unordered-list',
      children: [
        {
          type: 'list-item',
          children: [],
        },
        {
          type: 'list-item',
          children: [],
        },
      ],
    })
    expect(result).toEqual([
      {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [],
          },
          {
            type: 'li',
            children: [],
          },
        ],
      },
    ])
  })

  test('text-type: ordered-list', () => {
    const result = convert({
      type: 'ordered-list',
      children: [
        {
          type: 'list-item',
          children: [],
        },
        {
          type: 'list-item',
          children: [],
        },
      ],
    })
    expect(result).toEqual([
      {
        type: 'ol',
        children: [
          {
            type: 'li',
            children: [],
          },
          {
            type: 'li',
            children: [],
          },
        ],
      },
    ])
  })

  test('text-type: list-item', () => {
    const result = convert({
      type: 'list-item',
      children: [{ type: 'list-item-child', children: [] }],
    })
    expect(result).toEqual([
      {
        type: 'li',
        children: [],
      },
    ])
  })

  test('text-type: list-item-child', () => {
    const result = convert({
      type: 'list-item-child',
      children: [{ text: 'item-child' }],
    })
    expect(result).toEqual([
      { type: 'p', children: [{ type: 'text', text: 'item-child' }] },
    ])
  })
})
