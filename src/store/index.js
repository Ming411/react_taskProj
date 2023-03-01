import {configureStore} from '@reduxjs/toolkit';
import reduxLogger from 'redux-logger';
import reduxThunk from 'redux-thunk';
import taskSliceReducer from './features/taskSlice';
// toolkit基于切片机制   把reducer和actionCreator混合在一起了
const store = configureStore({
  // 指定reducer
  reducer: {
    // 按模块管理
    task: taskSliceReducer
  },
  // 使用中间件 [如果不指定任何中间件，默认集成了redux-thunk]
  // 如果还需要使用其他中间件，一但设置会整体替换默认值，需要手动执行reduxThunk
  middleware: [reduxLogger, reduxThunk]
});

export default store;
