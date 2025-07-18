import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Layout,
  Tabs,
  Popconfirm,
  Tag,
  Tooltip,
  Drawer,
  Collapse,
  Descriptions,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import axios from "../../api/axios"; // Adjust path as needed
import toast from "react-hot-toast";
import ProductForm from "./ProductForm";
import NotesDrawer from "./ProductNotesDrawer";

const { Content, Header } = Layout;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const Product = () => {
  const [products, setProducts] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [notesVisible, setNotesVisible] = useState(false);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product");
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = () => {
    fetchProducts();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/product/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  // Fetch product details for viewing
  const fetchProductDetails = async (id) => {
    try {
      const { data } = await axios.get(`/api/product/${id}`);
      setViewingProduct(data);
    } catch (error) {
      toast.error("Failed to fetch product details");
    }
  };

  const activeProducts = products.filter((p) => p.isActive);
  const inactiveProducts = products.filter((p) => !p.isActive);

  const getColumns = () => [
    {
      title: "S.No",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    // {
    //   title: "Product ID",
    //   dataIndex: "product_id",
    //   width: 120,
    //   // Render function to format product_id as PRO001
    //   render: (id) => `PRO${String(id).padStart(3, '0')}`,
    // },
    {
      title: "Name",
      dataIndex: "productName",
      width: 160,
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      width: 80,
    },
    {
      title: "Price (₹)",
      dataIndex: "price",
      render: (val) => `₹${val?.toFixed(2)}`,
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (val) =>
        val ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
      width: 100,
    },
    {
      title: "Actions",
      width: 180,
      render: (_, record) => (
        <>
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => fetchProductDetails(record._id)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingProduct(record);
                setDrawerVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Notes">
            <Button
              type="text"
              icon={<MessageOutlined />}
              onClick={() => {
                setEditingProduct(record);
                setNotesVisible(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Confirm delete?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh",background: "#ffffffff" }}>
      <Header style={{ background: "white", padding: 0, marginBottom: 20 }}>
        <h2 style={{ margin: 0, padding: 20 }}>Product Management</h2>
      </Header>
      <Content style={{ padding: 20 }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Active Products" key="1">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingProduct(null);
                setDrawerVisible(true);
              }}
              style={{marginBottom: 16 , backgroundColor: '#ef7a1b', borderColor: '#orange', color: 'white' }}
            >
              Add Product
            </Button>
            <Table
              columns={getColumns()}
              dataSource={activeProducts}
              rowKey="_id"
              scroll={{ x: 1000 }}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane tab="Inactive Products" key="2">
            <Table
              columns={getColumns()}
              dataSource={inactiveProducts}
              rowKey="_id"
              scroll={{ x: 1000 }}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>

        {/* Product Form Drawer */}
        <ProductForm
          visible={drawerVisible}
          onClose={() => {
            setEditingProduct(null);
            setDrawerVisible(false);
          }}
          onSave={handleSave}
          initialValues={editingProduct}
        />

        {/* Product Details Drawer */}
        <Drawer
          open={!!viewingProduct}
          title="Product Details"
          width={820}
          onClose={() => setViewingProduct(null)}
        >
          {viewingProduct && (
            <>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Product ID">
                  {/* Applied formatting here as well for consistency */}
                  {`PRO${String(viewingProduct.product_id).padStart(3, '0')}`}
                </Descriptions.Item>
                <Descriptions.Item label="Name">
                  {viewingProduct.productName}
                </Descriptions.Item>
                <Descriptions.Item label="Price">
                  ₹{viewingProduct.price?.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="Qty">
                  {viewingProduct.quantity}
                </Descriptions.Item>
                <Descriptions.Item label="In Stock">
                  {viewingProduct.inStock}
                </Descriptions.Item>
                <Descriptions.Item label="Out Stock">
                  {viewingProduct.outStock}
                </Descriptions.Item>
                <Descriptions.Item label="Stock Load Date">
                  {viewingProduct.stockLoadDate &&
                    new Date(viewingProduct.stockLoadDate).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label="Description">
                  {viewingProduct.description || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  {viewingProduct.isActive ? (
                    <Tag color="green">Active</Tag>
                  ) : (
                    <Tag color="red">Inactive</Tag>
                  )}
                </Descriptions.Item>
              </Descriptions>

              <Collapse style={{ marginTop: 20 }}>
                <Panel header="Product Options" key="1">
                  {Array.isArray(viewingProduct.options) &&
                  viewingProduct.options.length > 0 ? (
                    viewingProduct.options.map((opt, idx) => (
                      <Descriptions
                        key={idx}
                        column={2}
                        size="small"
                        bordered
                        style={{ marginBottom: 16 }}
                      >
                        <Descriptions.Item label="Type">
                          {opt.type}
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">
                          {opt.description}
                        </Descriptions.Item>
                      </Descriptions>
                    ))
                  ) : (
                    <p>No product options available.</p>
                  )}
                </Panel>

                <Panel header="Product Notes" key="2">
                  {Array.isArray(viewingProduct.notes) &&
                  viewingProduct.notes.length > 0 ? (
                    viewingProduct.notes.map((note, idx) => (
                      <Descriptions
                        key={idx}
                        column={2}
                        size="small"
                        bordered
                        style={{ marginBottom: 16 }}
                      >
                        <Descriptions.Item label="Note" span={2}>
                          {note.text}
                        </Descriptions.Item>
                        <Descriptions.Item label="Author">
                          {note.author}
                        </Descriptions.Item>
                        <Descriptions.Item label="Time">
                          {new Date(note.timestamp).toLocaleString()}
                        </Descriptions.Item>
                      </Descriptions>
                    ))
                  ) : (
                    <p>No notes available.</p>
                  )}
                </Panel>
              </Collapse>
            </>
          )}
        </Drawer>

        {/* Notes Drawer */}
        {editingProduct && (
          <NotesDrawer
            visible={notesVisible}
            onClose={() => setNotesVisible(false)}
            product={editingProduct}
            refreshProducts={fetchProducts}
          />
        )}
      </Content>
    </Layout>
  );
};

export default Product;