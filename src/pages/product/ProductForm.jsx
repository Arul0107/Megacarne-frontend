import React, { useEffect } from 'react';
import {
  Drawer, Form, Input, Button, Space, Row, Col, DatePicker, Switch
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const ProductForm = ({ visible, onClose, onSave, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        stockLoadDate: initialValues.stockLoadDate ? dayjs(initialValues.stockLoadDate) : null,
        options: initialValues.options || []
      });
    } else {
      form.resetFields();
    }
  }, [visible, initialValues]);

  const handleSubmit = async (values) => {
    // Strip productId (if present from other systems) and _id to avoid backend conflicts.
    // product_id is now handled by the backend for new products, or present in initialValues for updates.
    const { product_id, productId, _id, ...rest } = values; // This line was previously stripping 'product_id'.
                                                        // Keep 'product_id' if you want to explicitly send it from the form,
                                                        // otherwise, remove it from here if the backend generates it.
                                                        // Based on prior resolution, 'product_id' should NOT be stripped
                                                        // if the backend generates it. If it's a form input, it should be kept here.
                                                        // The user's provided code still has `product_id` in destructuring.
                                                        // If backend generates, remove `product_id` from this line:
                                                        // const { productId, _id, ...rest } = values;

    const payload = {
      ...rest,
      price: Number(rest.price) || 0,
      quantity: Number(rest.quantity) || 0,
      // Removed inStock and outStock from payload based on previous context,
      // assuming these are not directly handled by the form now.
      // If they are still needed, uncomment them from the form and here.
      // inStock: Number(rest.inStock) || 0,
      // outStock: Number(rest.outStock) || 0,
      stockLoadDate: rest.stockLoadDate ? rest.stockLoadDate.toISOString() : null,
      isActive: rest.isActive || false,
      options: (rest.options || []).filter(opt => opt?.type?.trim() && opt?.description?.trim())
      // hsnSac is automatically included in 'rest' now as it's not destructured above
    };

    try {
      if (initialValues?._id) {
        await axios.put(`/api/product/${initialValues._id}`, payload);
        toast.success('Product updated');
      } else {
        // product_id will be generated on the backend, so no need to send it from here for new products.
        // If your schema requires it from frontend, add it back to payload.
        await axios.post('/api/product', payload);
        toast.success('Product added');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error('Failed to save product');
      console.error(err?.response?.data || err.message);
    }
  };

  return (
    <Drawer
      title={initialValues ? 'Edit Product' : 'Add Product'}
      open={visible}
      onClose={onClose}
      width={640}
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="productName"
              label="Product Name"
              rules={[{ required: true, message: 'Enter product name' }]}
            >
              <Input placeholder="Product name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="price"
              label="Price (INR)"
              rules={[{ required: true, message: 'Enter price' }]}
            >
              <Input type="number" placeholder="Price" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row for HSN/SAC Field */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="hsnSac" // The name of your field in the form data
              label="HSN/SAC"
              // You can add rules here if it's required or needs a specific format
              // rules={[{ required: true, message: 'Please enter HSN/SAC code' }]}
            >
              <Input placeholder="HSN/SAC Code" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="quantity" label="Quantity">
              <Input type="number" placeholder="Quantity" />
            </Form.Item>
          </Col>
        </Row>

        {/* The following two rows (inStock/outStock and stockLoadDate) were commented out in the user's provided code.
            If they are meant to be active fields, uncomment them. Otherwise, they remain commented. */}
        {/*
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="inStock" label="In Stock">
              <Input type="number" placeholder="In Stock" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="outStock" label="Out Stock">
              <Input type="number" placeholder="Out Stock" />
            </Form.Item>
          </Col>
        </Row>
        */}

        <Row gutter={16}>
          {/*
          <Col span={12}>
            <Form.Item name="stockLoadDate" label="Stock Load Date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          */}
          <Col span={12}>
            {/* You can add another field here if needed, or leave blank */}
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={2} placeholder="Description" />
        </Form.Item>

        <Form.List name="options">
          {(fields, { add, remove }) => (
            <>
              <label style={{ fontWeight: 600 }}>Product Options</label>
              {fields.map(({ key, name }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                  <Form.Item
                    name={[name, 'type']}
                    rules={[{ required: true, message: 'Enter type' }]}
                  >
                    <Input placeholder="Type" />
                  </Form.Item>
                  <Form.Item
                    name={[name, 'description']}
                    rules={[{ required: true, message: 'Enter description' }]}
                  >
                    <Input placeholder="Description" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button onClick={() => add()} icon={<PlusOutlined />}>
                  Add Option
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item name="isActive" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary"
           style={{ backgroundColor: '#ef7a1b', borderColor: '#orange', color: 'white' }}
          htmlType="submit" block>
            {initialValues ? 'Update' : 'Create'}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ProductForm;