import { NewNode } from '@edtr-io/plugin-text'

import { converter } from '../../external/markdown'
import { convertLegacyState } from './convert-legacy-state'
import {
  EdtrState,
  SlateBlockElement,
  SlateTextElement,
  UnsupportedEdtrState,
} from './edtr-io-types'
import { sanitizeLatex } from './sanitize-latex'
import {
  FrontendContentNode,
  FrontendLiNode,
  FrontendMathNode,
  FrontendTextColor,
} from '@/data-types'

const colors: FrontendTextColor[] = ['blue', 'green', 'orange']

function isEdtrState(node: ConvertData): node is EdtrState {
  return (node as EdtrState).plugin !== undefined
}

function isSlateBlock(node: ConvertData): node is SlateBlockElement {
  return (node as SlateBlockElement).type !== undefined
}

function isTextNode(node: ConvertData): node is SlateTextElement {
  return (node as SlateTextElement).text !== undefined
}

type ConvertData = EdtrState | NewNode | SlateTextElement | UnsupportedEdtrState

export function convert(
  node?: ConvertData | ConvertData[]
): FrontendContentNode[] {
  // compat: no or empty node, we ignore
  if (node === undefined || Object.keys(node).length === 0) {
    // console.log('e: node EMPTY')
    return []
  }

  if (Array.isArray(node)) {
    return node.flatMap(convert)
  }

  if (isEdtrState(node)) {
    return convertPlugin(node) as FrontendContentNode[]
  }

  if (isSlateBlock(node)) {
    return convertSlate(node) as FrontendContentNode[]
  }

  if (isTextNode(node)) {
    return convertText(node) as FrontendContentNode[]
  }

  console.log('unsupported -> ', node)
  return []
}

function convertPlugin(node: EdtrState) {
  if (node.plugin === 'rows') {
    return convert((node.state as unknown) as EdtrState)
  }
  if (node.plugin === 'text') {
    return convert(node.state)
  }
  if (node.plugin === 'image') {
    return [
      {
        type: 'img',
        src: node.state.src,
        alt: node.state.alt,
        maxWidth: node.state.maxWidth,
      },
    ]
  }
  if (node.plugin === 'important') {
    return [
      {
        type: 'important',
        children: convert(node.state),
      },
    ]
  }
  if (node.plugin === 'blockquote') {
    return [
      {
        type: 'blockquote',
        children: convert(node.state as EdtrState),
      },
    ]
  }
  if (node.plugin === 'spoiler') {
    return [
      {
        type: 'spoiler-container',
        children: [
          {
            type: 'spoiler-title',
            children: [
              {
                type: 'text',
                text: node.state.title,
              },
            ],
          },
          {
            type: 'spoiler-body',
            children: convert(node.state.content as EdtrState),
          },
        ],
      },
    ]
  }

  if (node.plugin === 'multimedia') {
    const width = node.state.width ?? 50
    return [
      {
        type: 'multimedia',
        mediaWidth: width,
        float: 'right',
        media: convert(node.state.multimedia as EdtrState),
        children: convert(node.state.explanation as EdtrState),
      },
    ]
  }
  if (node.plugin === 'layout') {
    return [
      {
        type: 'row',
        children: node.state.map((child) => {
          const children = convert(child.child)
          // compat: math align left
          children.forEach((child) => {
            if (child.type === 'math') {
              child.alignLeft = true
            }
          })
          return {
            type: 'col',
            size: child.width,
            children,
          }
        }),
      },
    ]
  }
  if (node.plugin === 'injection') {
    return [
      {
        type: 'injection',
        href: node.state,
      },
    ]
  }
  if (node.plugin === 'highlight') {
    return [
      {
        type: 'code',
        code: node.state.code,
      },
    ]
  }
  if (node.plugin === 'table') {
    const html = converter.makeHtml(node.state)
    return convertLegacyState(html).children
  }
  if (node.plugin === 'video') {
    return [
      {
        type: 'video',
        src: node.state.src,
      },
    ]
  }
  if (node.plugin === 'anchor') {
    return [
      {
        type: 'anchor',
        id: node.state,
      },
    ]
  }
  if (node.plugin === 'geogebra') {
    // compat: full url given
    let id = node.state
    const match = /geogebra\.org\/m\/(.+)/.exec(id)
    if (match) {
      id = match[1]
    }
    return [{ type: 'geogebra', id }]
  }
  if (node.plugin === 'equations') {
    const steps = node.state.steps.map((step) => {
      return {
        left: sanitizeLatex(step.left),
        leftSource: step.left,
        sign: step.sign,
        right: sanitizeLatex(step.right),
        rightSource: step.right,
        transform: sanitizeLatex(step.transform),
        transformSource: step.transform,
        explanation: convert(step.explanation),
      }
    })
    return [{ type: 'equations', steps }]
  }

  return []
}

