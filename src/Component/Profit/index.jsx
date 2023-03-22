import { Tabs } from "antd";
import React, { useState } from "react";
import TableDay from "./tableDay";

const Profit = () => {
  const [activeTab, setActiveTab] = useState("Shopee");
  const handleChangeValueTab = (value) => {
    setActiveTab(value);
  };
  return (
    <div>
      <h1 className="p-4">Doanh thu</h1>

      <Tabs
        size="middle"
        type="card"
        defaultActiveKey="SHIPPING"
        onChange={(activeKey) => handleChangeValueTab(activeKey)}
      >
        <Tabs.TabPane tab="Theo ngày" key="PREPARE">
            <TableDay/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Profit;
