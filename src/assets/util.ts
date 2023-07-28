// 忽略多个空格，换行前后的空格
export function handleChangLine(text:string)
{
    text = text.replace(/ +/g, ' ')
    text = text.replace(/ +\n/g, '\n')
    text = text.replace(/\n +/g, '\n')
    text = text.replace(/\n/g, ' \n ')
    return text
}