function convertSlate(node: SlateBlockElement) {
  if (node.type === 'p') {
    const children = convert(node.children)

    // compat unwrap math from p
    if (children.length === 1 && children[0].type === 'math') {
      return children
    }

    // compat: unwrap ul/ol from p
    // see https://github.com/serlo/frontend/issues/249
    if (
      children.length === 1 &&
      (children[0].type === 'ul' || children[0].type === 'ol')
    ) {
      return children
    }

    // compat: extract math formulas, see https://github.com/serlo/frontend/issues/186 (first warning)
    const math = children.filter(
      (child) => child.type === 'math' || child.type === 'inline-math'
    )
    if (math.length >= 1) {
      if (
        children.every(
          (child) =>
            child.type === 'math' ||
            child.type === 'inline-math' ||
            (child.type === 'text' && child.text === '')
        )
      ) {
        return children
          .filter(
            (child) => child.type === 'math' || child.type === 'inline-math'
          )
          .map((mathChild) => {
            mathChild.type = 'math'
            ;(mathChild as FrontendMathNode).alignLeft = true
            return mathChild
          })
      }
    }

    // compat handle newlines
    // see https://github.com/serlo/frontend/pull/527#discussion_r482969315
    if (
      children.some(
        (child) =>
          (child.type === 'text' && child.text.includes('\n')) ||
          child.type === 'inline-math'
      )
    ) {
      const splitted: (FrontendContentNode | '##break##')[] = children.flatMap(
        (child) => {
          if (child.type === 'text' && child.text.includes('\n')) {
            const parts: (
              | FrontendContentNode
              | '##break##'
            )[] = child.text.split('\n').flatMap((text) => [
              {
                type: 'text',
                text,
              },
              '##break##',
            ])
            parts.pop()
            return parts
          }
          return [child]
        }
      )
      let current: FrontendContentNode[] = []
      const result: FrontendContentNode[] = []
      if (splitted[0] === '##break##') splitted.shift()
      if (splitted[splitted.length - 1] !== '##break##')
        splitted.push('##break##')
      splitted.forEach((el) => {
        if (el === '##break##') {
          result.push({
            type: 'p',
            children: current,
          })
          current = []
        } else {
          current.push(el)
        }
      })
      return result
    }
    return [
      {
        type: 'p',
        children,
      },
    ]
  }
  if (node.type === 'a') {
    return [
      {
        type: 'a',
        href: node.href ?? '',
        children: convert(node.children),
      },
    ]
  }
  if (node.type === 'h') {
    if (
      node.level === 1 ||
      node.level === 2 ||
      node.level == 3 ||
      node.level === 4 ||
      node.level === 5
    ) {
      return [
        {
          type: 'h',
          level: node.level,
          children: convert(node.children),
        },
      ]
    } else {
      return [
        {
          type: 'h',
          level: 5,
          children: convert(node.children),
        },
      ]
    }
  }
  if (node.type === 'math' && !node.inline) {
    return [
      {
        type: 'math',
        formula: sanitizeLatex(node.src),
        formulaSource: node.src,
        //debugOriginalFormula: node.src,
      },
    ]
  }
  if (node.type === 'math' && node.inline) {
    return [
      {
        type: 'inline-math',
        formula: sanitizeLatex(node.src),
        formulaSource: node.src,
        //debugOriginalFormula: node.src,
      },
    ]
  }
  if (node.type === 'unordered-list') {
    const children: FrontendLiNode[] = []
    convert(node.children).forEach((child) => {
      if (child.type === 'li') {
        children.push(child)
      }
    })
    return [
      {
        type: 'ul',
        children,
      },
    ]
  }
  if (node.type === 'ordered-list') {
    const children: FrontendLiNode[] = []
    convert(node.children).forEach((child) => {
      if (child.type === 'li') {
        children.push(child)
      }
    })
    return [
      {
        type: 'ol',
        children,
      },
    ]
  }
  if (node.type === 'list-item') {
    return [
      {
        type: 'li',
        children: convert(node.children),
      },
    ]
  }
  if (node.type === 'list-item-child') {
    const children = convert(node.children)

    // compat: don't wrap ps, see https://github.com/serlo/frontend/issues/551 and 579
    if (children.filter((child) => child.type === 'p').length > 0) {
      return children
    }

    //compat: only inline-math and links get wrapped? not sure about this
    if (
      children.filter(
        (child) =>
          child.type === 'inline-math' ||
          child.type === 'a' ||
          child.type !== undefined
      ).length === 0
    ) {
      return children
    }
    return [{ type: 'p', children }]
  }

  return []
}

function convertText(node: SlateTextElement) {
  if (node.text === '') return []
  return [
    {
      type: 'text',
      text: node.text,
      em: node.em,
      strong: node.strong,
      color: colors[node.color as number],
    },
  ]
}
