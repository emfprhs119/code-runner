import { filesystem, os } from '@neutralinojs/lib';
const basePath = window.NL_PATH + `/.tmp`;

export async function getLastCode(extension: string) {
  const filename = `code.${extension}`;
  const fullFilePath = `${basePath}/${filename}`;
  try {
    return await filesystem.readFile(fullFilePath);
  } catch (e) {
    return '';
  }
}

export async function runnerExecute(runner: string, code: string, extension: string) {
  try {
    await filesystem.createDirectory(basePath);
  } catch (e) {}
  const filename = `code.${extension}`;
  const fullFilePath = `${basePath}/${filename}`;
  await filesystem.writeFile(fullFilePath, code);
  let command = runner.replace('__filename__', fullFilePath);
  let commandOut = await os.execCommand(command);
  return commandOut.stdOut || commandOut.stdErr;
}
