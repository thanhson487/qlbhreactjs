import {
  AppstoreOutlined,
  HomeOutlined,
  LeftOutlined,
  MailOutlined,
  RightOutlined,
  ScanOutlined,
  PlusSquareOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate  } from "react-router-dom";
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
  getItem('Trang chủ', '/', <HomeOutlined />),
  getItem('Sản phẩm', '/san-pham', <ShoppingCartOutlined />),
  getItem('Nhập kho', '/nhap-kho', <ScanOutlined />),
  getItem('Tạo đơn hàng', '/tao-don-hang', <PlusSquareOutlined />),
];
function MenuRoute() {
  const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };


  const handleClickMenu = ({ item, key, keyPath, domEvent }) =>{
    console.log(key);
  navigate(key)
  }
  return (
    <div style={{
        width: 256,
        height: '100%',
        position:'relative',
      }}>
       
      <CustomMenu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={false}
        items={items}
        onClick = {handleClickMenu}
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