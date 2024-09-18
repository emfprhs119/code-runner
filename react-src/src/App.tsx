import * as S from '@src/styled';
import { Spin, Tabs, TabsProps, Flex } from 'antd';
import { CodeWithResult } from '@src/components/code-with-result';
import { useEffect, useState } from 'react';
import { setDraggableRegion } from '@src/lib/setDraggableRegion';
import { LangIcon } from '@src/components/language-icon';
import IconClose from '@src/icons/close';
import IconMinus from '@src/icons/minus';
// import IconDown from '@src/icons/down';
// import IconConfig from '@src/icons/config';
import { onWindowClose as onClose, onWindowMinimize as onMinimize } from '@src/main';
import { titlebarIconProps } from '@src/common/props';
import '@styles/index.css';
import '@styles/code.css';
import { TabActiveContext } from './common/contexts';
import { loadLanguageJson } from './backend/resource';
import { languageType } from './styles/type';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('');
  const [languageJson, setLanguageJson] = useState<languageType[]>([]);
  const items: TabsProps['items'] = languageJson.map((langObj) => ({
    key: langObj.language,
    label: langObj.title,
    icon: <LangIcon lang={langObj.language} />,
    children: (
      <S.ContentWrapper>
        <CodeWithResult {...langObj} />
      </S.ContentWrapper>
    ),
  }));

  const OperationsSlot: Record<'left' | 'right', React.ReactNode> = {
    left: <S.FlexWrapper id='tabBarLeftArea'></S.FlexWrapper>,
    right: (
      <S.FlexWrapper>
        {/* <IconDown {...titlebarIconProps} style={{ paddingTop: '2px' }} />
        <IconConfig {...titlebarIconProps} /> */}
        <IconMinus onClick={onMinimize} {...titlebarIconProps} />
        <IconClose onClick={onClose} {...{ ...titlebarIconProps, className: 'titlebar-icon hover-red' }} />
      </S.FlexWrapper>
    ),
  };
  useEffect(() => {
    loadLanguageJson().then((json: languageType[]) => {
      setActiveTab(json[0].language);
      setLanguageJson(json);
      const intervalId = setInterval(() => {
        if (document.getElementsByClassName('ant-tabs-nav-wrap').length > 0) {
          setDraggableRegion(document.getElementsByClassName('ant-tabs-nav-wrap').item(0) as HTMLElement);
          clearInterval(intervalId);
        }
      }, 50);
    });
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
          tabBarStyle={{ height: '28px', margin: '0' }}
          items={items}
        />
      </TabActiveContext.Provider>
    </S.PageWrapper>
  );
}
