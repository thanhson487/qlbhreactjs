import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  RedoOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Table, Tabs, Tooltip } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { formatNumberNav, formatPriceRuleListAssets } from "../../Common";
import { isEmpty } from "lodash";

const ViewData = ({
  dataArr,
  handleEditItem,
  handleDeteleItem,
  handleSync,
  handleReturn,
  handleDoneItem,
}) => {
  const [activeTab, setActiveTab] = useState("Shopee");
  const handleChangeValueTab = (value) => {
    setActiveTab(value);
  };

  const columns = [
    {
      title: "STT",
      key: "STT",
      width: "70px",
      render: (text, object, index) => {
        return <div className="text-center">{index + 1}</div>;
      },
      fixed: "left",
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "idProduct",
      key: "idProduct",
      align: "center",
      fixed: "left",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      align: "center",
      fixed: "left",
    },
    {
      title: "Ngày bán",
      dataIndex: "date",
      key: "date",
      align: "center",
    },
    {
      title: "Tên Khách Hàng",
      dataIndex: "customerName",
      key: "customerName",
      align: "center",
      width: "200px",
    },

    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (value) => {
        return (
          <div style={{ textAlign: "right" }}>
            {formatPriceRuleListAssets(formatNumberNav(value.toString()))}
          </div>
        );
      },
    },
    {
      title: "Doanh số",
      dataIndex: "interest",
      key: "interest",
      align: "center",
      width: "100px",
      render: (value) => {
        if (!value) return "--";
        return (
          <div style={{ textAlign: "right" }}>
            {formatPriceRuleListAssets(formatNumberNav(value.toString()))}
          </div>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: "100px",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      align: "center",
    },
    {
      title: "Sản phẩm mua kèm",
      dataIndex: "productDeal",
      align: "center",
      render: (text, record) => {
        return (
          <div>
            <div>{`${record?.idProductDeal1 || "--"} : ${
              record.quantityDeal1 || "--"
            }`}</div>
            <div>{`${record?.idProductDeal2 || "--"} : ${
              record.quantityDeal2 || "--"
            }`}</div>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      align: "center",
      render: (text, record) => (
        <div className="flex justify-center">
          {record.status !== "success" && (
            <Tooltip title="Chỉnh sửa">
              <Button
                shape="circle"
                size="small"
                className="mr-2"
                icon={<EditOutlined />}
                // onClick={() => handleDeteleItem(record)}
                onClick={() => handleEditItem(record)}
              />
            </Tooltip>
          )}
          {record.status !== "success" && (
            <Tooltip title="Hoàn thành đơn hàng">
              <Button
                shape="circle"
                size="small"
                className="mr-2"
                icon={<CheckCircleOutlined />}
                // onClick={() => handleDeteleItem(record)}
                onClick={() => handleDoneItem(record)}
              />
            </Tooltip>
          )}

          <Tooltip title="Xóa">
            <Button
              shape="circle"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDeteleItem(record)}
            />
          </Tooltip>

          <Popconfirm
            title={"Hoàn hàng"}
            description={"Bạn có chắc chắn muốn hoàn hàng không"}
            onConfirm={() => handleReturn(record)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Tooltip title="Hoàn hàng">
              <Button shape="circle" size="small" icon={<SyncOutlined />} />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Tabs
      size="middle"
      defaultActiveKey="SHIPPING"
      onChange={(activeKey) => handleChangeValueTab(activeKey)}
    >
      <Tabs.TabPane tab="Chờ duyệt" key="PREPARE">
        <div>
          <StyledTable
            columns={columns}
            bordered
            dataSource={dataArr.filter((item) => item?.status === "waitting")}
            scroll={{
              x: 1500,
              y: 580,
            }}
            pagination={{
              pageSize: 50,
            }}
          />
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Đang vận chuyển" key="SHIPPING">
        <div>
          <StyledTable
            columns={columns}
            bordered
            pagination={{
              pageSize: 50,
            }}
            dataSource={dataArr.filter((item) => item?.status === "sending")}
            scroll={{
              x: 1500,
              y: 580,
            }}
          />
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Đã hoàn thành" key="COMPLETE">
        <div>
          <StyledTable
            columns={columns}
            bordered
            pagination={{
              pageSize: 50,
            }}
            dataSource={dataArr.filter((item) => item?.status === "success")}
            scroll={{
              x: 1500,
              y: 500,
            }}
          />
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Hoàn Hàng" key="REFUND">
        <div>
          <StyledTable
            columns={columns}
            bordered
            pagination={{
              pageSize: 50,
            }}
            dataSource={dataArr.filter((item) => item?.status === "")}
            scroll={{
              x: 1500,
              y: 580,
            }}
          />
        </div>
      </Tabs.TabPane>
    </Tabs>
  );
};

export default ViewData;
const StyledTable = styled(Table)`
  .ant-table-container {
    border: 1px solid #f0f0f0 !important;
  }
  .ant-table-selection-column > .ant-checkbox-wrapper {
    display: inline-flex !important;
  }
  .ant-table-cell {
    padding: 8px 16px !important;
  }
  .ant-checkbox-indeterminate .ant-checkbox-inner::after {
    background-color: white;
  }
`;
