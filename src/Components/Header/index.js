import { ShoppingCartOutlined } from "@ant-design/icons";
import {
  Button,
  Badge,
  Drawer,
  Menu,
  message,
  Table,
  Typography,
  Form,
  Input,
  Select,
} from "antd";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../CartContext";
import axios from "axios";

function AppHeader() {
  const navigate = useNavigate();

  const handleMenuClick = (key) => {
    // Handle menu item click based on the key
    if (key === "checkStatus") {
      navigate("/checkStatus");
    } else if (key === "buy") {
      navigate("/buy");
    }
  };

  const items = [
    {
      label: <div>Check Status</div>,
      key: "checkStatus",
    },
    {
      label: <div>Buy Toys</div>,
      key: "buy",
    },
  ];

  const menuItems = [{ key: "checkStatus", title: "Check Status" }];
  return (
    <div className="appHeader">
      <Menu
        className="appMenu"
        onClick={({ key }) => handleMenuClick(key)}
        mode="horizontal"
        items={items}
      />
        <Typography.Title>Store Play</Typography.Title>
        <AppCart />
      </div>
  );
}

function AppCart() {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutDrawerOpen, setCheckoutDrawerOpen] = useState(false);
  const { cart, clearCart } = useContext(CartContext);
  const [selectedOption, setSelectedOption] = useState(null);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [response, setResponse] = useState(null);

  const fetchData = () => {
    try {
      return axios
        .get("http://localhost:8000/api/v1/pickuppoints/")
        .then((response) => setPickupPoints(response.data));
    } catch {
      console.log("Deu pylance");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };

  const onConfirmOrder = (values) => {
    setCartDrawerOpen(false);
    setCheckoutDrawerOpen(false);
    const uniqueIds = cart.map((product) => product.id);
    const data = {
      clientName: values.name,
      clientEmail: values.email,
      storeId: 1,
      pickupPointId: selectedOption,
      packageItemsIds: uniqueIds,
    };

    try {
      axios
        .post("http://localhost:8000/api/v1/packages/add/", data)
        .then((res) => {
          console.log(res);
          setResponse(res.data);
          message.success(
            "Your order has been placed successfully. Your Package Number is " +
              res.data.deliveryId,
            10
          );
          clearCart();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const itemCounts = cart.reduce((acc, item) => {
    acc[item.id] = (acc[item.id] || 0) + 1;
    return acc;
  }, {});

  const uniqueItems = Array.from(new Set(cart.map((item) => item.id))).map(
    (itemId) => cart.find((item) => item.id === itemId)
  );

  return (
    <div>
      <Badge
        onClick={() => {
          setCartDrawerOpen(true);
        }}
        count={cart.length}
        className="soppingCartIcon"
      >
        <ShoppingCartOutlined />
      </Badge>
      <Drawer
        open={cartDrawerOpen}
        onClose={() => {
          setCartDrawerOpen(false);
        }}
        title="Your Cart"
        contentWrapperStyle={{ width: 500 }}
      >
        <Table
          pagination={false}
          columns={[
            {
              title: "Name",
              dataIndex: "name",
            },
            {
              title: "Price",
              dataIndex: "price",
              render: (value) => {
                return <span>{value}€</span>;
              },
            },
            {
              title: "Quantity",
              dataIndex: "quantity",
              render: (value, record) => {
                const itemCount = itemCounts[record.id] || 0;
                return <span>{itemCount}</span>;
              },
            },
            // Add more columns as needed
          ]}
          dataSource={uniqueItems}
          summary={(data) => {
            const total = data.reduce((pre, current) => {
              return (
                pre +
                parseFloat(current.price) * parseFloat(itemCounts[current.id])
              );
            }, 0);
            return <span>Total: {total.toFixed(2)}€</span>;
          }}
        />
        <Button
          onClick={() => {
            setCheckoutDrawerOpen(true);
          }}
          type="primary"
        >
          Checkout Your Cart
        </Button>
        {/* Rest of the code */}
      </Drawer>
      <Drawer
        open={checkoutDrawerOpen}
        onClose={() => {
          setCheckoutDrawerOpen(false);
        }}
        title="Confirm Order"
      >
        <Form onFinish={onConfirmOrder}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please enter your full name",
              },
            ]}
            label="Full Name"
            name="name"
          >
            <Input placeholder="Enter your full name.." />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
            label="Email"
            name="email"
          >
            <Input placeholder="Enter your email.." />
          </Form.Item>
          <Form.Item>
            <Select
              onChange={handleSelectChange}
              placeholder="Select a category"
            >
              {pickupPoints.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Confirm Order
          </Button>
        </Form>
      </Drawer>{" "}
    </div>
  );
}
export default AppHeader;
