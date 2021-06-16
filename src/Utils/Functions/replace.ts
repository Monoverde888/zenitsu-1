function replace(string: string, array: string[]): string {

  let res = string;

  for (const i of array) {
    res = res.split(i).join('[PRIVATE]')
  }

  return res;

}

export default replace;
