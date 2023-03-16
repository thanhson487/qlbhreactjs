import { Button, Col, Form, Input, Modal, Select, Typography } from "antd";
import React from "react";
import styled from "styled-components";
import { validateEmty } from "./../../Common";
const { Title } = Typography;
function DialogWarehouse({
  formList,
  onSubmitForm,
  payload,
  resetForm,
  open,
  setOpen,
  onChanges,
  optionSelectProduct,
}) {
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
              Thêm mới
            </Button>
          </div>
        }
        onCancel={() => {
          setOpen(false);
          formList.resetFields();
        }}
        destroyOnClose
        width={500}
      >
        <div>
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
        </div>
      </Modal>
    </div>
  );
}

export default DialogWarehouse;
const CustomTitle = styled.div`
  text-align: center;
`;
const CustomForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 5px;
  }
`;
