import { useContext, useEffect, useState } from 'react';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/mode-rust';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-perl';
import 'ace-builds/src-noconflict/mode-powershell';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

import * as S from '@src/styled';
import { getLastCode } from '@backend/runner';
import { Split } from '@geoffcox/react-splitter';
import IconRefresh from '@src/icons/refresh';
import { createPortal } from 'react-dom';
import { titlebarIconProps } from '@src/common/props';
import { TabActiveContext } from '@src/common/contexts';
import { languageType } from '@src/styles/type';
import IconSplitCellsVertical from '@src/icons/split-vertical';
import IconSplitCellsHorizontal from '@src/icons/split-horizontal';
import { useResultOutput } from '@src/hooks/use-result-output';
import { useRecoilState } from 'recoil';
import { settingAtom } from '@src/lib/recoil-atom';

export const CodeWithResult = ({ language, extension, sample, runner }: languageType) => {
  const { activeTab } = useContext(TabActiveContext);
  const [code, setCode] = useState('');
  const [loading, output] = useResultOutput(runner, code, extension);
  const [settings, setSettings] = useRecoilState(settingAtom);
  useEffect(() => {
    getLastCode(extension).then((lastCode) => {
      setCode(lastCode.trim().length > 0 ? lastCode : sample);
    });
  }, []);
  const isHorizontal = settings.splitType === 'horizontal';
  const IconSplit = isHorizontal ? IconSplitCellsVertical : IconSplitCellsHorizontal;
  return (
    <>
      <Split
        horizontal={isHorizontal}
        initialPrimarySize={settings.splitPercent ?? '65%'}
        onSplitChanged={(primarySize: string) => {
          setSettings((prev) => ({
            ...prev,
            splitPercent: primarySize,
          }));
        }}
        minPrimarySize='15%'
        minSecondarySize='15%'>
        <S.EditorWrapper>
          <AceEditor
            width='100%'
            height='100%'
            placeholder=''
            mode={language}
            theme='monokai'
            onChange={setCode}
            fontSize={16}
            lineHeight={23}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={false}
            value={code}
            setOptions={{
              useWorker: false,
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </S.EditorWrapper>
        <S.TextareaWrapper>
          <S.TextArea style={{ color: loading ? 'gray' : 'white' }} value={output} readOnly={true}></S.TextArea>
        </S.TextareaWrapper>
      </Split>
      <>
        {activeTab === language && document.getElementById('tabBarLeftArea') && (
          <>
            {createPortal(
              <IconRefresh
                onClick={() => {
                  setCode(sample);
                }}
                {...titlebarIconProps}
              />,
              document.getElementById('tabBarLeftArea')!,
              'refresh'
            )}
            {createPortal(
              <IconSplit
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    splitType: prev.splitType === 'horizontal' ? 'vertical' : 'horizontal',
                  }))
                }
                {...titlebarIconProps}
              />,
              document.getElementById('tabBarLeftArea')!,
              'conversion'
            )}
          </>
        )}
      </>
    </>
  );
};
