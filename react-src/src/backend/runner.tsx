import { debug, filesystem, os, app } from '@neutralinojs/lib';
import { languageType } from '@src/styles/type';
const basePath = window.NL_PATH + `/.storage`;
let isDebugMode = false;

async function exec(command: string, options?: os.ExecCommandOptions): Promise<os.ExecCommandResult> {
  if (isDebugMode) debug.log(`RUN: ${command}`);
  const result = await os.execCommand(command, options);
  if (isDebugMode) debug.log(`RESULT: ${command} / ${JSON.stringify(result)}`);
  return result;
}

export async function loadLanguageJson() {
  const config = await app.getConfig();
  isDebugMode = config.enableInspector;
  const languageJson = JSON.parse(await filesystem.readFile(`${window.NL_PATH}/language.json`));
  const languages: languageType[] = [];
  await Promise.all(
    languageJson.map(async (lang: languageType) => {
      if (window.NL_OS === 'Windows') {
        const result = await exec(`where ${lang.runner.split(' ')[0]} >nul 2>nul && echo true || echo false`);
        if (result.stdOut.trim() === 'true') languages.push(lang);
      } else {
        const result = await exec(`which ${lang.runner.split(' ')[0]}`);
        if (result.exitCode === 0) languages.push(lang);
      }
    })
  );
  return languages;
}

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
  const command = runner.replace('__filename__', fullFilePath);
  const result = await exec(command);
  return result.stdOut || result.stdErr;
}
