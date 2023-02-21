import React,{useState} from 'react'
import {
  AppstoreOutlined,
  ScanOutlined,
  ShoppingCartOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import styled from 'styled-components';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem('Trang chủ', '1', <HomeOutlined />),
  getItem('Sản phẩm', '2', <ShoppingCartOutlined />),
  getItem('Nhập kho', '3', <ScanOutlined />),
  getItem('Navigation One', 'sub1', <MailOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Option 7', '7'),
    getItem('Option 8', '8'),
  ]),
  getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Submenu', 'sub3', null, [getItem('Option 11', '11'), getItem('Option 12', '12')]),
  ]),
];
function MenuRoute() {
    const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div style={{
        width: 256,
        height: '100%',
        position:'relative',
      }}>
         {/* <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          marginBottom: 16,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button> */}
      <CustomMenu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={false}
        items={items}
      />
      {collapsed ?<LeftOutlined
      onClick={toggleCollapsed}
      style={{
        cursor: 'pointer',
      position:'absolute',
      bottom:'10px',
      color:'white'
      }}
      />
      : <RightOutlined
      onClick={toggleCollapsed}
      style={{
        cursor:'pointer',
      position:'absolute',
      bottom:'10px',
      color:'white'
      }}
      />
      
      }
    </div>
  )
}

export default MenuRoute
const CustomMenu= styled(Menu)`
          height:calc(100vh - 50px);
`