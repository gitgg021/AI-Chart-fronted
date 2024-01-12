import { useModel } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import { listChartByPageUsingPost } from '@/services/caocaobi/chartController';
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from "@ant-design/icons";
import {Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Spin, Upload} from 'antd';

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { setInitialState } = useModel('@@initialState');

  useEffect(() => {
    listChartByPageUsingPost({}).then((res) => {
      console.error('res', res);
    });
  });

  const onFinish = (values: any) => {
    // todo 等待对接后端  上传数据
  };

  return (
    //把页面内容指定一个类名add_chart
    <div className="add-chart">
      <Form
        //表单名称改为addChart
        name="addChart"
        onFinish={onFinish}
        //初始数据为空
        initialValues={{ }}
      >
        <Form.Item
          name="goal"
          label="分析目标"
          rules={[{ required: true, message: '请输入分析目标' }]}
        >
          <TextArea placeholder="请输入你的分析需求，比如：分析网站用户的增长情况" />
        </Form.Item>


        <Form.Item
          name="name"
          label="图表名称">
          <TextArea placeholder={"请输入你的图表名称"}/>
        </Form.Item>

        <Form.Item
          name="chartType"
          label="图表类型">
           <Select options={[
            { value: '折线图', label: '折线图' },
            { value: '柱状图', label: '柱状图' },
            { value: '堆叠图', label: '堆叠图' },
            { value: '饼图', label: '饼图' },
            { value: '雷达图', label: '雷达图' },
          ]}>
        </Select>
        </Form.Item>


        <Form.Item name="file" label="原始数据">
          <Upload name="file" maxCount={1}>
            <Button icon={<UploadOutlined />}>上传 CSV 文件</Button>
          </Upload>
        </Form.Item>



        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="reset">reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>

  );
};

export default Login;
