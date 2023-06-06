export function chunkArray(myArray:any[], chunkSize:number) {
  let index = 0;
  const arrayLength = myArray.length;
  const tempArray = [];

  for (index = 0; index < arrayLength; index += chunkSize) {
    const myChunk = myArray.slice(index, index + chunkSize);
    tempArray.push(myChunk);
  }

  return tempArray;
}
