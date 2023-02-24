import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input,Typography } from 'antd';
import { get, getDatabase, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import useForm from "../../Common/useForm";
import { formatCurrency, validateEmty } from "./../../Common";
const { Title } = Typography;
function Warehouse() {
  const [db, setDb] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    setDb(db);
  }, []);

  const [dialogAddProduct, setDialogAddProduct] = useState(false);
  const { formList, onSubmitForm, payload, resetForm } = useForm();


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

 

  return (
    <div>
      <CustomTitle>
        <Title level={3}>Danh sách sản phẩm</Title>
      </CustomTitle>

      <CustomForm form={formList} onFinish={onSubmitForm} name="formList" layout={"vertical"}>
                <Col >
                    <Form.Item name="id" label="Mã sản phẩm"
                        rules={[
                            {
                                required: true,
                                validator: (_, value) => validateEmty(value),
                            },
                        ]}>
                        <Input placeholder="Nhập mã sản phẩm" allowClear />
                    </Form.Item>
                </Col>
                <Col >
                    <Form.Item name="productName" label="Tên sản phẩm"
                        rules={[
                            {
                                required: true,
                                validator: (_, value) => validateEmty(value),
                            },
                        ]}>
                        <Input placeholder="Nhập tên sản phẩm" allowClear />
                    </Form.Item>
                </Col>
                <Col >
                    <Form.Item name="total" label="Số lượng" rules={[
                        {
                            required: true,
                            validator: (_, value) => validateEmty(value),
                        },
                    ]}>
                        <Input placeholder="Nhập số lượng" allowClear />
                    </Form.Item>
                </Col>
                <Col >
                    <Form.Item name="price" label="Giá nhập" rules={[
                        {
                            required: true,
                            validator: (_, value) => validateEmty(value),
                        },
                    ]}>
                        <Input placeholder="Nhập giá nhập" allowClear />
                    </Form.Item>
                </Col>
            </CustomForm>
    </div>
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
