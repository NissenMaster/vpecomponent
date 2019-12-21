import React, { PureComponent } from 'react';
import { Table } from 'antd';
import './TableComponent.css';

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: 'developer',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: 'loser',
  },
];

/**
 * TableComponent.js
 *
 * @author nissen
 * @version 2019.12.10
 * @description
 */
export default class TableComponent extends PureComponent {
  columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <span>
          <a>Delete</a>
        </span>
      ),
    },
  ];

  render() {
    const { size = "small" } = this.props;

    return (
      <Table
        size={size}
        columns={this.columns}
        dataSource={data}
        scroll={{ y: 80 }}
      />
    );
  }
}