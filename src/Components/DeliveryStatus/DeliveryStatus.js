import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import axios from 'axios';

function DeliveryStatus() {
  const [status, setStatus] = useState('');

  const onFinish = async (values) => {
    try {
      const response = await axios.get(`/api/packages/${values.packageId}`);
      setStatus(response.data.status);
    } catch (error) {
      message.error('Failed to fetch package status');
    }
  };

  return (
    <div>
      <h1>Delivery Status</h1>
      <Form name="deliveryStatusForm" onFinish={onFinish} layout="inline">
        <Form.Item
          name="packageId"
          rules={[{ required: true, message: 'Please enter a package ID' }]}
        >
          <Input placeholder="Package ID" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Get Status
          </Button>
        </Form.Item>
      </Form>
      {status && (
        <Card title="Package Status" style={{ marginTop: '24px' }}>
          <p>Package ID: {status.packageId}</p>
          <p>Status: {status.status}</p>
          <p>Location: {status.location}</p>
          {/* Render additional information based on the status */}
          {status.status === 'DISPATCHED' && (
            <p>Package has been dispatched for delivery.</p>
          )}
          {status.status === 'RECEIVED' && (
            <p>Package has been received at the destination.</p>
          )}
          {status.status === 'PICKEDUP' && (
            <p>Package has been picked up by the recipient.</p>
          )}
        </Card>
      )}
    </div>
  );
}

export default DeliveryStatus;
