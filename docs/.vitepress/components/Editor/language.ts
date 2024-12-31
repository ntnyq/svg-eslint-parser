import { json } from '@codemirror/lang-json'
import { xml } from '@codemirror/lang-xml'
import type { LanguageSupport } from '@codemirror/language'
import type { Extension } from '@codemirror/state'

export interface Language {
  id: string
  name: string
  extension: () => LanguageSupport | Extension[]
}

export type SupportLanguage = 'xml' | 'json'

export const languages: Language[] = [
  {
    id: 'xml',
    name: 'XML',
    extension: () => xml(),
  },
  {
    id: 'json',
    name: 'JSON',
    extension: () => json(),
  },
]
