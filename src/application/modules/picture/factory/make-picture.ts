import { Picture } from '../entities/picture'

type PartialPicture = Partial<Picture>

export function makePicture(override?: PartialPicture): Picture {
  return new Picture({
    aliasKey: 'random-alias-key',
    htmlUrl: 'random-html-url',
    name: 'random-picture-name',
    ...override,
  })
}
