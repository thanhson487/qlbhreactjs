import { Table } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { get, getDatabase, ref } from "firebase/database";
import _, { forEach, isEmpty, reverse } from "lodash";
import { formatNumberNav, formatPriceRuleListAssets } from "../../Common";
import { ExportOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
function TableDay() {
  const today = dayjs();

  const startOfMonth = today.startOf("month");
  const firstDayOfPrevMonth = startOfMonth.subtract(1, "month");
  const diffInDays = today.diff(firstDayOfPrevMonth, "day");

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
      render: (value) => {
        return (
          <div style={{ textAlign: "right" }}>
            {formatPriceRuleListAssets(value)}
          </div>
        );
      },
    },
    {
      dataIndex: "priceMarketing",
      title: "Chi phí marketing",
      align: "center",
      render: (value) => {
        return (
          <div style={{ textAlign: "right" }}>
            {formatPriceRuleListAssets(value)}
          </div>
        );
      },
    },
    {
      dataIndex: "profitAndLoss",
      title: "Lãi/Lỗ",
      align: "center",
      render: (value) => {
        if (value >= 0) {
          return (
            <div style={{ textAlign: "right", color: "rgb(0 169 0)", fontWeight: "600" }}>
              {formatPriceRuleListAssets(value)}
            </div>
          );
        }
        return (
          <div style={{ textAlign: "right", color: "#ff3737",fontWeight: "600"  }}>
            {formatPriceRuleListAssets(value)}
          </div>
        );
      },
    },
  ];

  const [dataOrder, setDataOrder] = useState([]);
  const [dataMarketing, setDataMarketing] = useState([]);
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
  const [loading, setLoading] = useState(false);
  const fetchDataTable = () => {
    setLoading(true);
    const refers = ref(db, "order/");
    const refersMar = ref(db, "marketing/");
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
          setLoading(false);
        } else {
          setDataOrder([]);
          setLoading(true);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {});

    get(refersMar)
      .then((snapshot) => {
        const value = snapshot.val();
        if (value) {
          let data = [];
          for (const [key, value1] of Object.entries(value)) {
            data.push(value1);
          }
          setDataMarketing([...data]);
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
      totalInterest = totalInterest + formatNumberNav(item?.interest);
    });
    return {
      totalInterest,
      totalMoneyDay,
    };
  };
  const getPriceMarketing = (day) => {
    let priceMar = 0;
    const priceCurrent = dataMarketing.filter(
      (item) =>
        item.dateCampaign ===
        dayjs(dayjs(day, "DD-MM-YYYY").format("YYYY-MM-DD")).valueOf()
    );
    forEach(priceCurrent, (item) => {
      priceMar = priceMar + formatNumberNav(item?.priceCampaign || 0);
    });
    return priceMar;
  };
  useEffect(() => {
    if (!dataOrder || isEmpty(dayToMonth) || isEmpty(dataMarketing)) return;

    let dataTable = [];
    forEach(dayToMonth, (day) => {
      const { totalInterest, totalMoneyDay } = getValueDay(day);
      const priceMarketing = getPriceMarketing(day);
      const profitAndLoss = totalInterest - priceMarketing;
      dataTable.push({
        day,
        totalMoneyDay,
        totalInterest,
        priceMarketing,
        profitAndLoss,
      });
    });

    setDataTableDay(reverse(dataTable));
  }, [dataOrder, dayToMonth, dataMarketing]);

  const headers = [
    { label: "Ngày", key: "day" },
    { label: "Tổng tiền", key: "totalMoneyDay" },
    {label:"Doanh thu thực tế",key: "totalInterest"},
     { label: "Chi phí marketting", key: "priceMarketing" },
    {
      label: "Lãi lỗ thực tế",
      key: "profitAndLoss",
    },
  ];

  return (
    <>
      <div class="text-base my-3">
    {dataTableDay&&  <CSVLink data={dataTableDay} headers={headers}>
          <ExportOutlined /> Xuất Excel
        </CSVLink>}   
      </div>
      <Table
        columns={columns}
        dataSource={dataTableDay}
        pagination={false}
        scroll={{ y: 700 }}
        size="middle"
        loading={loading}
      />
    </>
  );
}

export default TableDay;
