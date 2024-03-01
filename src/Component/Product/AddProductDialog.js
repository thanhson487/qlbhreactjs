import React from 'react';
import { Button, Col, Form, Input, Modal, Space } from 'antd';
import styled from 'styled-components';
import { validateEmty } from '../../Common';
import { MinusCircleOutlined } from '@ant-design/icons';
import FormItem from '../../Common/FormItem';
import { convertStringToNumber, formatPointNumber } from '../../Common/common';

const AddProductDialog = ({
  onSubmitForm,
  resetForm,
  formList,
  dialogAddProduct,
  setDialogAddProduct
}) => {
  return (
    <Modal
      open={dialogAddProduct}
      title={'Thêm sản phẩm'}
      onCancel={() => {
        setDialogAddProduct(false);
        formList.resetFields();
      }}
      width={700}
      destroyOnClose
      footer={
        <div>
          <Button
            type="primary"
            danger
            onClick={() => {
              setDialogAddProduct(false);
              formList.resetFields();
            }}>
            Hủy
          </Button>
          <Button type="primary" onClick={() => formList.submit()}>
            Thêm mới
          </Button>
        </div>
      }>
      <CustomForm
        form={formList}
        onFinish={onSubmitForm}
        name="formList"
        layout={'vertical'}>
        <Col>
          <Form.Item
            name="id"
            label="Mã sản phẩm"
            rules={[
              {
                required: true,
                validator: (_, value) => validateEmty(value)
              }
            ]}>
            <Input placeholder="Nhập mã sản phẩm" allowClear />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="productName"
            label="Tên sản phẩm"
            rules={[
              {
                required: true,
                validator: (_, value) => validateEmty(value)
              }
            ]}>
            <Input placeholder="Nhập tên sản phẩm" allowClear />
          </Form.Item>
        </Col>
        <Form.Item label="Phân loại sản phẩm">
          <div style={{ paddingLeft: '10px' }}>
            <Form.List
              name="productTypes"
              initialValue={[
                {
                  typeName: '',
                  quantity: '',
                  price: 0
                }
              ]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2
                      }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'typeName']}
                        rules={[
                          {
                            required: true
                          }
                        ]}
                        label="Loại sản phẩm">
                        <Input placeholder="Loại sản phẩm" allowClear />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        rules={[
                          {
                            required: true
                          }
                        ]}
                        name={[name, 'quantity']}
                        label="Số lượng">
                        <Input placeholder="Số lượng" allowClear />
                      </Form.Item>
                      <FormItem
                        {...restField}
                        rules={[
                          {
                            required: true
                          }
                        ]}
                        name={[name, 'price']}
                        label="Giá tiền"
                        onValue={e => formatPointNumber(e)}
                        onValueChange={e => convertStringToNumber(e.target.value)}>
                        <Input placeholder="Giá tiền" allowClear />
                      </FormItem>
                      <div style={{ paddingTop: '20px' }}>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </div>
                    </div>
                  ))}
                  <Form.Item>
                    <Button onClick={() => add()}>Thêm loại sản phẩm</Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
        </Form.Item>
      </CustomForm>
    </Modal>
  );
};

export default AddProductDialog;
const CustomForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 5px;
  }
`;
