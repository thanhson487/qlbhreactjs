import { Button, Tabs } from "antd";
import dayjs from "dayjs";
import { get, getDatabase, ref, remove, set, update } from "firebase/database";
import _, { filter, isEmpty } from "lodash";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  default as useForm,
  default as useFormGroup,
} from "../../Common/useForm";
import AddOrder from "./AddOrder";
import FillterTable from "./FillterTable";
import ViewData from "./ViewData";

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
  const getPriceById = (item) => {
    const {
      idProduct,
      idProductDeal1,
      idProductDeal2,
      quantity,
      quantityDeal1,
      quantityDeal2,
    } = item;
    const data = [
      { id: idProduct, quantity: quantity },
      { id: idProductDeal1, quantity: quantityDeal1 },
      { id: idProductDeal2, quantity: quantityDeal2 },
    ];
    const filteredData = data.filter((item) => !isEmpty(item?.id));

    let total = 0;
    filteredData.forEach((item) => {
      const productData = product.filter((data) => data.id === item.id)[0];
      total = total + productData.price * parseInt(item.quantity);
    });
    return total;
  };
  const handleSync = (item) => {
    let costPrice = getPriceById(item);
    const interest = parseInt(item?.total) - costPrice;

    const id = item?.id;
    const refers = ref(db, "order/" + id);
    Object.keys(item).forEach(
      (key) => item[key] === undefined && delete payload[key]
    );
    update(refers, {
      ...item,
      interest,
    }).then(() => {
      formList.resetFields();
      setItemProduct({});
      setIsEditItem(false);
      toast.success("Sửa đơn hàng thành công", {
        position: "top-center",
        autoClose: 2000,
        theme: "light",
      });

      setOpen(false);
      formList.resetFields();
    });
    fetchDataTable();
  };

  useEffect(() => {
    if (!payload) return;
    let costPrice = getPriceById(payload);
    const interest = parseInt(payload?.total) - costPrice;
    if (!isEditItem) {
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );
      const id = nanoid();

      const refers = ref(db, "order/" + id);
      set(refers, {
        ...payload,
        interest,
      })
        .then(() => {
          const { idProduct, idProductDeal1, idProductDeal2 } = payload;
          if (!isEmpty(idProduct)) {
            const productData = product.filter(
              (item) => item.id === idProduct
            )[0];
            const productItemNew = {
              ...productData,
              total: parseInt(productData.total) - parseInt(payload.quantity),
            };

            const refersData = ref(db, "product/" + idProduct);
            update(refersData, { ...productItemNew }).then(() => {
              toast.success("Tạo đơn hàng thành công", {
                position: "top-center",
                autoClose: 2000,
                theme: "light",
              });
            });
          }

          if (!isEmpty(idProductDeal1)) {
            const refersDataDeal1 = ref(db, "product/" + idProductDeal1);
            const productDataDeal1 = product.filter(
              (item) => item.id === idProductDeal1
            )[0];
            const productItemNewDeal1 = {
              ...productDataDeal1,
              total:
                parseInt(productDataDeal1.total) -
                parseInt(payload.quantityDeal1),
            };
            update(refersDataDeal1, { ...productItemNewDeal1 }).then(() => {
              toast.success("Tạo đơn hàng thành công", {
                position: "top-center",
                autoClose: 1000,
                theme: "light",
              });
            });
          }
          if (!isEmpty(idProductDeal2)) {
            const refersDataDeal2 = ref(db, "product/" + idProductDeal2);
            const productData = product.filter(
              (item) => item.id === idProductDeal2
            )[0];
            const productItemNew = {
              ...productData,
              total:
                parseInt(productData.total) - parseInt(payload.quantityDeal2),
            };
            update(refersDataDeal2, { ...productItemNew }).then(() => {
              toast.success("Tạo đơn hàng thành công", {
                position: "top-center",
                autoClose: 1000,
                theme: "light",
              });
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
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );
      update(refers, {
        ...payload,
        interest,
      }).then(() => {
        formList.resetFields();
        setItemProduct({});
        setIsEditItem(false);
        toast.success("Sửa đơn hàng thành công", {
          position: "top-center",
          autoClose: 2000,
          theme: "light",
        });

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
  const handleDeteleItem = (item) => {
    const { id } = item;
    const refers = ref(db, "order/" + id);
    remove(refers)
      .then(() => {
        toast.success("Xóa thành công", {
          position: "top-right",
          autoClose: 2000,
          theme: "light",
        });
        fetchDataTable();
      })
      .catch(() => {
        toast.error("Xóa thất bại. vui lòng thử lại", {
          position: "top-right",
          autoClose: 2000,
          theme: "light",
        });
      });
  };

  const [activeTab, setActiveTab] = useState("Shopee");
  const handleChangeValueTab = (value) => {
    setActiveTab(value);
  };

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
      <Tabs
        type="card"
        size="large"
        destroyInactiveTabPane
        defaultActiveKey="SHOPEE"
        onChange={(activeKey) => handleChangeValueTab(activeKey)}
      >
        <Tabs.TabPane tab="Shopee" key="SHOPEE">
          <ViewData
            dataArr={dataTable.filter((item) => item.channel === "Shopee")}
            handleEditItem={handleEditItem}
            handleDeteleItem={handleDeteleItem}
            handleSync={handleSync}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Tiktok" key="TIKTOK">
          <ViewData
            dataArr={dataTable.filter((item) => item.channel === "Tiktok")}
            handleEditItem={handleEditItem}
            handleDeteleItem={handleDeteleItem}
            handleSync={handleSync}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Lazada" key="LAZADA">
          <ViewData
            dataArr={dataTable.filter((item) => item.channel === "Lazada")}
            handleEditItem={handleEditItem}
            handleDeteleItem={handleDeteleItem}
            handleSync={handleSync}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Orther" key="ORTHER">
          <ViewData
            dataArr={dataTable.filter((item) => item.channel === "Orther")}
            handleEditItem={handleEditItem}
            handleDeteleItem={handleDeteleItem}
            handleSync={handleSync}
          />
        </Tabs.TabPane>
      </Tabs>
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

const CustomButton = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px;
`;
