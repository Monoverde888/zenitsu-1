function replace(string: string, array: string[], Private: string): string {

  let res = string;

  for (const i of array) {
    res = res.split(i).join(Private);
  }

  return res;

}

export default replace;
