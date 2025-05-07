import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';

export const AntdProvider = ({ children }) => {
  return (
    <StyleProvider hashPriority="high">
      <ConfigProvider
        theme={{
          token: {
            // Add your theme customization here if needed
          },
        }}
      >
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
}; 