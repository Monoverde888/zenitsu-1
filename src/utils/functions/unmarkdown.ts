function unMarkdown(texto: string) {

    return texto.split('*').join('\\*').split('`').join('\\`').split('~').join('\\~').split('_').join('\\_').split('|').join('\\|');

}

export default unMarkdown;