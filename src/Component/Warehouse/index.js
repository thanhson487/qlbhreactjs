import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Typography } from "antd";
import { get, getDatabase, ref, remove, set,update } from "firebase/database";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import useForm from "../../Common/useForm";
import { formatCurrency, validateEmty } from "./../../Common";
import Selects from "./../../Common/Selects";
const { Title } = Typography;
function Warehouse() {
  const [db, setDb] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [optionSelectProduct, setOptionSelectProduct] = useState([]);
  const { formList, onSubmitForm, payload, resetForm } = useForm();

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
       update(refers,{
        ...product,
        price: price.toFixed(2),
        total: total
       }).then(() =>{
         toast.success("Thêm thành công", {
          position: "top-right",
          autoClose: 2000,
          theme: "light",
        });
          formList.resetFields()
       })
  }, [payload]);

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
    if (!db) return;
    fetchData();
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
    const id = formList.getFieldValue("id")
    const product = data.filter((item) =>item.id ===id)[0]
    
    formList.setFieldsValue({
      productName: product.productName,
    });
  };

  return (
    <Wrapper>
      <div style={{ width: "500px" }}>
        <CustomTitle>
          <Title level={3}>Nhập kho sản phẩm</Title>
        </CustomTitle>
        <CustomForm
          form={formList}
          onFinish={onSubmitForm}
          name="formList"
          layout={"vertical"}
        >
          <Col>
            <Form.Item
              name="id"
              label="Mã sản phẩm"
              rules={[
                {
                  required: true,
                  validator: (_, value) => validateEmty(value),
                },
              ]}
            >
              <Selects option={optionSelectProduct} onChange={onChanges} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="productName"
              label="Tên sản phẩm"
              rules={[
                {
                  required: true,
                  validator: (_, value) => validateEmty(value),
                },
              ]}
            >
              <Input placeholder="Nhập tên sản phẩm" allowClear disabled />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="total"
              label="Số lượng"
              rules={[
                {
                  required: true,
                  validator: (_, value) => validateEmty(value),
                },
              ]}
            >
              <Input placeholder="Nhập số lượng" allowClear />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="price"
              label="Giá nhập"
              rules={[
                {
                  required: true,
                  validator: (_, value) => validateEmty(value),
                },
              ]}
            >
              <Input placeholder="Nhập giá nhập" allowClear />
            </Form.Item>
          </Col>
        </CustomForm>
        <div style={{ textAlign: "center" }}>
          <Button type="primary" onClick={() => formList.submit()}>
            Thêm sản phẩm
          </Button>
        </div>
      </div>
    </Wrapper>
  );
}

export default Warehouse;
const CustomTitle = styled.div`
  text-align: center;
`;
const CustomForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 5px;
  }
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;
