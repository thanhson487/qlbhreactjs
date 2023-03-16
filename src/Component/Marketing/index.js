import React from "react";
import { Button, Table, Tag, Tooltip } from "antd";
import { get, getDatabase, ref, set, update } from "firebase/database";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import useForm from "../../Common/useForm";
import ListingSkeletonTable from "../../Common/ListingSkeletonTable";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { formatNumberNav, formatPriceRuleListAssets } from "../../Common";
import { nanoid } from "nanoid";

function Marketing(props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const columns = [
    {
      title: "STT",
      key: "STT",
      width: "100px",
      render: (text, object, index) => {
        return <div>{index + 1}</div>;
      },
    },

    {
      title: "Mã sản phẩm",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "total",
      key: "total",
      align: "center",
    },

    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (value) => {
        console.log("value", typeof value, value);

        return (
          <div style={{ textAlign: "right" }}>
            {formatPriceRuleListAssets(formatNumberNav(value.toString()))}
          </div>
        );
      },
    },

    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      align: "center",
      render: (text, record) => (
        <div>
          {formatPriceRuleListAssets(
            formatNumberNav(
              (parseInt(record.total) * parseInt(record.price)).toString()
            )
          )}
        </div>
      ),
    },

    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      align: "center",
      render: (text, record) => (
        <div className="flex justify-center">
          <Tooltip title="Xóa">
            <Button
              shape="circle"
              size="small"
              icon={<DeleteOutlined />}
              // onClick={() => handleDeteleItem(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  return (
    <div>
      <Wrapper>
        <CustomButton>
          <Button type="primary" onClick={() => setOpen(true)}>
            Chiến dịch mới
          </Button>
        </CustomButton>
      </Wrapper>
      {loading ? (
        <ListingSkeletonTable columns={columns} size={3} />
      ) : (
        <div>
          <div className="mb-3 ml-2 bold">
            {`Tổng đơn hàng ${dataTable.length}`}{" "}
          </div>
          <StyledTable
            columns={columns}
            bordered
            pagination={false}
            dataSource={dataTable}
            scroll={{
              y: 600,
            }}
            footer={() => (
              <div className="flex justify-between">
                <div className="text-base">Tổng tiền</div>
                <div className="text-xl font-bold">{totalPrice}</div>{" "}
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}

export default Marketing;
const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const CustomButton = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px;
`;
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
  .ant-pagination {
    display: none !important;
  }
`;
