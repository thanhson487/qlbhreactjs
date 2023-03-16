import { Button, Table, Tag, Tooltip } from "antd";
import { get, getDatabase, ref, set, update } from "firebase/database";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import useForm from "../../Common/useForm";
import DialogWarehouse from "./DialogWarehouse";
import ListingSkeletonTable from "../../Common/ListingSkeletonTable";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { formatNumberNav, formatPriceRuleListAssets } from "../../Common";
import { nanoid } from "nanoid";

function Warehouse() {
  const [db, setDb] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [optionSelectProduct, setOptionSelectProduct] = useState([]);

  const { formList, onSubmitForm, payload, resetForm } = useForm();
  const [open, setOpen] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [totalPrice,setTotalPrice] = useState(0)

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

  useEffect(() => {
    const db = getDatabase();
    setDb(db);
  }, []);
  useEffect(() => {
    if (!payload) return;
    const product = data.filter((item) => item.id === payload.id)[0];
    const total = parseInt(payload.total) + product.total;
    const price =
      (parseInt(payload.total) * parseInt(payload.price) +
        product.total * product.price) /
      total;
    const refers = ref(db, "product/" + payload.id);
    update(refers, {
      ...product,
      price: price.toFixed(2),
      total: total,
    }).then(() => {
      toast.success("Thêm thành công", {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
      });
      formList.resetFields();
      const id = nanoid();
      const refersWareHouse = ref(db, "warehouse/" + id);
      set(refersWareHouse, {
        key: id,
        ...payload,
      }).then(() => {
        fetchDataTable();
      });
    });
  }, [payload]);

  const fetchData = () => {
    const refers = ref(db, "product/");
    get(refers)
      .then((snapshot) => {
        const value = snapshot.val();
        if (value) {
          const arrValue = Object.values(value);
          setData([...arrValue]);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {});
  };
  const fetchDataTable = () => {
    setOpen(false);
    setLoading(true);
    const refers = ref(db, "warehouse/");
    get(refers)
      .then((snapshot) => {
        const value = snapshot.val();
        if (value) {
          const arrValue = Object.values(value);
          let total = 0;
          arrValue.forEach(item =>{
            total = total + (parseInt(item.total) * parseInt(item.price))
          })
          setTotalPrice(formatPriceRuleListAssets(
            formatNumberNav(
             total.toString()
            )
          ))
          setDataTable(arrValue);
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
  console.log(dataTable);
  useEffect(() => {
    if (!db) return;
    fetchData();
    fetchDataTable();
  }, [db]);
  useEffect(() => {
    if (!data) return;
    const select = data?.map((item) => {
      return {
        id: item.id,
        value: item.id,
        label: item.id,
      };
    });
    setOptionSelectProduct(select);
  }, [data]);
  const onChanges = () => {
    const id = formList.getFieldValue("id");
    const product = data.filter((item) => item.id === id)[0];
    formList.setFieldsValue({
      productName: product.productName,
    });
  };
  console.log("optionSelectProduct", dataTable);

  return (
    <div>
      <Wrapper>
        <CustomButton>
          <Button type="primary" onClick={() => setOpen(true)}>
            Tạo đơn hàng
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
            footer={() => <div className = "flex justify-between"> <div className="text-base">Tổng tiền</div><div className="text-xl font-bold">{totalPrice}</div> </div>}
          />
        </div>
      )}
      <DialogWarehouse
        formList={formList}
        onSubmitForm={onSubmitForm}
        payload={payload}
        resetForm={resetForm}
        open={open}
        setOpen={setOpen}
        onChanges={onChanges}
        optionSelectProduct={optionSelectProduct}
      />
    </div>
  );
}

export default Warehouse;

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
