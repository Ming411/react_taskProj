/* Task板块切片 */
import {createSlice} from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'task', // 设置切片的名字
  // 设置初始状态
  initialState: {
    taskList: null
  },
  reducers: {
    // 修改公共状态
    getAllTaskList(state, action) {
      // state不需要再进行克隆了，内部基于immer库管理
      // action 派发的行为对象，无需考虑行为标识了
      state.taskList = action.payload;
    },
    removeTask(state, {payload}) {
      let taskList = state.taskList;
      if (!Array.isArray(taskList)) return;
      state.taskList = taskList.filter(item => {
        return +item.id !== +payload;
      });
    },
    updateTask(state, {payload}) {
      let taskList = state.taskList;
      if (!Array.isArray(taskList)) return;
      state.taskList = taskList.filter(item => {
        if (+item.id === +payload) {
          item.state = 2;
          item.complete = new Date().toLocaleDateString('zh-CN');
        }
        return item;
      });
    }
  }
});

export default taskSlice.reducer;
