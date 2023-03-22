import "antd/dist/reset.css";
import "./App.css";
// import IndexMenu from './component/Menu/indexMenu';
import { Layout } from "antd";
import { initializeApp } from "firebase/app";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  firebaseConfigLocal,
  firebaseConfigProductCamLuxury,
  firebaseConfigGamCos,
  firebaseConfigTaiAnh,
} from "./Common/constant";
import Home from "./Component/Home";
import Marketing from "./Component/Marketing";
import MenuRoute from "./Component/Menu/MenuRoute";
import CreateOrder from "./Component/Order/TableOrder";
import Product from "./Component/Product";
import Profit from "./Component/Profit";
import Warehouse from "./Component/Warehouse";

function App() {
  const { Header, Content, Sider } = Layout;
  const renderUrl = (data) =>{
    if(data ==="localhost"){
      return firebaseConfigLocal
    }
    if(data ==="gamcosmetic.netlify.app"){
      return firebaseConfigGamCos
    }
    if(data ==="camcamluxury.netlify.app"){
      return firebaseConfigProductCamLuxury
    }
    if(data ==="taianh.netlify.app"){
      return firebaseConfigTaiAnh
    }
  }
  initializeApp(renderUrl( window.location.hostname)
  );

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
                <Route path="/doanh-thu" element={<Profit />} />
                <Route path="/san-pham" element={<Product />} />
                <Route path="/nhap-kho" element={<Warehouse />} />
                <Route path="/don-hang" element={<CreateOrder />} />
                <Route path="/marketing" element={<Marketing />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
