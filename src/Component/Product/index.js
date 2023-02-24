import { DeleteOutlined } from "@ant-design/icons";
import { Button, Table, Tooltip, Typography } from "antd";
import { getDatabase, onValue, ref, remove, set, get } from "firebase/database";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import useForm from "../../Common/useForm";
import { formatCurrency } from "./../../Common";
import AddProductDialog from "./AddProductDialog";
import ListingSkeletonTable from "../../Common/ListingSkeletonTable";
const { Title } = Typography;
function Product() {
  const [db, setDb] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    setDb(db);
  }, []);

  const [dialogAddProduct, setDialogAddProduct] = useState(false);
  const { formList, onSubmitForm, payload, resetForm } = useForm();

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
      render: (value) => {
        return (
          <div style={{ textAlign: "right" }}>{formatCurrency(value)}</div>
        );
      },
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (value) => {
        return (
          <div style={{ textAlign: "right" }}>{formatCurrency(value)}</div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record, index) => {
        return (
          <Tooltip title="Xóa">
            <Button
              shape="circle"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDeteleItem(record)}
            />
          </Tooltip>
        );
      },
    },
  ];
  const fetchData = () => {
    setLoading(true);
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
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!payload) return;
    const { id, price, productName, total } = payload;
    try {
      const refers = ref(db, "product/" + id);
      set(refers, {
        id,
        price,
        productName,
        total: total,
      });

      setDialogAddProduct(false);
      fetchData();
      formList.resetFields();
    } catch {}
  }, [payload]);

  useEffect(() => {
    if (!db) return;
    fetchData();
  }, [db]);

  const handleDeteleItem = (item) => {
    const refers = ref(db, "product/" + item.id);
    remove(refers)
      .then(() => {
        toast.success("Xóa thành công", {
          position: "top-right",
          autoClose: 2000,
          theme: "light",
        });
        fetchData();
      })
      .catch(() => {
        toast.error("Xóa thất bại. vui lòng thử lại", {
          position: "top-right",
          autoClose: 2000,
          theme: "light",
        });
      });
  };

  return (
    <div>
      <CustomTitle>
        <Title level={3}>Danh sách sản phẩm</Title>
      </CustomTitle>
      <WrapperGroup>
        <Button type="primary" onClick={() => setDialogAddProduct(true)}>
          Thêm sản phẩm
        </Button>
      </WrapperGroup>
      {loading ? (
        <ListingSkeletonTable columns={columns} size={3} />
      ) : (
        <StyledTable
          columns={columns}
          bordered
          pagination={false}
          dataSource={data}
        />
      )}

      <AddProductDialog
        formList={formList}
        onSubmitForm={onSubmitForm}
        payload={payload}
        resetForm={resetForm}
        dialogAddProduct={dialogAddProduct}
        setDialogAddProduct={setDialogAddProduct}
      />
    </div>
  );
}

export default Product;
const CustomTitle = styled.div`
  text-align: center;
`;
const WrapperGroup = styled.div`
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
