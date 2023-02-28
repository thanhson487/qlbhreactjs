import { Button, Form, Input, Modal, Select } from 'antd'
import styled from 'styled-components';
import React from 'react'

function AddOrder({ open, formList, onSubmitForm,setOpen }) {
 
  return (
    <div>
      <Modal
        title="Title"
        open={open}
        // onOk={handleOk}
        footer={
                <div>
                    <Button type="primary" danger onClick={() => {
                setOpen(false)
                formList.resetFields()
            }}>
                        Hủy
                    </Button>
                    <Button type="primary" onClick={() => formList.submit()}>Lưu</Button>
                </div>
            }
        // confirmLoading={confirmLoading}
        // onCancel={handleCancel}
      >
        <CustomForm
        form={formList}
          name="formList"
          // labelCol={{
          //   span: 8,
          // }}
          wrapperCol={{span: 16,}}
          style={{width:650,}}
          onFinish={onSubmitForm}
          
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout='vertical'
        >
          <Form.Item
          
            label="Mã Sản Phẩm"
            name="id"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>

          <Form.Item
            label="Tên Sản phẩm"
            name="productName"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            label="Tên Khách Hàng"
            name="customerName"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>
            <Form.Item
            label="Giá bán"
            name="price"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            label="Phụ phí"
            name="fee"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            label="Số lượng"
            name="total"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            label="Kênh bán"
            name="chanel"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
             <Select
                placeholder='Trạng thái'
                // defaultValue=""
                allowClear
                style={{
                  width: 430,
                }}
                // onChange={handleChange}
                options={[
                  {
                    value: 'waitting',
                    label: 'chờ thanh toán',
                  },
                  {
                    value: 'sending',
                    label: 'Đang gửi',
                  },
                  {
                    value: 'success',
                    label: 'Thành công',
                  },
                ]}
             />
          </Form.Item>
          <Form.Item
            label="Tổng tiền"
            name="total"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
        </CustomForm>
      </Modal>
    </div>
  )
}

export default AddOrder
const CustomForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 5px;
  }
`;
