export interface Mail {
  from: string,
  text: string,
  theme?: string,
  id: string,
  isReaden: boolean,
  receivingTime: number
}
