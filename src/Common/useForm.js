import { Form } from 'antd';
import dayjs from 'dayjs';
import { forEach, isString } from 'lodash';
import { useState, useEffect } from 'react';

export default function useFormGroup() {
  const [formList] = Form.useForm();
  const [payload, setPayload] = useState();


  const onSubmitForm = () => {
    const formValues = formList.getFieldsValue();
    const fromDate = formValues?.dateRange?.length > 0
      ? dayjs(formValues.dateRange[0]).format('YYYY-MM-DD')
      : undefined;
    const toDate = formValues?.dateRange?.length > 0
      ? dayjs(formValues.dateRange[1]).format('YYYY-MM-DD')
      : undefined;
    delete formValues.dateRange;
    forEach(formValues, (value, key) => {
      if (isString(value)) {
        formValues[key] = value.trim();
      }
    });

    let tmpPayload;
    if (fromDate) {
      tmpPayload = {
        ...formValues,
        fromDate,
        toDate,
      
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
