import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Table, Modal, Typography } from "antd";
import AddOrder from "./AddOrder";
import useForm from "../../Common/useForm";
import { get, getDatabase, ref, remove, set, update } from "firebase/database";
import { nanoid } from "nanoid";
import {
  ClockCircleOutlined,
  RedoOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import FillterTable from "./FillterTable";
import ListingSkeletonTable from "../../Common/ListingSkeletonTable";
import dayjs from "dayjs";
import _ from "lodash";
import { toast } from "react-toastify";
function CreateOrder() {
  const { formList, onSubmitForm, resetForm, payload } = useForm();
  const [open, setOpen] = useState(false);
  const [db, setDb] = useState();
  const [dataTable, setDataTable] = useState([]);
  const [dataNotEdit, setDataNotEdit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditItem, setIsEditItem] = useState(false);
  const [itemProduct, setItemProduct] = useState({});
  useEffect(() => {
    const db = getDatabase();
    setDb(db);
  }, []);
  useEffect(() => {
    if (!db) return;
    fetchDataTable();
  }, [db]);

  useEffect(() => {
    if (!payload) return;

    if (!isEditItem) {
      const id = nanoid();
      const refers = ref(db, "order/" + id);
      set(refers, {
        ...payload,
      }).then(() => {
        const { idProduct } = payload;
        const refersData = ref(db, "product/" + idProduct);
        get(refersData).then((productItem) => {
          const value = productItem.val();
          const productItemNew = {
            ...value,
            total: value.total - parseInt(payload.total),
          };
          update(refersData, { ...productItemNew }).then(() => {
            toast.success("Thêm đơn hàng thành công", {
              position: "top-right",
              autoClose: 2000,
              theme: "light",
            });
          });
        });

        setOpen(false);
        formList.resetFields();
      });
    } else {
      const id = itemProduct?.id;
      const refers = ref(db, "order/" + id);
      update(refers, {
        ...payload,
      }).then(() => {
        setOpen(false);
        formList.resetFields();
        setItemProduct({});
        setIsEditItem(false);
      });
    }

    fetchDataTable();
  }, [payload]);

  const fetchDataTable = () => {
    setLoading(true);
    const refers = ref(db, "order/");
    get(refers)
      .then((snapshot) => {
        const value = snapshot.val();

        if (value) {
          let data = [];
          for (const [key, value1] of Object.entries(value)) {
            let arr = {};
            arr = {
              id: key,
              ...value1,
              date: dayjs(
                dayjs(value1.date, "DD/MM/YYYY").format("YYYY-MM-DD")
              ).valueOf(),
            };
            data.push(arr);
          }

          data = _.reverse(
            _.sortBy(data, [
              function (o) {
                return o.date;
              },
            ]).map((item) => ({
              ...item,
              date: dayjs(item.date).format("DD/MM/YYYY"),
            }))
          );

          setDataTable([...data]);
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

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "idProduct",
      key: "idProduct",
      align: "center",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      align: "center",
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
    },

    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      key: "price",
      align: "center",
    },
    {
      title: "Phụ phí",
      dataIndex: "fee",
      key: "fee",
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      align: "center",
    },
    {
      title: "Kênh bán",
      dataIndex: "channel",
      key: "channel",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      // render: (text, record) => {
      //   switch (record?.status) {
      //     case "waitting":
      //       return (
      //         <ClockCircleOutlined
      //           onClick={() => {
      //             setOpen(true);
      //             setIsEditItem(true);
      //             setItemProduct(record);
      //           }}
      //         />
      //       );
      //     case "sending":
      //       return (
      //         <RedoOutlined
      //           onClick={() => {
      //             setOpen(true);
      //             setIsEditItem(true);
      //             setItemProduct(record);
      //           }}
      //         />
      //       );
      //     case "success":
      //       return <CheckCircleOutlined />;
      //     default:
      //       return (
      //         <div
      //           onClick={() => {
      //             console.log(1);
      //           }}
      //         >
      //           {record?.status}
      //         </div>
      //       );
      //   }
      // },
    },
  ];

  return (
    <div>
      <CustomButton>
        <Button type="primary" onClick={() => setOpen(true)}>
          Tạo đơn hàng
        </Button>
      </CustomButton>
      <FillterTable />
      {loading ? (
        <ListingSkeletonTable columns={columns} size={3} />
      ) : (
        <StyledTable
          columns={columns}
          bordered
          pagination={false}
          dataSource={dataTable}
        />
      )}
      <AddOrder
        open={open}
        formList={formList}
        onSubmitForm={onSubmitForm}
        resetForm={resetForm}
        setOpen={setOpen}
        db={db}
        isEditItem={isEditItem}
        itemProduct={itemProduct}
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
