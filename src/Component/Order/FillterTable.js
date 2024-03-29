import { Button, Col, Form, Input, Row, Select, Space } from "antd";
import React, { useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { isEmpty } from "lodash";

const FillterTable = ({setDataFilter,formList, onSubmitForm, resetForm, payload }) => {

  useEffect(() =>{
    if(isEmpty(payload)) return 
  setDataFilter(payload)
    
  },[payload])

  return (
    <Form form={formList} name="formList" onFinish={onSubmitForm}>
      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        <Row gutter={[8, 8]}>
          <Col span={5}>
            <Form.Item name="customerName">
              <Input placeholder="Tên khách hàng"  allowClear/>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="status">
              <Select
                placeholder="Trạng thái"
                allowClear
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
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              style={{ width: "7.5rem" }}
              htmlType="submit"
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Space>
    </Form>
  );
};

export default FillterTable;
