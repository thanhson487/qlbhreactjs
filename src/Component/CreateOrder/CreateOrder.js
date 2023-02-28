import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Table, Modal, Typography } from "antd";
import AddOrder from "./AddOrder";
import useForm from "../../Common/useForm";
import { get, getDatabase, ref, remove, set, update } from "firebase/database";
import { nanoid } from "nanoid";
function CreateOrder() {
  const { formList, onSubmitForm, resetForm, payload } = useForm();

  const [open, setOpen] = useState(false);
  const [db, setDb] = useState();
  const [dataTable,setDataTable] = useState([])
  const [loading,setLoading]= useState(false)
  useEffect(() => {
    const db = getDatabase();
    setDb(db);
  }, []);

  useEffect(() => {
    if (!payload) return;
    const id = nanoid();
    const refers = ref(db, "order/" + id);
    set(refers, {
      ...payload,
    }).then(() => {
      setOpen(false);
      formList.resetFields();
    });

    fetchDataTable();
  }, [payload]);
  const fetchDataTable = () => {

  setLoading(true);
    const refers = ref(db, "order/");
    get(refers)
      .then((snapshot) => {
        const value = snapshot.val();
        if (value) {
          const arrValue = Object.values(value);

          setDataTable([...arrValue]);
        } else {
          setDataTable([]);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });

  };



 useEffect(() => {
    if (!db) return;
    fetchDataTable();
  }, [db]);
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
        <Button type="primary" onClick={() => setOpen(!open)}>
          Tạo đơn hàng
        </Button>
      </CustomButton>
      <AddOrder
        open={open}
        formList={formList}
        onSubmitForm={onSubmitForm}
        resetForm={resetForm}
        setOpen={setOpen}
        db={db}
      />
      <StyledTable
        columns={columns}
        bordered
        pagination={false}
          dataSource={dataTable}
      />
    </div>
  );
}

export default CreateOrder;
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
