import { Table, Skeleton } from 'antd';

function ListingSkeletonTable({ columns, rowCount }) {
  return (
    <Table
      rowKey="key"
      scroll={{ x: 'max-content' }}
      sticky={{ offsetHeader: 48 }}
      pagination={false}
      dataSource={[...Array(rowCount)].map((_, index) => ({
        key: `key${index}`,
      }))}
      columns={columns.map((column) => ({
        ...column,
        render: function renderPlaceholder() {
          return (
            <Skeleton key={column.dataIndex} title paragraph={false} active />
          );
        },
      }))}
    />
  );
}

ListingSkeletonTable.defaultProps = {
  rowCount: 10,
};

export default ListingSkeletonTable;
