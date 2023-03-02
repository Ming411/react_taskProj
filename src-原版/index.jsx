import React from 'react';
import ReactDOM from 'react-dom/client';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Task from './views/Task';
import './index.scss';
// import Demo from './views/Demo';
// import Demo from './views/Demo2';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    {/* 汉化操作 */}
    <ConfigProvider locale={zhCN}>
      <Task />
      {/* <Demo /> */}
    </ConfigProvider>
  </>
);
