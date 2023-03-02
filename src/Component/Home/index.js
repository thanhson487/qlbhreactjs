import { Card, Space, Col, Row, Select } from "antd";
import CustomSelects from "../../Common/Selects";
function Home() {
  const option = [
    {
      id: 2,
      value: 1,
      label: "Hôm nay",
    },
    {
      id: 2,
      value: 2,
      label: "1 Tuần",
    },
    {
      id: 3,
      value: 3,
      label: "1 Tháng",
    },
    {
      id: 4,
      value: 4,
      label: "1 Năm",
    },
    {
      id: 5,
      value: 5,
      label: "Tất cả",
    },
  ];
  const onChanges = () => {};
  return (
    <div>
      <h1 className="p-4">Tổng quan</h1>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="Doanh thu hôm nay" size="large">
            <p>Doanh thu</p>
            <p>650,000</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Đơn hàng chờ" size="large">
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Đơn hàng đang vận chuyển" size="large">
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className = "mt-5">
        <Col span={8}>
          <Card title="Doanh thu" size="large">
            <p>
              <CustomSelects
                option={option}
                onChange={onChanges}
                placeholder={"Thời gian"}
              />
            </p>
            <p>650,000</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Tổng đơn hàng" size="large">
            <p></p>
            <p>Card content</p>
          </Card>
        </Col>
      </Row>

     
    </div>
  );
}

export default Home;
