import {deleteChartUsingPost, listMyChartByPageUsingPost} from '@/services/caocaobi/chartController';
import {Link, useModel} from '@@/exports';
import {Avatar, Button, Card, Col, Divider, message, Modal, Result, Row} from 'antd';
import Search from 'antd/es/input/Search';
import List from 'antd/lib/list';

import React, {useEffect, useState} from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ReactECharts from "echarts-for-react";

/**
 * 我的图表页面
 * @constructor
 */

const MyChartPage: React.FC = () => {
  //把初始条件分离出来,便于后面恢复初始条件
  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc',
  };

  /**
   * 查询参数
   */

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({
    ...initSearchParams,
  });

  //定义变量存储如表数据
  const [chartList, setChartList] = useState<API.Chart[]>();
  //数据总数total,默认为0
  const [total, setTotal] = useState<number>();
  //加载状态,用来控制页面是否加载,默认正在加载
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * 获取当前用户
   */
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};


  /**
   * 加载图表数据
   */

  const loadData = async () => {
    //获取数据中
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPost(searchParams);
      if (res.data) {
        //如果成功,把图表数据回显到前端,如果为空,传一个空数组
        //返回的为分页,res.data.records拿到数据列表
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        // 隐藏图表的 title
        if (res.data.records) {
          res.data.records.forEach((data) => {
            if (data.status === 'succeed') {
              //把后端返回的图表字符串改为对象数组,如果后端返回空字符串,就返回'{}'
              const chartOption = JSON.parse(data.genChart ?? '{}');
              //标题设置为undefined
              chartOption.title = undefined;
              //把修改后的数据转换为json设置回去
              data.genChart = JSON.stringify(chartOption);
            }
          });
        }
      } else {
        //如果后端返回的数据为空,抛出异常,提示'获取我的图表失败'
        message.error('获取我的图表失败');
      }
    } catch (e: any) {
      //如果出现异常,提示'获取我的图表失败'+错误原因
      message.error('获取我的图表失败，' + e.message);
    }
    //加载完毕,设置false
    setLoading(false);
  };

  //首次页面加载,触发加载数据
  useEffect(() => {
    //这个页面首次渲染时,以及这个数组中的搜索条件发生变化时,会执行loadData方法,自动触发重新搜索
    loadData();
  }, [searchParams]);

  /**
   * 删除图表
   * @param chartId
   */
  const handleDelete = (chartId: any) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个图表吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteChartUsingPost({ id: chartId });
          console.log('res:', res.data);
          if (res.data) {
            message.success('删除成功');
            // 删除成功后重新加载图表数据
            loadData();
          } else {
            message.error('删除失败');
          }
        } catch (e: any) {
          message.error('删除失败' + e.message);
        }
      },
    });
  };


  return (
    <div className="my-chart-page">
      {/*引入搜索框*/}
      <div>
        <Search
          placeholder="请输入图表名称"
          enterButton
          loading={loading}
          onSearch={(value) => {
            // 设置搜索条件
            setSearchParams({
              ...initSearchParams,
              name: value,
            });
          }}
        />
      </div>

      <div className="margin-16" />
      {/*先把数据进行展示,直接展示对象会报错,所以要把后端拿到的对象数据进行格式化,把对象转为JSON字符串*/}
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          // 设置分页
          showTotal: () => `共 ${total} 条记录`,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['4','10', '20', '30'],

          /*
        page第几页，pageSize每页显示多少条;
        当用户点击这个分页组件,切换分页时,这个组件就会去触发onChange方法,会改变咱们现在这个页面的搜索条件
*/
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            });
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card style={{ width: '100%' }}>
              <List.Item.Meta
                //当前用户头像
                avatar={<Avatar src={currentUser?.userAvatar} />}
                title={currentUser?.userName}
                description={item.chartType ? '图表类型：' + item.chartType : undefined}
              />
              <>
                {item.status === 'wait' && (
                  <>
                    <Result
                      status="warning"
                      title="待生成"
                      subTitle={item.execMessage ?? '当前图表生成队列繁忙，请耐心等候'}
                    />
                    <Row>
                      <Col push={16}>
                        <Link to={`/ViewChartData/${item.id}`}>
                          <Button>查看图表数据</Button>
                        </Link>
                      </Col>
                      <Col push={17}>
                        <Button danger onClick={() => handleDelete(item.id)}>
                          删除
                        </Button>
                      </Col>

                    </Row>

                  </>
                )}

                {item.status === 'running' && (
                  <>
                    <Result status="info" title="图表生成中" subTitle={item.execMessage} />
                    <Link to={`/ViewChartData/${item.id}`}>
                      <Button>查看图表数据</Button>
                    </Link>

                  </>
                )}

             {/*   {item.status === 'succeed' && (
                  <>
                    <div style={{ marginBottom: 16 }} />
                    <p>{'分析目标：' + item.goal}</p>
                    <div style={{ marginBottom: 16 }} />
                    <ReactECharts option={item.genChart && JSON.parse(item.genChart)} />
                  </>
                )}*/}

                {item.status === 'succeed' && (
                  <>
                    <p
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: 'orange',
                        fontSize: '16px',
                      }}
                    >
                      {'图表名称：' + item.name}
                    </p>

                    <List.Item.Meta
                      style={{ textAlign: 'left', fontWeight: 'bold' }}
                      description={item.chartType ? '图表类型：' + item.chartType : undefined}
                    />
                    <ReactECharts option={item.genChart && JSON.parse(item.genChart)} />
                    <p
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#000000',
                        fontSize: '16px',
                      }}
                    >
                      {'分析目标：' + item.goal}
                    </p>
                    <Divider style={{ fontWeight: 'bold', color: 'orange', fontSize: '16px' }}>
                      智能分析结果
                    </Divider>
                    <div style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
                      <p style={{ fontWeight: 'bold', color: '#00000080' ,textAlign:"left"}}>
                        {item.genResult}
                      </p>
                    </div>
                    <Row>

                      <Col style={{ color: 'black', fontWeight: 'bold' }}>
                        {new Date(item.createTime).toLocaleString()}
                      </Col>


                      <Col push={4}>
                        <Link to={`/ViewChartData/${item.id}`}>
                          <Button>查看图表数据</Button>
                        </Link>
                      </Col>

                      <Col push={6}>
                        <Button danger onClick={() => handleDelete(item.id)}>
                          删除
                        </Button>
                      </Col>

                    </Row>
                  </>
                )}


                {item.status === 'failed' && (
                  <>
                    <Result status="error" title="图表生成失败" subTitle={item.execMessage} />
                    <Row justify="end">
                      <Col style={{ paddingRight: '10px' }}>
                        <Button type="primary" onClick={() => message.warning('敬请期待')}>
                          重试
                        </Button>
                      </Col>
                      <Col>
                        <Link to={`/ViewChartData/${item.id}`}>
                          <Button>查看图表数据</Button>
                        </Link>
                      </Col>
                      <Col>
                        <Button danger onClick={() => handleDelete(item.id)}>
                          删除
                        </Button>
                      </Col>
                    </Row>

                      </>
                )}
              </>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default MyChartPage;
