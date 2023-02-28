
import React, { useState } from 'react'
import styled from "styled-components";
import { Button, Table, Modal, Typography } from "antd";
import AddOrder from './AddOrder';
import useForm  from '../../Common/useForm';

function CreateOrder() {
   const {
     formList,
    onSubmitForm,
    resetForm,
    payload,
  }=useForm()
  console.log(payload);
     const [open, setOpen] = useState(true);
    const columns = [
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
      
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      
    },
  ];
  return (
    <div>
        <CustomButton> 
        <Button type="primary" onClick={()=>setOpen(!open)} >
          Tạo đơn hàng
        </Button>
        </CustomButton>
        <AddOrder open={open}  formList={ formList} onSubmitForm={onSubmitForm} resetForm={resetForm} setOpen={setOpen} />
      <StyledTable
          columns={columns}
          bordered
          pagination={false}
        //   dataSource={data}
        />
    </div>
  )
}

export default CreateOrder
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
const CustomButton = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px;
`;
