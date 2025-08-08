import {DOMParser} from 'react-native-html-parser'
import {type Facet, RichText} from '@atproto/api'

const NODE_TYPE_ELEMENT = 1
const NODE_TYPE_TEXT = 3

function emitFacet(node: any, startText: string, facets: Facet[]): string {
  console.log(node)
  if (node.nodeType == NODE_TYPE_ELEMENT) {
    if (node.tagName == 'br') {
      return '\n'
    } else if (node.tagName == 'a') {
      const resultText = emitFacetList(node.childNodes, startText, facets)
      // Can't just use startText.length because of utf-8 encoding
      const byteStart = new Blob([startText]).size
      const byteEnd = byteStart + new Blob([resultText]).size
      facets.push({
        $type: 'app.bsky.richtext.facet',
        index: {
          byteStart: byteStart,
          byteEnd: byteEnd,
        },
        features: [
          {
            $type: 'app.bsky.richtext.facet#link',
            uri: node.getAttribute('href'),
          },
        ],
      })
      return resultText
    } else if (node.tagName == 'p') {
      // Paragraph tags should be separated from other elements by two new lines
      let text = ''
      if (startText != '' && !startText.endsWith('\n')) text = '\n\n'
      text += emitFacetList(node.childNodes, startText + text, facets)
      return text + '\n\n'
    } else if (node.tagName == 'blockquote') {
      // (via bridgy) wafrn asks
      // Likely a temporary solution, in future add an actual blockquote facet
      return (
        '   >> ' + emitFacetList(node.childNodes, '   >> ' + startText, facets)
      )
    } else {
      return emitFacetList(node.childNodes, startText, facets)
    }
  } else if (node.nodeType == NODE_TYPE_TEXT && node.nodeValue != ' ') {
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
  if (result == undefined) return new RichText({text: '', facets: []})
  strippedText = emitFacetList(result.childNodes, '', facets)

  // Paragraphs will add trailing newlines. When getting rid of them, we also have to account for facets, so we clamp the last facet
  strippedText = strippedText.trimEnd()
  if (facets.length > 0) {
    const facet = facets[facets.length - 1]
    const byteMax = new Blob([strippedText]).size
    facet.index.byteEnd = Math.min(facet.index.byteEnd, byteMax)
  }

  return new RichText({
    text: strippedText,
    facets: facets,
  })
}

export function isBridgedPost(record: {[_ in string]: unknown}) {
  return (
    /* bridgy: */ !!record.bridgyOriginalUrl ||
    /* wafrn: */ !!record.fediverseId
  )
}

export function getOriginalPostUrl(record: {[_ in string]: unknown}) {
  return /* bridgy: */ (record.bridgyOriginalUrl ||
    /* wafrn: */ record.fediverseId) as string | undefined
}

export function parseBridgedPostText(record: {[_ in string]: unknown}) {
  if (record.bridgyOriginalText)
    // bridgy
    return parseMastodonRichText(record.bridgyOriginalText as string)

  // Wafrn's fullText field is a stripped-down raw text
  // else if (record.fullText) // wafrn
  //   return record.fullText
}
