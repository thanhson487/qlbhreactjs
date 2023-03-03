import { Select } from "antd";
import React from "react";

// const { Option } = Select;
export default function CustomSelects({
  onChange,
  queryList,
  option,
  placeholder,
}) {
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
      showSearch
      optionFilterProp="lable"
      filterOption={(input, option) => {
        return (option?.value ?? "")
          .toLowerCase()
          .includes(input.toLowerCase());
      }}
    >
      {option.map((item) => (
        <Select.Option key={item.id} value={item.value}>
          {item.label}
        </Select.Option>
      ))}
    </Select>
  );
}
