import { customAlphabet } from 'nanoid'

export const generateUuid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz',
  12,
)

export const generateVerificationCode = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  6,
)

export const generate = {
  uuid: generateUuid,
  code: generateVerificationCode,
}

export default { generate }
