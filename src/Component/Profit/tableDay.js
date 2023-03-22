import { Table } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { get, getDatabase, ref } from "firebase/database";
import _, { forEach, isEmpty, reverse } from "lodash";
import { formatNumberNav, formatPriceRuleListAssets } from "../../Common";

function TableDay() {
  const today = dayjs();

  const startOfMonth = today.startOf("month");
  const diffInDays = today.diff(startOfMonth, "day");

  const columns = [
    {
      dataIndex: "day",
      title: "Ngày",
      align: "center",
    },
    {
      dataIndex: "totalMoneyDay",
      title: "Tổng tiền",
      render: (value) => {
        console.log(value, "ssss");
        return (
          <div style={{ textAlign: "right" }}>
            {formatPriceRuleListAssets(value)}
          </div>
        );
      },
      align: "center",
      sorter: (a, b) => {
        return a.totalMoneyDay - b.totalMoneyDay;
      },
    },
    {
      title: "doanh thu thực tế",
      dataIndex: "totalInterest",
      align: "center",
    },
    {
      dataIndex: "marketing",
      title: "Chi phí marketing",
      align: "center",
    },
  ];

  const [dataOrder, setDataOrder] = useState([]);
  const [db, setDb] = useState();
  useEffect(() => {
    const db = getDatabase();
    setDb(db);
  }, []);
  useEffect(() => {
    if (!db) return;
    fetchDataTable();
    // fetchDataProduct();
  }, [db]);

  const fetchDataTable = () => {
    // setLoading(true);
    const refers = ref(db, "order/");
    get(refers)
      .then((snapshot) => {
        const value = snapshot.val();
        if (value) {
          let data = [];
          for (const [key, value1] of Object.entries(value)) {
            let arr = {};
            arr = {
              id: key,
              ...value1,
              date: dayjs(
                dayjs(value1.date, "DD-MM-YYYY").format("YYYY-MM-DD")
              ).valueOf(),
            };
            data.push(arr);
          }
          setDataOrder([...data]);
        } else {
          setDataOrder([]);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {});
  };

  const [dataTableDay, setDataTableDay] = useState([]);
  const [dayToMonth, setDayToMonth] = useState([]);
  useEffect(() => {
    const data = [];
    for (let i = 0; i < diffInDays + 1; i++) {
      const diffDay = dayjs()
        .subtract(diffInDays - i, "day")
        .format("DD-MM-YYYY");
      data.push(diffDay);
      setDayToMonth(data);
    }
  }, []);
  const getValueDay = (dayCurrent) => {
    let totalMoneyDay = 0;
    let totalInterest = 0;
    const orderCurrent = dataOrder.filter(
      (item) =>
        item?.date ===
        dayjs(dayjs(dayCurrent, "DD-MM-YYYY").format("YYYY-MM-DD")).valueOf()
    );
    forEach(orderCurrent, (item) => {
      totalMoneyDay = totalMoneyDay + formatNumberNav(item.total);
    });
    return {
      totalInterest,
      totalMoneyDay,
    };
  };
  useEffect(() => {
    if (!dataOrder && isEmpty(dayToMonth)) return;
    let dataTable = [];
    forEach(dayToMonth, (day) => {
      const { totalInterest, totalMoneyDay } = getValueDay(day);
      dataTable.push({
        day,
        totalMoneyDay,
        totalInterest,
      });
    });

    setDataTableDay(reverse(dataTable));
  }, [dataOrder, dayToMonth]);

  return (
    <Table
      columns={columns}
      dataSource={dataTableDay}
      pagination={false}
      scroll={{ y: 700 }}
    />
  );
}

export default TableDay;
