function replace(string: string, array: string[]) {

    let res = string;

    for (let i of array) {
        res = res.split(i).join('[PRIVATE]')
    }

    return res;

}

export default replace;