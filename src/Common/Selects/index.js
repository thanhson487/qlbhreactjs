import React from 'react';
import { Select } from 'antd';

const { Option } = Select;
export default function Selects({ onChange, queryList,option,placeholder }) {
 
  const handleChange = (value) => {
    if (onChange) {
      onChange(value);
    }
    if (queryList) {
      queryList();
    }
  };

  return (
    <Select onChange={handleChange} placeholder={placeholder} allowClear>
      { option.map(({ label, value }) => (
        <Option key={value} value={value}>
          {label}
        </Option>
      ))}
    </Select>
  );
}
