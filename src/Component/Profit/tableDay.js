import { Table } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { get, getDatabase, ref } from "firebase/database";

function TableDay() {
  const today = dayjs();
  const [dataSource,setDataSource] = useState([])
const startOfMonth = today.startOf('month');
const diffInDays = today.diff(startOfMonth, 'day');
// const a=dayjs().subtract(diffInDays-index, 'day').format('DD-MM-YYYY')
//  dayjs().subtract(diffInDays-index, 'day').format('DD-MM-YYYY')
// console.log(diffInDays);
    const columns =[
        {
            dataIndex: 'day',
            title:'Ngày',
            render:(index)=>(
              (index<=diffInDays)?
           dayjs().subtract(diffInDays-index, 'day').format('DD-MM-YYYY')
           :null
            )

        },
        {   
            dataIndex:'',
            title:'Tổng tiền',
        },
        {
            title:'doanh thu thực tế',
        }
    ]
    // const data = [];
    const [dataTable, setDataTable] = useState([]);
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

          // data = _.reverse(
          //   _.sortBy(data, [
          //     function (o) {
          //       return o.date;
          //     },
          //   ]).map((item) => ({
          //     ...item,
          //     date: dayjs(item.date).format("DD-MM-YYYY"),
          //   }))
          // );
          setDataTable([...data]);
          // console.log(data);
          // setDataNotEdit([...data]);
        } else {
          setDataTable([]);
          // setDataNotEdit([]);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
      });
  };
  
  const [d,setD]=useState([])
  useEffect(()=>{
  const data=[]
  for (let i = 0; i < diffInDays+1; i++) {
   const diffDay= dayjs().subtract(diffInDays-i, 'day').format('DD-MM-YYYY');
  data.push({
    day: diffDay,
  });
  // console.log(data);
  setD([...data]);
}
// setDataSource(data)
},[])
// console.log(dataTable)
// const data
useEffect(()=>{
  if(!dataTable&&!d)return
const arr1=d.map((itemData)=>{
 const c=dataTable.filter((item)=>item?.date===dayjs(dayjs(itemData?.day,"DD-MM-YYYY").format('YYYY-MM-DD')).valueOf())
return c
})
// console.log(arr1);
let data=[]
for (const [key, value1] of Object.entries(arr1)) {
            let arr = {};
            arr = {
              id: Number(key)+1,
              ...value1,
              // date: dayjs(
              //   dayjs(value1.date, "DD-MM-YYYY").format("YYYY-MM-DD")
              // ).valueOf(),
            };
            data.push(arr);
          }
          console.log(data);
const filteredArr = arr1.filter(obj => Object.keys(obj).length !== 0);
 let total = 0;
          filteredArr.flat().forEach(item =>{
            // console.log(parseFloat((item.total).replace(',', '.')));
            total = total + parseFloat((item.total).replace(',', '.')) 
          })
          console.log(total);
},[d,dataTable]);


  return (
    <Table
    columns={columns}
    dataSource={dataSource}
    pagination={false}
    scroll={{ y: 700 }}
    />
  )
}

export default TableDay
