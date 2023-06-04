import React, { useState } from "react";
import { Form, Input, Button, message, Card, Space, Timeline } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Space direction="vertical">
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
        <Card
          title="Package Status"
          style={{ marginTop: "24px", width: 500, alignItems: "center" }}
        >
          {data && (
            <Space align="center" size={"large"}>
              <Space direction="vertical" size="small">
                <p>Package ID: {data.packageId}</p>
                <p>Client: {data.userName}</p>
                <p>Status: {data.status}</p>
                <p>Pickup Point: {data.pickupPoint.name}</p>
                <p>PUP Availability: {data.pickupPoint.status}</p>
                {/* Render additional information based on the status */}
              </Space>

              {data.status === "DISPATCHED" && (
                <Timeline
                  items={[
                    {
                      dot: <CheckOutlined />,
                      children: "DISPATCHED",
                      color: "green",
                    },
                    {
                      dot: <CloseOutlined />,
                      children: "RECEIVED",
                      color: "red",
                    },
                    {
                      dot: <CloseOutlined />,
                      color: "red",
                      children: "PICKEDUP",
                    },
                  ]}
                />
              )}
              {data.status === "RECIEVED" && (
                <Timeline
                  items={[
                    {
                      dot: <CheckOutlined />,
                      children: "DISPATCHED",
                      color: "green",
                    },
                    {
                      dot: <CheckOutlined />,
                      children: "RECEIVED",
                      color: "green",
                    },
                    {
                      dot: <CloseOutlined />,
                      color: "red",
                      children: "PICKEDUP",
                    },
                  ]}
                />
              )}
              {data.status === "PICKEDUP" && (
                <Timeline
                  items={[
                    {
                      dot: <CheckOutlined />,
                      children: "DISPATCHED",
                      color: "green",
                    },
                    {
                      dot: <CheckOutlined />,
                      children: "RECEIVED",
                      color: "green",
                    },
                    {
                      dot: <CheckOutlined />,
                      color: "green",
                      children: "PICKEDUP",
                    },
                  ]}
                />
              )}
            </Space>
          )}
        </Card>
      </Space>
    </div>
  );
}

export default DeliveryStatus;
