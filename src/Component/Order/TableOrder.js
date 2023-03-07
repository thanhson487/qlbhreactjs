import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Table, Modal, Typography, Tag } from "antd";
import AddOrder from "./AddOrder";
import useForm from "../../Common/useForm";
import { get, getDatabase, ref, remove, set, update } from "firebase/database";
import { nanoid } from "nanoid";
import {
  ClockCircleOutlined,
  RedoOutlined,
  CheckCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import FillterTable from "./FillterTable";
import ListingSkeletonTable from "../../Common/ListingSkeletonTable";
import dayjs from "dayjs";
import _, { filter, isEmpty } from "lodash";
import { toast } from "react-toastify";
import { formatNumberNav, formatPriceRuleListAssets } from "../../Common";
import useFormGroup from "../../Common/useForm";
function CreateOrder() {
  const { formList, onSubmitForm, resetForm, payload } = useForm();
  const {
    formList: formLists,
    onSubmitForm: onSubmitForms,
    resetForm: resetForms,
    payload: payloads,
  } = useFormGroup();
  const [open, setOpen] = useState(false);
  const [db, setDb] = useState();
  const [dataTable, setDataTable] = useState([]);
  const [dataNotEdit, setDataNotEdit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditItem, setIsEditItem] = useState(false);
  const [itemProduct, setItemProduct] = useState({});
  const [product, setProduct] = useState([]);
  const [dataFilter, setDataFilter] = useState({});
  useEffect(() => {
    const db = getDatabase();
    setDb(db);
  }, []);
  useEffect(() => {
    if (!db) return;
    fetchDataTable();
    fetchDataProduct();
  }, [db]);
  useEffect(() => {
    if (isEmpty(dataFilter.customerName) && isEmpty(dataFilter.status)) {
      setDataTable(dataNotEdit);
      return;
    }
    if (isEmpty(dataFilter.status) && !isEmpty(dataFilter.customerName)) {
      const filterData = filter(
        dataNotEdit,
        (item) =>
          item.customerName &&
          item.customerName
            .toLowerCase()
            .indexOf(dataFilter.customerName.toLowerCase()) > -1
      );
      setDataTable(filterData);
      return;
    }
    if (!isEmpty(dataFilter.status) && isEmpty(dataFilter.customerName)) {
      const filterData = filter(
        dataNotEdit,
        (item) => item.status && item.status === dataFilter.status
      );
      setDataTable(filterData);
    }
    if (!isEmpty(dataFilter.status) && !isEmpty(dataFilter.customerName)) {
      const filterData = filter(
        dataNotEdit,
        (item) => item.status && item.status === dataFilter.status
      );
      const filterDataname = filter(
        filterData,
        (item) =>
          item.customerName &&
          item.customerName
            .toLowerCase()
            .indexOf(dataFilter.customerName.toLowerCase()) > -1
      );
      setDataTable(filterDataname);
    }
  }, [dataFilter]);

  useEffect(() => {
    if (!payload) return;

    if (!isEditItem) {
      const id = nanoid();
      const refers = ref(db, "order/" + id);
      set(refers, {
        ...payload,
      })
        .then(() => {
          if (payload?.status === "success") {
            const { idProduct } = payload;
            const productData = product.filter(
              (item) => item.id === idProduct
            )[0];

            const productItemNew = {
              ...productData,
              total: parseInt(productData.total) - parseInt(payload.quantity),
            };

            const refersData = ref(db, "product/" + idProduct);
            update(refersData, { ...productItemNew }).then(() => {
              toast.success("Đã hoàn thành đơn hàng", {
                position: "top-center",
                autoClose: 2000,
                theme: "light",
              });
            });
          } else {
            toast.success("Tạo đơn hàng thành công", {
              position: "top-center",
              autoClose: 2000,
              theme: "light",
            });
          }

          formList.resetFields();
          setOpen(false);
        })
        .catch(() => {
          toast.error("Tạo thất bại thử lại", {
            position: "top-center",
            autoClose: 2000,
            theme: "light",
          });
        });
    } else {
      const id = itemProduct?.id;
      const refers = ref(db, "order/" + id);
      update(refers, {
        ...payload,
      }).then(() => {
        formList.resetFields();
        setItemProduct({});
        setIsEditItem(false);
        if (payload?.status === "success") {
          const { idProduct } = payload;
          const productData = product.filter(
            (item) => item.id === idProduct
          )[0];

          const productItemNew = {
            ...productData,
            total: parseInt(productData.total) - parseInt(payload.quantity),
          };

          const refersData = ref(db, "product/" + idProduct);
          update(refersData, { ...productItemNew }).then(() => {
            toast.success("Đã hoàn thành đơn hàng", {
              position: "top-center",
              autoClose: 2000,
              theme: "light",
            });
          });
        } else {
          toast.success("Sửa đơn hàng thành công", {
            position: "top-center",
            autoClose: 2000,
            theme: "light",
          });
        }
        setOpen(false);
        formList.resetFields();
      });
    }
    fetchDataTable();
  }, [payload]);

  const fetchDataProduct = () => {
    const refers = ref(db, "product/");
    get(refers)
      .then((snapshot) => {
        const value = snapshot.val();

        if (value) {
          const arrValue = Object.values(value);
          setProduct([...arrValue]);
          toast.success("Load sản phẩm thành công", {
            position: "top-center",
            autoClose: 2000,
            theme: "light",
          });
        } else {
          toast.error("Tải sản phẩm thất bại. Thử lại", {
            position: "top-center",
            autoClose: 2000,
            theme: "light",
          });
          setProduct([]);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
                dayjs(value1.date, "DD-MM-YYYY").format("YYYY-MM-DD")
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
              date: dayjs(item.date).format("DD-MM-YYYY"),
            }))
          );
          setDataTable([...data]);
          setDataNotEdit([...data]);
        } else {
          setDataTable([]);
          setDataNotEdit([]);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
        formLists.resetFields();
        setDataFilter({});
      });
  };
  const handleEditItem = (item) => {
    setOpen(true);
    setIsEditItem(true);
    setItemProduct(item);
  };

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
      render: (value) => {
        return (
          <div style={{ textAlign: "right" }}>
            {formatPriceRuleListAssets(formatNumberNav(value.toString()))}
          </div>
        );
      },
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

      render: (text, record) => {
        switch (record?.status) {
          case "waitting":
            return (
              <Tag icon={<ExclamationCircleOutlined />} color="warning">
                Chờ thanh toán
              </Tag>
            );
          case "sending":
            return (
              <Tag icon={<SyncOutlined spin />} color="processing">
                processing
              </Tag>
            );
          case "success":
            return (
              <Tag icon={<CheckCircleOutlined />} color="success">
                Đã hoàn thành
              </Tag>
            );
          default:
            return "-";
        }
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
            <EditOutlined
              className="mr-2"
              style={{ fontSize: "18px", color: "#08c" }}
              onClick={() => handleEditItem(record)}
            />
          )}
          <DeleteOutlined style={{ fontSize: "18px", color: "red" }} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <CustomButton>
        <Button type="primary" onClick={() => setOpen(true)}>
          Tạo đơn hàng
        </Button>
      </CustomButton>
      <FillterTable
        setDataFilter={setDataFilter}
        formList={formLists}
        onSubmitForm={onSubmitForms}
        payload={payloads}
      />
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
                 x: 1500,
              y: 650,
            }}
          />
        </div>
      )}
      <AddOrder
        open={open}
        formList={formList}
        onSubmitForm={onSubmitForm}
        resetForm={resetForm}
        setOpen={setOpen}
        db={db}
        isEditItem={isEditItem}
        setIsEditItem={setIsEditItem}
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
