import React from 'react';
import { Button, Col, Form, Input, Modal } from 'antd';
import styled from 'styled-components';
import { validateEmty } from '../../Common';


const AddProductDialog = ({ onSubmitForm, resetForm, formList, dialogAddProduct, setDialogAddProduct }) => {
    return (
        <Modal
            open={dialogAddProduct}
            title={"Thêm sản phẩm"}
            onCancel={() => {
                setDialogAddProduct(false)
               formList.resetFields()
            }}
            width={630}
            destroyOnClose
            footer={
                <div>
                    <Button type="primary" danger onClick={() => {
                setDialogAddProduct(false)
                formList.resetFields()
            }}>
                        Hủy
                    </Button>
                    <Button type="primary" onClick={() => formList.submit()}>Thêm mới</Button>
                </div>
            }
        >
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
        </Modal>
    );
};



export default AddProductDialog;
const CustomForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 5px;
  }
`;
