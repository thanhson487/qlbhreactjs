import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Collapse,
} from "antd";
import dayjs from "dayjs";
import { get, ref } from "firebase/database";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { formatMoney, validateNumbers } from "../../Common";
import { optionChannel } from "../../Common/constant";
const { Panel } = Collapse;
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
      total: formatMoney(total.toString()),
    });
  };
  useEffect(() => {
    if (!isEditItem) return;
    const cloneItem = { ...itemProduct };
    
    formList.setFieldsValue({
      ...cloneItem,
      date: dayjs(cloneItem.date, "DD-MM-YYYY"),
    });
  }, [isEditItem,itemProduct]);
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
              Hủy
            </Button>
            <Button type="primary" onClick={() => formList.submit()}>
              {isEditItem ? "Sửa" : "Thêm mới"}
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
          wrapperCol={{ span: 24 }}
          style={{ width: 650 }}
          onFinish={onSubmitForm}
          autoComplete="off"
          layout="vertical"
          onFieldsChange={handleFieldChange}
          initialValues={{
            fee: "0",
            quantity: "1",
          }}
        >
          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            <Row gutter={[8, 8]}>
              <Col span={8}>
                <Form.Item
                  label="Mã Sản Phẩm"
                  name="idProduct"
                  rules={[
                    {
                      required: true,
                      message: "Chọn mã sản phẩm",
                    },
                  ]}
                  style={{ width: "100%", marginRight: 0 }}
                >
                  <Select
                    onChange={onChanges}
                    placeholder="Mã sản phẩm"
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
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Tên Sản phẩm"
                  name="productName"
                  rules={[
                    {
                      required: true,
                      message: "Chọn tên sản phẩm",
                    },
                  ]}
                  style={{ width: "100%", marginRight: 0 }}
                >
                  <Input disabled style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[8, 8]}>
              <Col span={8}>
                <Form.Item
                  label="Chọn ngày bán"
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: "Chọn ngày bán",
                    },
                  ]}
                  style={{ width: "100%", marginRight: 0 }}
                >
                  <DatePicker
                    format={dateFormatList}
                    placeholder={"Chọn ngày bán"}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Tên Khách Hàng"
                  name="customerName"
                  rules={[
                    {
                      required: true,
                      message: "Nhập tên khách hàng",
                    },
                  ]}
                  style={{ width: "100%", marginRight: 0 }}
                >
                  <Input allowClear />
                </Form.Item>
              </Col>
            </Row>
          </Space>
          <Row gutter={[8, 8]}>
            <Col span={8}>
              <Form.Item
                label="Giá bán"
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
            </Col>
            <Col span={8}>
              <Form.Item
                label="Phụ phí"
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
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col span={8}>
              <Form.Item
                label="Số lượng"
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
            </Col>
            <Col span={8}>
              <Form.Item
                label="Kênh bán"
                name="channel"
                rules={[
                  {
                    required: true,
                    message: "Chọn kênh bán",
                  },
                ]}
              >
                <Select
                  option={optionChannel}
                  placeholder="Kênh bán"
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
                    <Select.Option value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col span={16}>
              <Form.Item label="Tổng tiền" name="total">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Select
              placeholder="Trạng thái"
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
                  label: "Chờ thanh toán",
                },
                {
                  value: "sending",
                  label: "Đang gửi",
                },
                {
                  value: "success",
                  label: "Thành công",
                },
              ].map((item) => (
                <Select.Option value={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={[8, 8]}>
            <Col span={16}>
              <StyledCollapse >
                <StyledPanel header="Sản phẩm mua kèm" key="1">
                  <Row gutter={[8, 8]}>
                    <Col span={12}>
                      <Form.Item
                        label="Mã Sản Phẩm"
                        name="idProductDeal1"
                       
                        style={{ width: "100%", marginRight: 0 }}
                      >
                        <Select
                          onChange={onChanges}
                          placeholder="Mã sản phẩm"
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
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Số lượng"
                        name="quantityDeal1"
                       
                      >
                        <Input allowClear />
                      </Form.Item>
                    </Col>
                  </Row>
                   <Row gutter={[8, 8]}>
                    <Col span={12}>
                      <Form.Item
                        label="Mã Sản Phẩm"
                        name="idProductDeal2"
                    
                        style={{ width: "100%", marginRight: 0 }}
                      >
                        <Select
                          onChange={onChanges}
                          placeholder="Mã sản phẩm"
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
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Số lượng"
                        name="quantityDeal2"
                     
                      >
                        <Input allowClear />
                      </Form.Item>
                    </Col>
                  </Row>
                </StyledPanel>
              </StyledCollapse>
            </Col>
          </Row>
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
const StyledPanel = styled(Panel)`
  .ant-collapse-content {
    background: transparent;
  }
`;

const StyledCollapse = styled(Collapse)`
 
`;
