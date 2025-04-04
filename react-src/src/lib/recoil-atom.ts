import { storage as localForage } from '@neutralinojs/lib';
import { atom, AtomEffect } from 'recoil';

type SettingsState = {
  splitType: 'horizontal' | 'vertical';
  splitPercent: string | undefined;
};

const defaultSplitState = { splitType: 'horizontal' };

const localForageEffect =
  (key: string): AtomEffect<SettingsState> =>
  ({ setSelf, onSet }) => {
    setSelf(
      localForage
        .getData(key)
        .then((savedValue) =>
          savedValue != null ? { ...defaultSplitState, ...JSON.parse(savedValue) } : defaultSplitState
        )
        .catch(() => defaultSplitState)
    );
    onSet((newValue: SettingsState, _: any, isReset: boolean) => {
      isReset ? localForage.setData(key, null) : localForage.setData(key, JSON.stringify(newValue));
    });
  };

export const settingAtom = atom<SettingsState>({
  key: 'settingAtom',
  effects: [localForageEffect('settingAtom')],
});
