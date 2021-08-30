import fs from 'fs/promises';
import path from 'path';

async function getFiles(dir: string): Promise<string[]> {

    const todo = await fs.readdir(dir, { withFileTypes: true });
    const names = [];

    for (const folder of todo) {
        if (folder.isDirectory()) {
            const files = await getFiles(path.join(dir, folder.name));
            for (const file of files) names.push(file);
        } else names.push(path.join(dir, folder.name));
    }

    return names;

}

export default getFiles;