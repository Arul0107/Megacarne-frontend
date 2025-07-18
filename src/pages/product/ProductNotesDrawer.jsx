import React, { useState, useEffect } from 'react';
import {
  Drawer, Typography, Form, Input, Button, Spin
} from 'antd';
import { SendOutlined } from '@ant-design/icons';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import './NotesDrawer.css';

const { TextArea } = Input;
const { Title, Text } = Typography;

const ProductNotesDrawer = ({ visible, onClose, product, refreshProducts }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    setNotes(product?.notes || []);
  }, [product]);

  const getCurrentUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.email || 'Unknown';
    } catch {
      return 'Unknown';
    }
  };

  const handleAddNote = async (values) => {
    try {
      setLoading(true);
      const toastId = toast.loading('Adding note...');
      const newNote = {
        text: values.note,
        timestamp: new Date().toLocaleString(),
        author: getCurrentUser()
      };
      const updatedNotes = [...notes, newNote];
      await axios.put(`/api/product/${product._id}/notes`, { notes: updatedNotes });
      setNotes(updatedNotes);
      toast.success('Note added', { id: toastId });
      form.resetFields();
      refreshProducts();
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  const renderNotes = () => {
    if (!notes.length) return <Text type="secondary">No notes added yet</Text>;

    return notes.map((note, index) => {
      const previous = index > 0 ? notes[index - 1] : null;
      const currentDate = new Date(note.timestamp).toDateString();
      const previousDate = previous ? new Date(previous.timestamp).toDateString() : null;
      const showDate = currentDate !== previousDate;

      return (
        <div key={index}>
          {showDate && <div className="note-date-header">{currentDate}</div>}
          <div className="note-bubble">
            <div className="note-meta">
              {note.author} &nbsp;&nbsp; {note.timestamp}
            </div>
            <div className="note-text">{note.text}</div>
          </div>
        </div>
      );
    });
  };

  return (
    <Drawer
      title={<Title level={4} style={{ margin: 0 }}>Notes for Product: {product?.productName}</Title>}
      open={visible}
      onClose={onClose}
      width={440}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <div style={{ maxHeight: 460, overflowY: 'auto', marginBottom: 16 }}>
          {renderNotes()}
        </div>

        <Form form={form} layout="vertical" onFinish={handleAddNote}>
          <Form.Item name="note" rules={[{ required: true, message: 'Please enter a note' }]}>
            <TextArea rows={3} placeholder="Type your note here" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block icon={<SendOutlined />}>
            Add Note
          </Button>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default ProductNotesDrawer;
