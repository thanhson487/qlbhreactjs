import { Form } from 'antd';
import React from 'react';

const FormItemCustom = ({
  children,
  onChange: onChangeFormItem,
  onValueChange,
  onValue,
  value,
  ...props
}) => {
  const onChange = (...arg) => {
    const valueFormat = onValueChange?.(...arg) || arg?.[0];
    onChangeFormItem?.(valueFormat);
  };
  const valueChange = onValue?.(value) || value;
  return React.cloneElement(children, {
    onChange,
    value: valueChange,
    ...props,
  });
};

export default function FormItem({ children, ...props }) {
  return (
    <Form.Item {...props}>
      <FormItemCustom
        onValueChange={props?.onValueChange}
        onValue={props?.onValue}
      >
        {children}
      </FormItemCustom>
    </Form.Item>
  );
}
