import * as S from '@src/styled';
import { Spin, Tabs, TabsProps } from 'antd';
import { CodeWithResult } from '@src/components/code-with-result';
import { useEffect, useState } from 'react';
import { LangIcon } from '@src/components/language-icon';
import '@styles/index.css';
import '@styles/code.css';
import { TabActiveContext } from './common/contexts';
import { languageType } from './styles/type';
import { loadLanguageJson } from './backend/runner';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('');
  const [languageJson, setLanguageJson] = useState<languageType[]>([]);
  const [isTabVisible, setIsTabVisible] = useState<boolean>(true);
  const items: TabsProps['items'] = languageJson.map((langObj) => ({
    key: langObj.language,
    label: langObj.title,
    icon: <LangIcon lang={langObj.language} />,
    children: (
      <div style={{ height: isTabVisible ? 'calc(100vh - 32px)' : '100vh' }}>
        <CodeWithResult {...langObj} />
      </div>
    ),
  }));

  const OperationsSlot: Record<'left' | 'right', React.ReactNode> = {
    left: <S.FlexWrapper id='tabBarLeftArea'></S.FlexWrapper>,
    right: (
      <S.FlexWrapper id='tabBarRightArea'>
        {/* <IconDown {...titlebarIconProps} style={{ paddingTop: '2px' }} /> */}
        {/* <IconConfig {...titlebarIconProps} /> */}
        {/* <IconMinus onClick={onMinimize} {...titlebarIconProps} /> */}
        {/* <IconClose onClick={onClose} {...{ ...titlebarIconProps, className: 'titlebar-icon hover-red' }} /> */}
      </S.FlexWrapper>
    ),
  };
  useEffect(() => {
    loadLanguageJson().then((json: languageType[]) => {
      setActiveTab(json[0].language);
      setLanguageJson(json);
    });
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLocaleLowerCase() === 'alt') {
        setIsTabVisible((prev) => !prev);
        e.preventDefault();
        e.stopPropagation();
      }
    };
    addEventListener('keydown', handleKeyDown);
    return () => {
      removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  if (languageJson.length === 0)
    return (
      <S.Wrapper>
        <Spin size='large' />
      </S.Wrapper>
    );
  return (
    <S.PageWrapper>
      <TabActiveContext.Provider value={{ activeTab: activeTab }}>
        <Tabs
          tabBarExtraContent={OperationsSlot}
          defaultActiveKey={activeTab}
          onChange={setActiveTab}
          type='card'
          size='small'
          animated={true}
          tabBarGutter={0}
          tabBarStyle={{ height: '32px', margin: '0', display: isTabVisible ? 'flex' : 'none' }}
          items={items}
        />
      </TabActiveContext.Provider>
    </S.PageWrapper>
  );
}
