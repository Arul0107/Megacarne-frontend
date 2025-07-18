// QuotationList.jsx
import React, { useState } from "react";
import {
  Table,
  Button,
  Tooltip,
  Tag,
  Input,
  Space,
  Popconfirm,
  Typography,
  Modal,
  Descriptions,
  Divider,
  Dropdown,
  Menu,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PrinterOutlined,
  SearchOutlined,
  MessageOutlined,
  ScheduleOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import QuotationFollowUpDrawer from "./QuotationFollowUpDrawer";
import { downloadQuotationPdf } from "./quotationpdf.jsx";


const { Text } = Typography;

const QuotationList = ({
  quotations,
  onAddNew,
  onEdit,
  onDelete,
  onSearch,
  onViewNotes,
  loading,
  refreshQuotations,
}) => {
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [followUpDrawerVisible, setFollowUpDrawerVisible] = useState(false);

  const openViewModal = (record) => {
    setSelectedQuotation(record);
    setViewModalVisible(true);
    toast.success("Quotation details loaded.", {
      duration: 1500,
      position: "top-right",
    });
  };

  const handleShowFollowUpDrawer = (record) => {
    setSelectedQuotation(record);
    setFollowUpDrawerVisible(true);
  };

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return `₹${numAmount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getItemsTableColumns = () => [
    {
      title: "S.No",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Product Name", // New column for Product Name
      dataIndex: "productName",
      ellipsis: true,
      render: (text, record) => {
        // Log the item to inspect its properties
        console.log("Item in QuotationList:", record);
        return text || record.name || "N/A"; // Use productName or fallback to name
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
      render: (text, record) => {
        if (!text && record.specifications?.length > 0) {
          const mainSpec = record.specifications.find(
            (s) => s.name === "SPECIFICATION"
          );
          return mainSpec ? mainSpec.value : "N/A";
        }
        return text || "N/A";
      },
    },
    {
      title: "HSN/SAC",
      dataIndex: "hsnSac",
      width: 100,
      align: "center",
      render: (text) => text || "N/A",
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      width: 80,
      align: "center",
      render: (qty) => parseFloat(qty) || 0,
    },
    {
      title: "Unit Price (₹)",
      width: 140,
      align: "right",
      render: (_, item) => formatCurrency(item.rate || 0),
    },
    {
      title: "Total (₹)",
      width: 140,
      align: "right",
      render: (_, item) => (
        <Text strong style={{ color: "#52c41a" }}>
          {formatCurrency((item.quantity || 0) * (item.rate || 0))}
        </Text>
      ),
    },
  ];

  const columns = [
    {
      title: "Quotation #",
      dataIndex: "quotationNumber",
      render: (text) => <Tag color="blue">{text || "N/A"}</Tag>,
      sorter: (a, b) =>
        (a.quotationNumber || "").localeCompare(b.quotationNumber || ""),
    },
    {
      title: "Business",
      dataIndex: "businessName",
      sorter: (a, b) =>
        (a.businessName || "").localeCompare(b.businessName || ""),
    },
    {
      title: "Customer",
      dataIndex: "customerName", // Keep dataIndex for sorting/filtering consistency
      render: (text, record) => (
        <div>
          {/* Display contactName from populated businessId, fallback to customerName */}
          <div>{record.businessId?.contactName || text || "N/A"}</div>
          {/* Display email from populated businessId, fallback to customerEmail */}
          {(record.businessId?.email || record.customerEmail) && (
            <div style={{ fontSize: 12, color: "#666" }}>
              {record.businessId?.email || record.customerEmail}
            </div>
          )}
        </div>
      ),
      sorter: (a, b) =>
        (a.businessId?.contactName || a.customerName || "").localeCompare(
          b.businessId?.contactName || b.customerName || ""
        ),
    },
    // {
    //   title: "Status", // New Status Column
    //   dataIndex: "status",
    //   render: (status) => {
    //     let color = 'default';
    //     if (status === 'Approved') {
    //       color = 'green';
    //     } else if (status === 'Pending') {
    //       color = 'orange';
    //     } else if (status === 'Rejected') {
    //       color = 'red';
    //     } else if (status === 'Draft') {
    //       color = 'blue';
    //     }
    //     return <Tag color={color}>{status || 'N/A'}</Tag>;
    //   },
    //   sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
    // },
    {
      title: "Items Count",
      render: (_, record) => (
        <Tag color="geekblue">
          {record.items?.length || 0} item
          {(record.items?.length || 0) !== 1 ? "s" : ""}
        </Tag>
      ),
    },
    {
      title: "Latest Note",
      dataIndex: "notes",
      render: (notes) => {
        if (notes && notes.length > 0) {
          const latestNote = notes[notes.length - 1];
          const snippet =
            latestNote.text.length > 30
              ? `${latestNote.text.substring(0, 30)}...`
              : latestNote.text;
          return (
            <Tooltip title={latestNote.text}>
              <Text type="secondary">{snippet}</Text>
            </Tooltip>
          );
        }
        return (
          <Text type="secondary" italic>
            No notes
          </Text>
        );
      },
    },
    {
      title: "Total (₹)",
      dataIndex: "total",
      render: (amt, record) => {
        const totalAmount =
          parseFloat(amt) ||
          record.items?.reduce(
            (sum, item) => sum + (item.quantity || 0) * (item.rate || 0),
            0
          ) ||
          0;
        return (
          <Text strong style={{ color: "#52c41a" }}>
            {formatCurrency(totalAmount)}
          </Text>
        );
      },
      sorter: (a, b) => {
        const totalA = parseFloat(a.total) || 0;
        const totalB = parseFloat(b.total) || 0;
        return totalA - totalB;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (date) => {
        if (!date) return "N/A";
        try {
          return new Date(date).toLocaleDateString("en-IN");
        } catch {
          return date;
        }
      },
      sorter: (a, b) => {
        const dateA = new Date(a.date).getTime() || 0;
        const dateB = new Date(b.date).getTime() || 0;
        return dateA - dateB;
      },
    },
    {
      title: "Actions",
      width: 80,
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="view"
                icon={<EyeOutlined />}
                onClick={() => openViewModal(record)}
              >
                View Details
              </Menu.Item>
              <Menu.Item
                key="download"
                icon={<PrinterOutlined />}
                // Directly call the named export function
                onClick={() => downloadQuotationPdf(record)}
              >
                Download PDF
              </Menu.Item>
              <Menu.Item
                key="notes"
                icon={<MessageOutlined />}
                onClick={() => {
                  onViewNotes(record);
                  toast.success("Opening notes dialog...", { duration: 1500 });
                }}
              >
                View/Add Notes
              </Menu.Item>
              <Menu.Item
                key="followups"
                icon={<ScheduleOutlined />}
                onClick={() => handleShowFollowUpDrawer(record)}
              >
                Add/View Follow-ups
              </Menu.Item>
              <Menu.Item
                key="edit"
                icon={<EditOutlined />}
                onClick={() => {
                  onEdit(record);
                  toast.success("Initiating quotation edit...", {
                    duration: 1500,
                  });
                }}
              >
                Edit Quotation
              </Menu.Item>
              <Menu.Item>
                <Popconfirm
                  title="Are you sure you want to delete this account?"
                  onConfirm={() => onDelete(record._id)} // Using onDelete prop
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined />
                  Delete Quotation
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <Space
        style={{
          marginBottom: 16,
          justifyContent: "space-between",
          width: "10%",
        }}
      >
        <Input.Search
          placeholder="Search by quotation number, business, customer, or notes..."
          onChange={(e) => {
            onSearch(e.target.value);
          }}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
          allowClear
        />
       
      </Space>
<div className="table">
   <Button
          type="primary"
          onClick={() => {
            onAddNew();
            toast.success("Prepare to create a new quotation.", {
              duration: 1500,
            });
          }}
        >
          + New Quotation
        </Button>
</div>
      <Table
        columns={columns}
        dataSource={quotations}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} quotations`,
        }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={
          <div>
            <Text strong>Quotation Details</Text>
            {selectedQuotation && (
              <Tag color="blue" style={{ marginLeft: 8 }}>
                {selectedQuotation.quotationNumber}
              </Tag>
            )}
          </div>
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          // Use a regular button to call the named export function
          <Button
            key="download"
            icon={<PrinterOutlined />}
            onClick={() => downloadQuotationPdf(selectedQuotation)}
          >
            Download PDF
          </Button>,
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={1000}
      >
        {selectedQuotation && (
          <div id={`quotation-modal-preview-${selectedQuotation._id}`}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Quotation Number">
                <Tag color="blue">
                  {selectedQuotation.quotationNumber || "N/A"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Date">
                {selectedQuotation.date
                  ? new Date(selectedQuotation.date).toLocaleDateString("en-IN")
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Status"> {/* Added Status to Modal */}
                <Tag 
                  color={
                    selectedQuotation.status === 'Approved' ? 'green' : 
                    selectedQuotation.status === 'Pending' ? 'orange' : 
                    selectedQuotation.status === 'Rejected' ? 'red' :
                    'blue' // Default color for other statuses
                  } 
                  className="rounded-full px-3 py-1 text-sm font-medium">
                  {selectedQuotation.status || 'N/A'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Business Name">
                {selectedQuotation.businessName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Contact Person">
                {/* Updated to use contactName from populated businessId */}
                {selectedQuotation.businessId?.contactName || selectedQuotation.customerName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Email">
                {/* Updated to use email from populated businessId */}
                {selectedQuotation.businessId?.email || selectedQuotation.customerEmail || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Mobile Number">
                {/* Prioritize mobileNumber from quotation, then businessId's mobileNumber, then businessId's phone */}
                {selectedQuotation.mobileNumber || selectedQuotation.businessId?.mobileNumber || selectedQuotation.businessId?.phone || "N/A"}
              </Descriptions.Item>
              
              <Descriptions.Item label="GSTIN">
                <Text code>{selectedQuotation.gstin || "N/A"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Business Info" span={2}>
                <Text style={{ whiteSpace: "pre-wrap" }}>
                  {selectedQuotation.businessInfo || "N/A"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount" span={2}>
                <Text
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#52c41a",
                  }}
                >
                  {formatCurrency(
                    selectedQuotation.total ||
                      selectedQuotation.items?.reduce(
                        (sum, item) =>
                          sum + (item.quantity || 0) * (item.rate || 0),
                        0
                      ) ||
                      0
                  )}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            {selectedQuotation.items?.length > 0 && (
              <>
                <Divider orientation="left">
                  Items ({selectedQuotation.items.length})
                </Divider>
                <Table
                  dataSource={selectedQuotation.items}
                  columns={getItemsTableColumns()}
                  pagination={false}
                  size="small"
                  rowKey={(item, idx) => `${selectedQuotation._id}-item-${idx}`}
                  bordered
                  expandable={{
                    expandedRowRender: (item) => (
                      <div style={{ margin: 0, padding: 0 }}>
                        {item.specifications?.length > 0 && (
                          <Descriptions column={1} size="small">
                            {item.specifications
                              .filter((spec) => spec.name !== "SPECIFICATION")
                              .map((spec, i) => (
                                <Descriptions.Item key={i} label={spec.name}>
                                  {spec.value}
                                </Descriptions.Item>
                              ))}
                          </Descriptions>
                        )}
                      </div>
                    ),
                    rowExpandable: (item) => item.specifications?.length > 0,
                  }}
                  summary={(pageData) => {
                    const totalAmount = pageData.reduce(
                      (sum, item) =>
                        sum + (item.quantity || 0) * (item.rate || 0),
                      0
                    );
                    return (
                      <Table.Summary fixed>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0} colSpan={6}> {/* Adjusted colSpan */}
                            <Text strong>Grand Total:</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={6}> {/* Adjusted index */}
                            <Text strong style={{ color: "#52c41a" }}>
                              {formatCurrency(totalAmount)}
                            </Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    );
                  }}
                />
              </>
            )}

            {selectedQuotation.notes?.length > 0 && (
              <>
                <Divider orientation="left">
                  Notes ({selectedQuotation.notes.length})
                </Divider>
                {selectedQuotation.notes.map((note, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: 12,
                      padding: 8,
                      background: "#f5f5f5",
                      borderRadius: 4,
                    }}
                  >
                    <Text italic>"{note.text}"</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "0.8em" }}>
                      — {note.author} on{" "}
                      {note.timestamp ||
                        new Date(
                          selectedQuotation.createdAt
                        ).toLocaleDateString("en-IN")}
                    </Text>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Hidden elements for PDF generation are no longer needed here as content is generated dynamically in quotationpdf.js */}

      {selectedQuotation && (
        <QuotationFollowUpDrawer
          visible={followUpDrawerVisible}
          onClose={() => setFollowUpDrawerVisible(false)}
          quotation={selectedQuotation}
          refreshQuotations={refreshQuotations}
        />
      )}
    </>
  );
};

export default QuotationList;
