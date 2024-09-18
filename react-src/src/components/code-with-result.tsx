import { useContext, useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-perl';
import '@styles/prism-vsc-dark-plus.css';
import * as S from '@src/styled';
import { getLastCode, runnerExecute } from '@backend/runner';
import { Split } from '@geoffcox/react-splitter';
import { useDebouncedCallback } from 'use-debounce';
import IconRefresh from '@src/icons/refresh';
import { createPortal } from 'react-dom';
import { titlebarIconProps } from '@src/common/props';
import { TabActiveContext } from '@src/common/contexts';
import { languageType } from '@src/styles/type';

const debounceTime = 500;
export const CodeWithResult = ({ language, extension, sample, runner }: languageType) => {
  const { activeTab } = useContext(TabActiveContext);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(true);
  const [splitSize, setSplitSize] = useState({ primary: 0, secondary: 0 });
  const debounced = useDebouncedCallback((value) => {
    setLoading(true);
    runnerExecute(runner, value, extension).then((text) => {
      setOutput(text);
      setLoading(false);
    });
  }, debounceTime);
  useEffect(() => {
    debounced(code);
  }, [code]);
  useEffect(() => {
    getLastCode(extension).then((lastCode) => {
      setCode(lastCode.trim().length > 0 ? lastCode : sample);
    });
  }, []);
  const highlightLang = languages[language];
  return (
    <>
      <Split
        onMeasuredSizesChanged={setSplitSize}
        horizontal
        initialPrimarySize='70%'
        minPrimarySize='15%'
        minSecondarySize='15%'>
        <div className='editor' style={{ height: splitSize.primary, overflow: 'auto' }}>
          <Editor
            autoFocus
            value={code}
            onValueChange={(code) => {
              setCode(code);
            }}
            highlight={(code) => highlight(code, highlightLang)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 18,
              color: '#dcdcaa',
            }}
          />
        </div>
        <S.TextareaWrapper className='code-output'>
          <S.TextArea style={{ color: loading ? 'gray' : 'white' }} value={output} readOnly={true}></S.TextArea>
        </S.TextareaWrapper>
      </Split>
      {activeTab === language &&
        document.getElementById('tabBarLeftArea') &&
        createPortal(
          <IconRefresh
            onClick={() => {
              setCode(sample);
            }}
            {...titlebarIconProps}
          />,
          document.getElementById('tabBarLeftArea')!
        )}
    </>
  );
};
