import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal, Select } from 'antd';
import styled from 'styled-components';
import { validateEmty } from '../../Common';
import { MinusCircleOutlined } from '@ant-design/icons';
import FormItem from '../../Common/FormItem';
import { convertStringToNumber, formatPointNumber } from '../../Common/common';
import useFormGroup from '../../Common/useForm';
import { ref, update } from 'firebase/database';
import { toast } from 'react-toastify';
const ImportProduct = ({
  dialogOrderDay,
  setDialogOrderDay,
  dataProduct,
  db,
  fetchData
}) => {
  const { formList, onSubmitForm, payload, resetForm } = useFormGroup();
  const [optionSelectProduct, setOptionSelectProduct] = useState([]);

  useEffect(() => {
    if (!dataProduct) return;
    const select = dataProduct?.map(item => {
      return {
        id: item.id,
        value: item.id,
        label: item.id
      };
    });
    setOptionSelectProduct(select);
  }, [dataProduct]);

  const onChanges = () => {
    const id = formList.getFieldValue('id');
    const product = dataProduct.filter(item => item.id === id)[0];
    const productTypes = product.productTypes.map(item => {
      return { ...item, quantity: 0 };
    });
    formList.setFieldsValue({ ...product, productTypes });
  };

  useEffect(() => {
    if (!payload) return;
    const product = dataProduct.filter(item => item.id === payload.id)[0];
    let productNew = {};
    const productTypes = product?.productTypes.map(item => {
      const valuePayloadTypes = payload?.productTypes.filter(
        data => data.typeName === item?.typeName
      );
      return {
        price: item?.price,
        typeName: item?.typeName,
        quantity: parseInt(item.quantity) + parseInt(valuePayloadTypes[0].quantity)
      };
    });
    productNew = { ...product, productTypes };
    const refers = ref(db, 'product/' + payload.id);
    update(refers, {
      ...productNew
    })
      .then(() => {
        toast.success('Cập nhật kho thành công', {
          position: 'top-right',
          autoClose: 2000,
          theme: 'light'
        });
        formList.resetFields();
        fetchData();
        setDialogOrderDay(false);
      })
      .finally(() => {});
  }, [payload]);
  return (
    <Modal
      open={dialogOrderDay}
      title={'Nhập thêm sản phẩm'}
      onCancel={() => {
        setDialogOrderDay(false);
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
              setDialogOrderDay(false);
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
            <Select
              onChange={onChanges}
              placeholder="Mã sản phẩm"
              allowClear
              showSearch
              optionFilterProp="lable"
              filterOption={(input, option) => {
                return (option?.value ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase());
              }}>
              {optionSelectProduct.map(item => (
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
                        <Input placeholder="Loại sản phẩm" allowClear disabled />
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
                        <Input placeholder="Giá tiền" allowClear disabled />
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

export default ImportProduct;
const CustomForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 5px;
  }
`;
