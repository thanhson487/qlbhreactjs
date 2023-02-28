import { Select } from "antd";
import React from "react";

const { Option } = Select;
export default function Selects({ onChange, queryList, option, placeholder }) {

  const handleChange = (value) => {
    if (onChange) {
      onChange(value);
    }
    if (queryList) {
      queryList();
    }
  };

  return (
    <Select
      onChange={handleChange}
      placeholder={placeholder}
      allowClear
      optionFilterProp="lable"
      filterOption={(input, option) => {
        return (option?.value ?? "")
          .toLowerCase()
          .includes(input.toLowerCase());
      }}
      showSearch
    >
      {option.map(({ label, value }) => (
        <Option key={value} value={value}>
          {label}
        </Option>
      ))}
    </Select>
  );
}
