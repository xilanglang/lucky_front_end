import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TonConnectUIProvider } from '@tonconnect/ui-react';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>有助于检查 React 应用中的潜在问题和不安全用法，推动代码符合未来的 React 版本的最佳实践。
  // 使用 <StrictMode> 是让代码更健壮、易维护的一个重要开发习惯。
  // 当我们的应用程序连接到用户的钱包时，我们需要向用户提供一些身份信息。
  // “谁要求确认？”我们需要使用清单（Mainfest）文件来确认自己的身份。钱包会请求用户允许连接应用程序并显示清单中的信息。
  // import.meta.env.VITE_TONCONNECT_MANIFEST_URL: 清单文件地址
  <StrictMode>
    <TonConnectUIProvider manifestUrl={import.meta.env.VITE_TONCONNECT_MANIFEST_URL}>
      <App />
    </TonConnectUIProvider>
  </StrictMode>
)