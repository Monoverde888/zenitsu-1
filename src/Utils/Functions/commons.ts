import { fileURLToPath } from 'url';
import { dirname } from 'path';

export default function(metaURL: string): { __filename: string, __dirname: string } {

  if (typeof metaURL !== 'string') throw new Error("metaURL must be a string");
  const __filename = fileURLToPath(metaURL);
  const __dirname = dirname(__filename);
  return { __filename, __dirname };

}
