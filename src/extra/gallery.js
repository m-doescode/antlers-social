import {is$typed as _is$typed} from '@atproto/api/dist/client/util'
import {validate as _validate} from '@atproto/lexicon/dist/lexicons.js'
const is$typed = _is$typed,
  validate = _validate
const id = 'app.bsky.embed.gallery'
const hashMain = 'main'
export function isMain(v) {
  return is$typed(v, id, hashMain)
}
export function validateMain(v) {
  return validate(v, id, hashMain)
}
const hashImage = 'image'
export function isImage(v) {
  return is$typed(v, id, hashImage)
}
export function validateImage(v) {
  return validate(v, id, hashImage)
}
const hashView = 'view'
export function isView(v) {
  return is$typed(v, id, hashView)
}
export function validateView(v) {
  return validate(v, id, hashView)
}
const hashViewImage = 'viewImage'
export function isViewImage(v) {
  return is$typed(v, id, hashViewImage)
}
export function validateViewImage(v) {
  return validate(v, id, hashViewImage)
}
//# sourceMappingURL=gallery.js.map
