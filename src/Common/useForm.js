import { Form } from "antd";
import dayjs from "dayjs";
import { forEach, isString } from "lodash";
import { useState, useEffect } from "react";

export default function useFormGroup() {
  const [formList] = Form.useForm();
  const [payload, setPayload] = useState();

  const onSubmitForm = () => {
    const formValues = formList.getFieldsValue();
    const date = formValues?.date
      ? dayjs(formValues.date).format("DD/MM/YYYY")
      : undefined;
    delete formValues.date;
    forEach(formValues, (value, key) => {
      if (isString(value)) {
        formValues[key] = value.trim();
      }
    });

    let tmpPayload;
    if (date) {
      tmpPayload = {
        ...formValues,
        date,
      };
    } else {
      tmpPayload = {
        ...formValues,
      };
    }

    setPayload(tmpPayload);
  };

  const resetForm = () => {
    formList.resetFields();
    formList.submit();
  };

  return {
    formList,
    onSubmitForm,
    resetForm,
    payload,
  };
}
