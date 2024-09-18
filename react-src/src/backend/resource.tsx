import { filesystem, os } from '@neutralinojs/lib';
import { languageType } from '@src/styles/type';

export async function loadLanguageJson() {
  const languageJson = JSON.parse(await filesystem.readFile(`${window.NL_PATH}/language.json`));
  const languages: languageType[] = [];
  await Promise.all(
    languageJson.map(async (lang: languageType) => {
      await os.execCommand(lang.check);
      languages.push(lang);
    })
  );
  return languages;
}
