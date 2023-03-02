import React, {PureComponent} from 'react';
import './Task.scss';
import {Button, Tag, Table, Popconfirm, Modal, Form, Input, DatePicker, message} from 'antd';
import {flushSync} from 'react-dom';
import {getTaskList, addTask, removeTask, completeTask} from '@/api';
// 处理日期的方法
const zero = function zero(text) {
  text = String(text);
  // 补零操作
  return text.length < 2 ? '0' + text : text;
};
const formatTime = function formatTime(time) {
  let arr = time.match(/\d+/g),
    [, month, day, hours = '00', minutes = '00'] = arr;
  return `${zero(month)}-${zero(day)} ${zero(hours)}:${zero(minutes)}`;
};

export default class Task extends PureComponent {
  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      align: 'center',
      width: '8%'
    },
    {
      title: '任务描述',
      dataIndex: 'task',
      ellipsis: true, // 超出小点...不换行
      width: '50%'
    },
    {
      title: '状态',
      dataIndex: 'state',
      align: 'center',
      width: '10%',
      //  + 表示在计算之前将其转为数字
      render: text => (+text === 1 ? '未完成' : '已完成')
    },
    {
      title: '完成时间',
      dataIndex: 'time',
      align: 'center',
      width: '15%',
      render: (_, record) => {
        let {state, time, complete} = record;
        if (+state === 2) time = complete;
        return formatTime(time);
      }
    },
    {
      title: '操作',
      render: (_, record) => {
        let {id, state} = record;
        return (
          <>
            <Popconfirm title='您确定要删除此任务吗？' onConfirm={this.handleRemove.bind(null, id)}>
              <Button type='link'>删除</Button>
            </Popconfirm>

            {+state !== 2 ? (
              <Popconfirm
                title='您确把此任务设置为完成吗？'
                onConfirm={this.handleUpdate.bind(null, id)}
              >
                <Button type='link'>完成</Button>
              </Popconfirm>
            ) : null}
          </>
        );
      }
    }
  ];
  state = {
    tableData: [
      // {
      //   id: 1,
      //   task: 'coder~',
      //   state: 1,
      //   time: '2023-02-20 18:00:00',
      //   complete: '2023-02-21 18:00:00'
      // },
      // {
      //   id: 2,
      //   task: 'coder~',
      //   state: 2,
      //   time: '2023-02-20 18:00:00',
      //   complete: '2023-02-21 18:00:00'
      // }
    ],
    ruleForm: {
      task: '',
      time: ''
    },
    tableLoading: false,
    modalVisible: false,
    confirmLoading: false, // 控制弹窗中的确定按钮loading
    selectIndex: 0 // 0 全部 1未完成  2已完成
  };

  // 删除按钮
  handleRemove = async id => {
    try {
      let {code} = await removeTask(id);
      if (+code !== 0) {
        message.error('很遗憾，操作失败，请稍后再试!');
      } else {
        this.queryData();
        message.success('恭喜您，操作成功!');
      }
    } catch (_) {}
  };
  // 完成按钮
  handleUpdate = async id => {
    try {
      let {code} = await completeTask(id);
      if (+code !== 0) {
        message.error('很遗憾，操作失败，请稍后再试!');
      } else {
        this.queryData();
        message.success('恭喜您，操作成功!');
      }
    } catch (_) {}
  };
  // 关闭弹窗
  closeModal = () => {
    this.setState({
      modalVisible: false,
      confirmLoading: false
    });
    this.formIns.resetFields();
  };
  // 提交表单
  submit = async () => {
    try {
      await this.formIns.validateFields();
      let {task, time} = this.formIns.getFieldValue();
      time = time.format('YYYY-MM-DD HH:mm:ss');
      this.setState({confirmLoading: true}); // 开启确定Loading
      let {code} = await addTask(task, time);
      if (+code !== 0) {
        message.error('很遗憾，当前操作失败，请稍后再试!');
      } else {
        this.closeModal();
        this.queryData();
        message.success('恭喜您，当前操作成功!');
      }
    } catch (_) {}
    this.setState({confirmLoading: false});
  };
  // 修改三选一框
  changeIndex = index => {
    if (this.state.selectIndex === index) return;
    // this.setState(
    //   {
    //     selectIndex: index
    //   },
    //   () => {
    //     this.queryData();
    //   }
    // );
    flushSync(() => {
      this.setState({
        selectIndex: index
      });
    });
    this.queryData();
  };

  componentDidMount() {
    this.queryData();
  }

  // 获取table数据
  queryData = async () => {
    let {selectIndex} = this.state;
    try {
      this.setState({
        tableLoading: true
      });
      let {code, list} = await getTaskList(selectIndex);
      if (+code !== 0) list = [];
      this.setState({
        tableData: list
      });
    } catch (_) {}
    this.setState({
      tableLoading: false
    });
  };

  render() {
    let {tableData, tableLoading, modalVisible, confirmLoading, selectIndex} = this.state;
    return (
      <div className='task-box'>
        <div className='header'>
          <h2 className='title'>OA</h2>
          <Button
            type='primary'
            onClick={() => {
              this.setState({
                modalVisible: true
              });
            }}
          >
            新增任务
          </Button>
        </div>
        <div className='tag-box'>
          {['全部', '未完成', '已完成'].map((item, index) => {
            return (
              <Tag
                key={index}
                color={index === selectIndex ? '#1677ff' : ''}
                onClick={this.changeIndex.bind(null, index)}
              >
                {item}
              </Tag>
            );
          })}
          {/* <Tag color='#1677ff'>全部</Tag>
          <Tag>未完成</Tag>
          <Tag>已完成</Tag> */}
        </div>
        <Table
          dataSource={tableData}
          columns={this.columns}
          tableLoading={tableLoading}
          pagination={false}
          rowKey='id' // 指定唯一值，key
        />

        <Modal
          title='新增任务窗口'
          open={modalVisible}
          confirmLoading={confirmLoading}
          keyboard={false} // 禁止键盘操作关闭
          maskClosable={false} // 禁止点击遮罩层关闭
          okText='确认提交'
          onCancel={this.closeModal}
          onOk={this.submit}
        >
          <Form
            layout='vertical'
            requiredMark={true} // 必填是否需要小红点
            // 设置初始值
            initialValues={{
              task: '',
              time: ''
            }}
            ref={x => (this.formIns = x)}
          >
            <Form.Item
              label='任务描述'
              name='task' // 将表单收集到的值存放至该字段
              validateTrigger='onBlur'
              rules={[
                {required: true, message: '任务描述是必填项'},
                {min: 6, message: '输入的内容至少6位及以上'}
              ]}
            >
              <Input.TextArea
                rows={4}
                value={this.state.ruleForm.task}
                onChange={ev => {
                  let target = ev.target,
                    text = target.value.trim();
                  this.setState({
                    ruleForm: {
                      ...this.state.ruleForm,
                      task: text
                    }
                  });
                }}
              ></Input.TextArea>
            </Form.Item>
            <Form.Item
              label='预期完成时间'
              name='time'
              validateTrigger='onBlur'
              rules={[{required: true, message: '预期完成时间是必填项'}]}
            >
              <DatePicker
                showTime
                value={this.state.ruleForm.time}
                onChange={value => {
                  this.setState({
                    ruleForm: {
                      ...this.state.ruleForm,
                      time: value
                    }
                  });
                }}
              ></DatePicker>
            </Form.Item>
            {/* 只有button在form中且htmlType='submit'才会自动触发表单校验 */}
          </Form>
        </Modal>
      </div>
    );
  }
}
