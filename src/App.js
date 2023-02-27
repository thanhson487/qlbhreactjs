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
// import { Breadcrumb, Layout, theme } from 'antd';
const firebaseConfig = {
  apiKey: "AIzaSyC_ATO3kV5OuuzZsVAcfECgASvBbmV7mRw",
  authDomain: "qlbanhang-ce9a6.firebaseapp.com",
  databaseURL: "https://qlbanhang-ce9a6-default-rtdb.firebaseio.com",
  projectId: "qlbanhang-ce9a6",
  storageBucket: "qlbanhang-ce9a6.appspot.com",
  messagingSenderId: "862861806123",
  appId: "1:862861806123:web:e82c28108f4233c967386e",
  measurementId: "G-RDP87FZEZM",
};
function App() {
  const { Header, Content, Sider } = Layout;
  const app = initializeApp(firebaseConfig);
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
                <Route path = "/nhap-kho" element = {<Warehouse />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
