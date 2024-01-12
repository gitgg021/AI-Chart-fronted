import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
const Footer: React.FC = () => {
  const defaultMessage = 'AI数据可视化分析平台';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'AI Chart',
          title: 'AI Chart',
          href: 'https://github.com/gitgg021/AI-Chart',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/gitgg021/AI-Chart',
          blankTarget: true,
        },
        {
          key: 'AI Chart',
          title: 'AI Chart',
          href: 'https://github.com/gitgg021/AI-Chart',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
