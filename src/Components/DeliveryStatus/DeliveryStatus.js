import React, { useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import axios from "axios";

function DeliveryStatus() {
  const [data, setData] = useState("");

  const onFinish = async (values) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/deliveries/delivery/${values.packageId}/`
      );
      setData(response.data);
      console.log(data);
    } catch (error) {
      message.error("Failed to fetch package status");
    }
  };

  return (
    <div>
      <h1>Delivery Status</h1>
      <Form name="deliveryStatusForm" onFinish={onFinish} layout="inline">
        <Form.Item
          name="packageId"
          rules={[{ required: true, message: "Please enter a package ID" }]}
        >
          <Input placeholder="Package ID" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Get Status
          </Button>
        </Form.Item>
      </Form>
      {data && (
        <Card title="Package Status" style={{ marginTop: "24px" }}>
          <p>Package ID: {data.packageId}</p>
          <p>Client: {data.userName}</p>
          <p>Status: {data.status}</p>
          <p>Pickup Point: {data.pickupPoint.name}</p>
          <p>PUP Availability: {data.pickupPoint.status}</p>
          {/* Render additional information based on the status */}
          {data.status === "DISPATCHED" && (
            <p>
              <span style={{color: "green"}}>DISPATCHED</span> <span style={{color: "red"}}>RECEIVED</span> <span style={{color : "red"}}>PICKEDUP</span>
            </p>
          )}
          {data.status === "RECIEVED" && (
            <p>
              <span style={{color: "red"}}>DISPATCHED</span> <span style={{color: "green"}}>RECEIVED</span> <span style={{color : "red"}}>PICKEDUP</span>
            </p>
          )}
          {data.status === "PICKEDUP" && (
            <p>
              <span style={{color: "red"}}>DISPATCHED</span> <span style={{color: "red"}}>RECEIVED</span> <span style={{color : "green"}}>PICKEDUP</span>
            </p>
          )}
        </Card>
      )}
    </div>
  );
}

export default DeliveryStatus;
