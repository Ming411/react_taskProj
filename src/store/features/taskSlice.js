/* Task板块切片 */
import {createSlice} from '@reduxjs/toolkit';
import {getTaskList} from '../../api';
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

//从切换中获取actionCreator:此处解构的方法和上面reducers中的方法，仅仅是函数名相同；方法执行，返回需要派发的行为对象：后期我们可以基于dispatch进行任务派发即可！！
export let {getAllTaskList, removeTask, updateTask} = taskSlice.actions;
// console.log(getAllTaskList([])); //{type:'task/getAllTaskList',payload:[]}
// console.log(taskSlice);

/* 实现异步派发 redux-thunk*/
export const getAllTaskListAsync = () => {
  return async dispatch => {
    let list = [];
    try {
      let result = await getTaskList(0);
      if (+result.code === 0) {
        list = result.list;
      }
    } catch (_) {}
    dispatch(getAllTaskList(list));
  };
};

export default taskSlice.reducer;
