function parseArgs(str: string) {

  if (str) return str.split(/ +/).map(st => st.trim());
  return [str];

}

export default parseArgs;
