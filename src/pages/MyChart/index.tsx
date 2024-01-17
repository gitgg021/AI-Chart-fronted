import { listMyChartByPageUsingPost } from '@/services/caocaobi/chartController';
import { useModel } from '@@/exports';
import { Avatar, Card, message, Result } from 'antd';
import Search from 'antd/es/input/Search';
import List from 'antd/lib/list';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

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
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  //定义变量存储如表数据
  const [chartList, setChartList] = useState<API.Chart[]>();
  //数据总数total,默认为0
  const [total, setTotal] = useState<number>();
  //加载状态,用来控制页面是否加载,默认正在加载
  const [loading, setLoading] = useState<boolean>(true);
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
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
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
                  </>
                )}

                {item.status === 'running' && (
                  <>
                    <Result status="info" title="图表生成中" subTitle={item.execMessage} />
                  </>
                )}

                {item.status === 'succeed' && (
                  <>
                    <div style={{ marginBottom: 16 }} />
                    <p>{'分析目标：' + item.goal}</p>
                    <div style={{ marginBottom: 16 }} />
                    <ReactECharts option={item.genChart && JSON.parse(item.genChart)} />
                  </>
                )}

                {item.status === 'failed' && (
                  <>
                    <Result status="error" title="图表生成失败" subTitle={item.execMessage} />
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
