import React, { useState } from 'react'
import MenuRoute from './Menu/MenuRoute'
import { Menu, Layout, theme } from 'antd'
import Home from './Home';
import Product from "./Product"
// import { Breadcrumb, Layout, theme } from 'antd';

const { Header, Content, Sider } = Layout
function LayoutApp() {
const [componentActive,setActive] = useState('/san-pham');

  return (
    
    <div >
      <Layout >
        <Header className="header" style={{height:'50px'}}>
          <div className="logo" />
          {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1}  /> */}
        </Header>
        <Layout>
          <Sider
            width={250}
            style={{
              background: 'gray',
              height:'100%',
            }}
            collapsed={false}
              defaultCollapsed={false}
          >
              <MenuRoute setActive = {setActive} />

          </Sider>
          <Layout
            style={{
              padding: '0 24px 24px',
            }}
          >
            <Content
              style={{
                padding: 4,
                margin: 0,
                
                background: 'white',
              }}
            >
             {componentActive ==='/home'&&<Home />}
                {componentActive ==='/san-pham'&&<Product />}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  )
}

export default LayoutApp
