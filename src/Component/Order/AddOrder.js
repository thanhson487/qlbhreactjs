import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs from "dayjs";
import { get, ref } from "firebase/database";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  formatMoney,
  validateNumbers
} from "../../Common";
import { optionChannel } from "../../Common/constant";

const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

function AddOrder({
  open,
  formList,
  onSubmitForm,
  setOpen,
  db,
  isEditItem,
  itemProduct,
  setIsEditItem,
}) {
  const [data, setData] = useState([]);

  const [optionSelectProduct, setOptionSelectProduct] = useState([]);
  const fetchData = () => {
    const refers = ref(db, "product/");
    get(refers)
      .then((snapshot) => {
        const value1 = snapshot.val();

        if (value1) {
          const arrValue = Object.values(value1);
          const select = arrValue?.map((item) => {
            return {
              id: item.id,
              value: item.id,
              label: item.id,
            };
          });
          setData(arrValue);
          setOptionSelectProduct(select);
        } else {
          setOptionSelectProduct([]);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    if (!db) return;
    fetchData();
  }, [db]);

  const onChanges = (value) => {
    const id = formList.getFieldValue("idProduct");
    const product = data.filter((item) => item.id === id)[0];
    formList.setFieldsValue({
      productName: product.productName,
    });
  };
  const handleFieldChange = (changedFields) => {
    const price = formList.getFieldValue("price");
    const fee = formList.getFieldValue("fee");
    const quantity = formList.getFieldValue("quantity");

    if (isEmpty(price) || isEmpty(fee) || isEmpty(quantity)) {
      formList.setFieldsValue({
        total: null,
      });
      return;
    }

    const total = parseInt(price) * parseInt(quantity) - parseInt(fee);

    formList.setFieldsValue({
      total: formatMoney(total.toString())
    });
  };
  useEffect(() => {
    if (!isEditItem) return;
    const cloneItem = { ...itemProduct };
    formList.setFieldsValue({
      ...cloneItem,
      date: dayjs(cloneItem.date, "DD-MM-YYYY"),
    });
  }, [isEditItem]);
  return (
    <div>
      <Modal
        title="Title"
        open={open}
        footer={
          <div>
            <Button
              type="primary"
              danger
              onClick={() => {
                setOpen(false);
                formList.resetFields();
              }}
            >
              H???y
            </Button>
            <Button type="primary" onClick={() => formList.submit()}>
              {isEditItem ? "S???a" : "Th??m m???i"}
            </Button>
          </div>
        }
        onCancel={() => {
          setOpen(false);
          formList.resetFields();
          setIsEditItem(false);
        }}
        destroyOnClose
      >
        <CustomForm
          form={formList}
          name="formList"
          wrapperCol={{ span: 16 }}
          style={{ width: 650 }}
          onFinish={onSubmitForm}
          autoComplete="off"
          layout="vertical"
          onFieldsChange={handleFieldChange}
        >
          <Form.Item
            label="M?? S???n Ph???m"
            name="idProduct"
            rules={[
              {
                required: true,
                message: "Ch???n m?? s???n ph???m",
              },
            ]}
          >
            <Select
              onChange={onChanges}
              placeholder="M?? s???n ph???m"
              allowClear
              showSearch
              optionFilterProp="lable"
              filterOption={(input, option) => {
                return (option?.value ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase());
              }}
            >
              {optionSelectProduct.map((item) => (
                <Select.Option key={item.id} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="T??n S???n ph???m"
            name="productName"
            rules={[
              {
                required: true,
                message: "Ch???n t??n s???n ph???m",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Ch???n ng??y b??n"
            name="date"
            rules={[
              {
                required: true,
                message: "Ch???n ng??y b??n",
              },
            ]}
          >
            <DatePicker format={dateFormatList} placeholder={"Ch???n ng??y b??n"} />
          </Form.Item>
          <Form.Item
            label="T??n Kh??ch H??ng"
            name="customerName"
            rules={[
              {
                required: true,
                message: "Nh???p t??n kh??ch h??ng",
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            label="Gi?? b??n"
            name="price"
            rules={[
              {
                required: true,
                validator: (_, value) => validateNumbers(value),
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            label="Ph??? ph??"
            name="fee"
            rules={[
              {
                required: true,
                validator: (_, value) => validateNumbers(value),
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            label="S??? l?????ng"
            name="quantity"
            rules={[
              {
                required: true,
                validator: (_, value) => validateNumbers(value),
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item label="T???ng ti???n" name="total">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="K??nh b??n"
            name="channel"
            rules={[
              {
                required: true,
                message: "Ch???n k??nh b??n",
              },
            ]}
          >
            <Select
              option={optionChannel}
              placeholder="K??nh b??n"
              allowClear
              showSearch
              optionFilterProp="lable"
              filterOption={(input, option) => {
                return (option?.value ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase());
              }}
            >
              {optionChannel.map((item) => (
                <Select.Option value={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Tr???ng th??i"
            name="status"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Select
              placeholder="Tr???ng th??i"
              allowClear
              style={{
                width: 430,
              }}
              showSearch
              optionFilterProp="lable"
              filterOption={(input, option) => {
                return (option?.value ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase());
              }}
            >
              {[
                {
                  value: "waitting",
                  label: "Ch??? thanh to??n",
                },
                {
                  value: "sending",
                  label: "??ang g???i",
                },
                {
                  value: "success",
                  label: "Th??nh c??ng",
                },
              ].map((item) => (
                <Select.Option value={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </CustomForm>
      </Modal>
    </div>
  );
}

export default AddOrder;
const CustomForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 5px;
  }
`;
