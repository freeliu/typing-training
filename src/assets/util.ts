// 忽略多个空格，换行前后的空格
export function handleChangLine(text: string) {
  text = text.replace(/ +/g, ' ')
  text = text.replace(/ +\n/g, '\n')
  text = text.replace(/\n +/g, '\n')
  text = text.replace(/\n/g, ' \n ')
  return text
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
