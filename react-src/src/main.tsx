import { app, events, init, window as neuWindow } from '@neutralinojs/lib';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { RecoilRoot } from 'recoil';

if (import.meta.env.DEV) {
  try {
    const storedToken = sessionStorage.getItem('NL_TOKEN');
    if (storedToken) window.NL_TOKEN = storedToken;
  } catch {
    console.error('Auth file not found, native API calls will not work.');
  }
}

init();
const root = document.getElementById('root');
root!.oncontextmenu = () => false;
ReactDOM.createRoot(root!).render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>
);

export function onWindowMinimize() {
  neuWindow.minimize();
}
export function onWindowClose() {
  app.exit();
}

events.on('windowClose', onWindowClose);
events.on('ready', () => {
  neuWindow.getSize().then((size) => {
    neuWindow.setSize({ ...size, width: size.width! + 1 });
    neuWindow.setSize({ ...size, width: size.width! - 1 });
  });
});
