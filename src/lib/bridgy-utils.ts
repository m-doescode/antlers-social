import {DOMParser} from 'react-native-html-parser'
import {type Facet, RichText} from '@atproto/api'

const NODE_TYPE_ELEMENT = 1
const NODE_TYPE_TEXT = 3

function emitFacet(node: any, startText: string, facets: Facet[]): string {
  if (node.nodeType == NODE_TYPE_ELEMENT) {
    if (node.tagName == 'br') {
      return '\n'
    } else if (node.tagName == 'a') {
      const resultText = emitFacetList(node.childNodes, startText, facets)
      facets.push({
        $type: 'app.bsky.richtext.facet',
        index: {
          byteStart: startText.length,
          byteEnd: startText.length + resultText.length,
        },
        features: [
          {
            $type: 'app.bsky.richtext.facet#link',
            uri: node.getAttribute('href'),
          },
        ],
      })
      return resultText
    } else {
      return emitFacetList(node.childNodes, startText, facets)
    }
  } else if (node.nodeType == NODE_TYPE_TEXT) {
    return node.nodeValue
  } else {
    return ''
  }
}

function emitFacetList(
  nodeList: any,
  startText: string,
  facets: Facet[],
): string {
  let text = ''
  for (let i = 0; i < nodeList.length; i++) {
    text += emitFacet(nodeList.item(i), startText + text, facets)
  }
  return text
}

export function parseMastodonRichText(sourceText: string): RichText {
  let strippedText
  let facets: Facet[] = []

  const parser = new DOMParser()
  const result = parser.parseFromString(sourceText)
  strippedText = emitFacetList(result.documentElement.childNodes, '', facets)

  return new RichText({
    text: strippedText,
    facets: facets,
  })
}
