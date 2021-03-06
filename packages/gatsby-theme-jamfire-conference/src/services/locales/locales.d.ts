export interface LocalesProviderProps {
  children: React.ReactNode
  defaultLocale: string
  pageContext: {
    locale: string
  }
}
export interface LocalesProps {
  [bg: string]: string
  [cs: string]: string
  [da: string]: string
  [de: string]: string
  [el: string]: string
  [en: string]: string
  [es: string]: string
  [et: string]: string
  [fi: string]: string
  [fr: string]: string
  [hu: string]: string
  [it: string]: string
  [ja: string]: string
  [lt: string]: string
  [lv: string]: string
  [nl: string]: string
  [pl: string]: string
  [pt: string]: string
  [ro: string]: string
  [ru: string]: string
  [sk: string]: string
  [sl: string]: string
  [sv: string]: string
  [tr: string]: string
  [zh: string]: string
}
