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

function DialogMarketing({ open, formList, onSubmitForm, setOpen, db }) {
  return (
    <div>
      <Modal
        title="Thêm chiến dịch"
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
      >
        <CustomForm
          form={formList}
          name="formList"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ width: 650 }}
          onFinish={onSubmitForm}
          autoComplete="off"
          layout="vertical"
          initialValues={{
            nameCampaign: "Quảng cáo shopee",
            priceCampaign: "100000",
          }}
        >
          <Form.Item
            label="Chọn ngày"
            name="date"
            rules={[
              {
                required: true,
                message: "Chọn ngày",
              },
            ]}
            style={{ width: "100%", marginRight: 0 }}
          >
            <DatePicker format={dateFormatList} placeholder={"Chọn ngày"} />
          </Form.Item>

          <Form.Item
            label="Tên chiến dịch"
            name="nameCampaign"
            rules={[
              {
                required: true,
                message: "Nhập tên chiến dịch",
              },
            ]}
            style={{ width: "100%", marginRight: 0 }}
          >
            <Input allowClear />
          </Form.Item>

          <Form.Item
            label="Chi phí"
            name="priceCampaign"
            rules={[
              {
                required: true,
                validator: (_, value) => validateNumbers(value),
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>
        </CustomForm>
      </Modal>
    </div>
  );
}

export default DialogMarketing;
const CustomForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 5px;
  }
`;
