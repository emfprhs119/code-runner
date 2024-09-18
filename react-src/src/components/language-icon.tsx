import IconPython from '../icons/language/python';
import IconJava from '../icons/language/java';
import IconCsharp from '../icons/language/csharp';
import IconJs from '../icons/language/javascript';
import IconBxCodeBlock from '../icons/code';

export const LangIcon = ({ lang }: { lang: string }) => {
  switch (lang) {
    case 'python':
      return <IconPython />;
    case 'java':
      return <IconJava />;
    case 'javascript':
      return <IconJs />;
    case 'csharp':
      return <IconCsharp />;
    default:
      return <IconBxCodeBlock />;
  }
  return <></>;
};
