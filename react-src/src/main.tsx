import { app, events, init, window as neuWindow } from '@neutralinojs/lib';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

if (import.meta.env.DEV) {
  try {
    // method 1
    const storedToken = sessionStorage.getItem('NL_TOKEN');
    if (storedToken) window.NL_TOKEN = storedToken;

    // method 2
    // const authInfo = await import('../../.tmp/auth_info.json');
    // const { accessToken, port } = authInfo;
    // window.NL_PORT = port;
    // window.NL_TOKEN = accessToken;
    // window.NL_ARGS = [
    //   'bin\\neutralino-win_x64.exe',
    //   '',
    //   '--load-dir-res',
    //   '--path=.',
    //   '--export-auth-info',
    //   '--neu-dev-extension',
    //   '--neu-dev-auto-reload',
    //   '--window-enable-inspector',
    // ];
  } catch {
    console.error('Auth file not found, native API calls will not work.');
  }
}

init();
const root = document.getElementById('root');
root!.oncontextmenu = () => false;
ReactDOM.createRoot(root!).render(
  <React.StrictMode>
    <App />
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
