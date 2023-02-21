import React from 'react'
import MenuRoute from './Menu/MenuRoute'
import { Menu, Layout, theme } from 'antd'
// import { Breadcrumb, Layout, theme } from 'antd';

const { Header, Content, Sider } = Layout
function LayoutApp() {
  const items =['1','2','3']
  const items1 = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));
  return (
    
    <div >
      <Layout >
        <Header className="header" style={{height:'50px'}}>
          <div className="logo" />
          {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1}  /> */}
        </Header>
        <Layout>
          <Sider
            width={200}
            style={{
              background: 'gray',
              height:'100%',
            }}
            collapsed={false}
              defaultCollapsed={false}
          >
            {/* <MenuRoute/> */}
            {/* <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{
                height: '100%',
                borderRight: 0,

              }}
            > */}
              <MenuRoute />
            {/* </Menu> */}
          </Sider>
          <Layout
            style={{
              padding: '0 24px 24px',
            }}
          >
            <Content
              style={{
                padding: 24,
                margin: 0,
                // minHeight: 280,
                //   background: colorBgContainer,
                background: 'white',
              }}
            >
              Content
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  )
}

export default LayoutApp
