import "antd/dist/reset.css";
import "./App.css";
// import IndexMenu from './component/Menu/indexMenu';
import { Layout } from "antd";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Component/Home";
import MenuRoute from "./Component/Menu/MenuRoute";
import Product from "./Component/Product";
import Warehouse from "./Component/Warehouse";
import CreateOrder from "./Component/CreateOrder/CreateOrder";
import { firebaseConfigLocal, firebaseConfigProduct } from "./Common/constant";
// import { Breadcrumb, Layout, theme } from 'antd';

function App() {
  const { Header, Content, Sider } = Layout;
  const app = initializeApp(
    window.location.hostname === "localhost"
      ? firebaseConfigLocal
      : firebaseConfigProduct
  );
  const db = getDatabase();

  return (
    <div className="App">
      <ToastContainer />
      <Layout>
        <Header className="header" style={{ height: "50px" }}>
          <div className="logo" />
          {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1}  /> */}
        </Header>
        <Layout>
          <Sider
            width={250}
            style={{
              background: "gray",
              height: "100%",
            }}
            collapsed={false}
            defaultCollapsed={false}
          >
            <MenuRoute />
          </Sider>
          <Layout
            style={{
              padding: "0 24px 24px",
            }}
          >
            <Content
              style={{
                padding: 4,
                margin: 0,

                background: "white",
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/san-pham" element={<Product />} />
                <Route path="/nhap-kho" element={<Warehouse />} />
                <Route path="/tao-don-hang" element={<CreateOrder />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
