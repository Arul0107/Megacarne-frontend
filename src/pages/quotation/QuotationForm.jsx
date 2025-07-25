import {
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
  Divider,
  Space,
  theme,
  Tooltip,
} from "antd";
import {
  SaveOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "../../api/axios"; // Assuming this path is correct for your project
import dayjs from "dayjs"; // For date formatting
import toast from "react-hot-toast"; // For notifications
import { generateQuotationFormStyles } from "./QuotationFormStyles"; // Assuming this path is correct for your project
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

// Destructure Ant Design components and hooks
const { Option } = Select;
const { TextArea } = Input;
const { useToken } = theme;

/**
 * QuotationForm Component
 * A form for creating and editing sales quotations.
 * Allows selecting businesses and products, adding/removing items with specifications,
 * setting per-item GST percentages, and overriding total GST manually.
 *
 * @param {object} props - Component props
 * @param {function} props.onCancel - Callback function when the form is cancelled
 * @param {function} props.onSave - Callback function when the form is submitted (saves quotation data)
 * @param {object} [props.initialValues] - Initial data to pre-fill the form for editing
 * @param {boolean} props.isSaving - Boolean to indicate if the form is currently in a saving state
 */
const QuotationForm = ({ onCancel, onSave, initialValues, isSaving }) => {
  const [form] = Form.useForm(); // Ant Design form instance
  const [businessOptions, setBusinessOptions] = useState([]); // State for business dropdown options
  const [productOptions, setProductOptions] = useState([]); // State for product dropdown options
  const [items, setItems] = useState([]); // State for quotation line items
  const [notes, setNotes] = useState([]); // State for quotation notes
  const [gstType, setGstType] = useState(null); // State for selected GST type (intrastate/interstate)
  // For frontend display only, backend will calculate based on percentages
  const [manualGstAmount, setManualGstAmount] = useState(null);
  const [manualSgstPercentage, setManualSgstPercentage] = useState(null);
  const [manualCgstPercentage, setManualCgstPercentage] = useState(null);
  const [manualIgstPercentage, setManualIgstPercentage] = useState(null); // Add this line
  const [selectedBusinessDetails, setSelectedBusinessDetails] = useState(null); // Details of the selected business
  const [status, setStatus] = useState('Draft'); // State for quotation status, default to 'Draft'
  const { token } = useToken(); // Ant Design token for theme variables (e.g., spacing, colors)
  const styles = generateQuotationFormStyles(token); // Custom styles generated using theme tokens

  // State for pipeline and customer details
  const [pipelineOptions, setPipelineOptions] = useState([]);
  const [customerDetailsOptions, setCustomerDetailsOptions] = useState([]);

  // Refs to prevent duplicate API calls on re-renders
  const hasFetchedBusinessOptions = useRef(false);
  const hasFetchedProductOptions = useRef(false);
  const hasFetchedPipelineOptions = useRef(false);
  const hasFetchedCustomerDetailsOptions = useRef(false);

  /**
   * Formats business details into a multi-line string for display.
   * @param {object} business - The business object
   * @returns {string} Formatted business information
   */
  const formatBusinessInfo = useCallback((business) => {
    if (!business) return "";
    return `
${business.businessName?.toUpperCase()}
${business.contactName ? `Mr. ${business.contactName?.toUpperCase()}` : ""}
${business.addressLine1 || ""}${business.addressLine2 ? ", " + business.addressLine2 : ""
      }
${business.city || ""}${business.pincode ? " - " + business.pincode : ""}
${business.state || ""}, ${business.country || ""}
${business.gstNumber || ""}
${business.email || ""}`.trim();
  }, []);

  /**
   * Fetches all business accounts (leads + customers) from the API to populate the business dropdown.
   * CHANGED: Now fetches from /api/accounts/ to get all businesses.
   */
  const fetchBusinessOptions = useCallback(async () => {
    if (hasFetchedBusinessOptions.current) return; // Prevent re-fetching
    hasFetchedBusinessOptions.current = true;
    const toastId = toast.loading("Loading business options...");
    try {
      const res = await axios.get("/api/accounts/"); // ✅ CHANGED: Fetch from /api/accounts/
      setBusinessOptions(res.data);
      toast.success("Business options loaded", { id: toastId });
    } catch (error) {
      toast.error("Failed to load businesses", { id: toastId });
      console.error("Error fetching business options:", error);
      hasFetchedBusinessOptions.current = false; // Allow re-fetching on error
    }
  }, []);

  /**
   * Fetches product data from the API to populate the product dropdown.
   */
  const fetchProductOptions = useCallback(async () => {
    if (hasFetchedProductOptions.current) return; // Prevent re-fetching
    hasFetchedProductOptions.current = true;
    const toastId = toast.loading("Loading product options...");
    try {
      const res = await axios.get("/api/product");
      setProductOptions(
        res.data.map((p) => ({
          ...p,
          productName: p.productName || p.name || "",
          hsnSac: p.hsnSac || "",
          quantityType: p.quantityType || "",
          options: p.options || [],
          // Default GST percentage for products if not explicitly defined
          gstPercentage: p.gstPercentage !== undefined ? p.gstPercentage : 18,
        }))
      );
      toast.success("Product options loaded", { id: toastId });
    } catch (error) {
      toast.error("Failed to load products", { id: toastId });
      console.error("Error fetching product options:", error);
      hasFetchedProductOptions.current = false; // Allow re-fetching on error
    }
  }, []);

  /**
   * Fetches pipeline data from the API.
   * This now expects the backend route /api/quotations/pipeline
   */
  const fetchPipelineOptions = useCallback(async () => {
    if (hasFetchedPipelineOptions.current) return; // Prevent re-fetching
    hasFetchedPipelineOptions.current = true;
    const toastId = toast.loading("Loading pipeline data...");
    try {
      const res = await axios.get("/api/quotations/pipeline");
      setPipelineOptions(res.data);
      toast.success("Pipeline data loaded", { id: toastId });
    } catch (error) {
      toast.error("Failed to load pipeline data", { id: toastId });
      console.error("Error fetching pipeline options:", error);
      hasFetchedPipelineOptions.current = false; // Allow re-fetching on error
    }
  }, []);

  /**
   * Fetches customer details from the API.
   * This now expects the backend route /api/accounts/customers
   */
  const fetchCustomerDetailsOptions = useCallback(async () => {
    if (hasFetchedCustomerDetailsOptions.current) return; // Prevent re-fetching
    hasFetchedCustomerDetailsOptions.current = true;
    const toastId = toast.loading("Loading customer details...");
    try {
      // Updated endpoint to match backend routing for business accounts
      const res = await axios.get("/api/accounts/customers");
      setCustomerDetailsOptions(res.data);
      toast.success("Customer details loaded", { id: toastId });
    } catch (error) {
      toast.error("Failed to load customer details", { id: toastId });
      console.error("Error fetching customer details:", error);
      hasFetchedCustomerDetailsOptions.current = false; // Allow re-fetching on error
    }
  }, []);

  /**
   * useEffect hook to fetch initial data and set form values when the component mounts
   * or when initialValues change.
   */
  useEffect(() => {
    fetchBusinessOptions();
    fetchProductOptions();
    // Call the new fetch functions
    fetchPipelineOptions();
    fetchCustomerDetailsOptions();

    if (initialValues) {
      // Set form fields with initial values, converting date strings to Dayjs objects
      form.setFieldsValue({
        ...initialValues,
        date: initialValues.date ? dayjs(initialValues.date) : null,
        validUntil: initialValues.validUntil
          ? dayjs(initialValues.validUntil)
          : null,
        noteText: "", // New notes start blank
        customerName: initialValues.customerName || "",
        customerEmail: initialValues.customerEmail || "",
        status: initialValues.status || 'Draft', // Set status from initialValues
      });

      // Map initial items to ensure unique IDs and proper structure for specifications
      const mappedInitialItems = (initialValues.items || []).map((item) => ({
        ...item,
        id: item.id || uuidv4(), // Ensure item has a unique ID
        productName: item.productName || "",
        // Ensure gstPercentage is set for existing items, default to 18 if not present
        gstPercentage:
          item.gstPercentage !== undefined ? item.gstPercentage : 18,
        specifications: (item.specifications || []).map((spec) => ({
          ...spec,
          key: spec.key || uuidv4(), // Ensure each specification has a unique key
        })),
      }));

      setItems(mappedInitialItems); // Set the form's items state
      setNotes(initialValues.notes || []); // Set existing notes
      setGstType(initialValues.gstType || null); // Set initial GST type
      // Set manual GST values for display purposes only
      setManualGstAmount(initialValues.gstDetails?.manualGstAmount || null);
      setManualSgstPercentage(initialValues.gstDetails?.manualSgstPercentage || null);
      setManualCgstPercentage(initialValues.gstDetails?.manualCgstPercentage || null);
      setManualIgstPercentage(initialValues.gstDetails?.manualIgstPercentage || null); // Add this line
      setStatus(initialValues.status || 'Draft'); // Set status state

      // If a business was pre-selected, find its details and update related form fields
      // Get the business ID, handling both string ID and populated object cases
      const initialBusinessId = initialValues.businessId?._id || initialValues.businessId;

      if (initialBusinessId && businessOptions.length > 0) {
        const preSelected = businessOptions.find(
          (b) => b._id === initialBusinessId
        );
        if (preSelected) {
          setSelectedBusinessDetails(preSelected);
          form.setFieldsValue({
            businessId: preSelected._id, // Set the actual ID for the form field
            businessName: preSelected.businessName,
            businessType: preSelected.type,
            gstin: preSelected.gstNumber,
            businessInfo: formatBusinessInfo(preSelected),
          });
        }
      }
    }
  }, [
    initialValues,
    fetchBusinessOptions,
    fetchProductOptions,
    // Add new fetch functions to dependencies
    fetchPipelineOptions,
    fetchCustomerDetailsOptions,
    form,
    formatBusinessInfo,
    businessOptions, // Dependency to re-run if businessOptions change after initial load
  ]);

  /**
   * Handles the form submission. Performs validation and prepares the quotation object.
   * @param {object} values - Form field values
   */
  const onFinish = async (values) => {
    // Basic validation checks
    if (!items || items.length === 0) {
      toast.error("At least one item is required.");
      return;
    }
    if (!gstType) {
      toast.error("Please select a GST type.");
      return;
    }

    // Validate specifications: ensure all name and value fields are filled
    for (const item of items) {
      if (item.specifications && item.specifications.length > 0) {
        for (const spec of item.specifications) {
          if (spec.name.trim() || spec.value.trim()) {
            toast.error(
              "All specification name and value fields must be filled for all items."
            );
            return;
          }
        }
      }
    }

    const timestamp = new Date().toLocaleString();
    const newNote = values.noteText
      ? { text: values.noteText, timestamp }
      : null;

    // Construct the quotation object to be saved
    const quotation = {
      ...values,
      date: values.date?.format("YYYY-MM-DD"), // Format date for backend
      validUntil: values.validUntil?.format("YYYY-MM-DD"), // Format date for backend
      items, // Include the current items array (with productName and gstPercentage)
      notes: newNote ? [...notes, newNote] : notes, // Add new note to existing ones
      gstType: gstType,
      status: status, // Include the status
      // Send manual GST percentages to backend for calculation
      manualGstAmount: manualGstAmount,
      manualSgstPercentage: manualSgstPercentage,
      manualCgstPercentage: manualCgstPercentage,
      manualIgstPercentage: manualIgstPercentage, // Add this line
      // Include selected business details directly in the quotation object
      businessName: selectedBusinessDetails?.businessName,
      businessType: selectedBusinessDetails?.type,
      gstin: selectedBusinessDetails?.gstNumber,
      businessInfo: selectedBusinessDetails
        ? formatBusinessInfo(selectedBusinessDetails)
        : "",
      customerName: values.customerName,
      customerEmail: values.customerEmail,
    };

    // Delegate the actual saving (API call) to the parent component (onSave prop)
    try {
      await onSave(quotation);
      // The parent component (e.g., QuotationPage) is responsible for showing success toast and closing drawer
    } catch (error) {
      // The parent component is also responsible for showing error toast
      console.error("Error in QuotationForm onFinish:", error);
    }
  };

  /**
   * Adds a new blank item to the quotation items list.
   */
  const addItem = () =>
    setItems((prevItems) => [
      ...prevItems,
      {
        id: uuidv4(), // Unique ID for the new item
        productId: null,
        productName: "",
        description: "",
        hsnSac: "",
        quantity: 1,
        rate: 0,
        quantityType: "",
        // gstPercentage: 18, // Default GST for new items (REMOVED)
        specifications: [{ key: uuidv4(), name: "", value: "" }], // Start with one blank specification
      },
    ]);

  /**
   * Removes an item from the quotation items list by its ID.
   * @param {string} id - The unique ID of the item to remove.
   */
  const removeItem = (id) => setItems(items.filter((item) => item.id !== id));

  /**
   * Updates a specific field of an item in the items list.
   * Special handling for 'productId' to populate product-related fields.
   * @param {string} id - The unique ID of the item to update.
   * @param {string} field - The field name to update (e.g., 'quantity', 'rate', 'productId').
   * @param {*} value - The new value for the field.
   */
  const updateItem = (id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          if (field === "productId") {
            const selectedProduct = productOptions.find((p) => p._id === value);
            if (selectedProduct) {
              let newSpecifications = item.specifications || [];

              // Check if current specifications are empty or just a single blank one
              const isDefaultSpec =
                newSpecifications.length === 0 ||
                (newSpecifications.length === 1 &&
                  newSpecifications[0].name === "" &&
                  newSpecifications[0].value === "");

              // If product has options AND current specs are default/empty, then populate from product options
              if (
                selectedProduct.options &&
                selectedProduct.options.length > 0 &&
                isDefaultSpec
              ) {
                newSpecifications = selectedProduct.options.map((opt) => ({
                  key: uuidv4(), // Generate new unique keys for product-derived specs
                  name: opt.type || "",
                  value: opt.description || "",
                }));
              } else if (
                !selectedProduct.options ||
                selectedProduct.options.length === 0
              ) {
                // If product has no options and current specs are empty, ensure there's at least one blank
                if (newSpecifications.length === 0) {
                  newSpecifications = [{ key: uuidv4(), name: "", value: "" }];
                }
              }
              // If selectedProduct.options exist but isDefaultSpec is false,
              // we don't overwrite existing user-defined specifications.

              return {
                ...item,
                productId: value,
                productName:
                  selectedProduct.productName || selectedProduct.name || "", // Store the product name
                description: selectedProduct.description || "",
                hsnSac: selectedProduct.hsnSac || "",
                rate: selectedProduct.price || 0, // Set rate from product
                quantityType: selectedProduct.quantityType || "",
                // Set GST percentage from product if available, otherwise keep current or default
                gstPercentage: // RE-ENABLED
                  selectedProduct.gstPercentage !== undefined
                    ? selectedProduct.gstPercentage
                    : 0, // Changed default to 0 if product has no specific GST%
                specifications: newSpecifications, // Use the determined specifications
              };
            } else {
              // If product is deselected (value is null or undefined), clear product-derived fields
              return {
                ...item,
                productId: null,
                productName: "", // Clear product name on deselection
                description: "",
                hsnSac: "",
                rate: 0, // Reset rate to 0
                quantityType: "",
                gstPercentage: 0, // Reset GST to 0 on deselection
                specifications: [{ key: uuidv4(), name: "", value: "" }], // Reset to a single blank spec
              };
            }
          }
          // For other fields, simply update the value
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  /**
   * Adds a new blank specification to a specific item.
   * @param {string} itemId - The unique ID of the item to add a specification to.
   */
  const addSpecification = (itemId) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
            ...item,
            specifications: [
              ...(item.specifications || []), // Ensure specifications array exists
              { key: uuidv4(), name: "", value: "" }, // New blank spec with unique key
            ],
          }
          : item
      )
    );
  };

  /**
   * Removes a specification from a specific item.
   * @param {string} itemId - The unique ID of the item containing the specification.
   * @param {string} specKey - The unique key of the specification to remove.
   */
  const removeSpecification = (itemId, specKey) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
            ...item,
            specifications: (item.specifications || []).filter(
              (spec) => spec.key !== specKey
            ),
          }
          : item
      )
    );
  };

  /**
   * Updates a specific field of a specification within an item.
   * @param {string} itemId - The unique ID of the item containing the specification.
   * @param {string} specKey - The unique key of the specification to update.
   * @param {string} field - The field name to update (e.g., 'name', 'value').
   * @param {*} value - The new value for the field.
   */
  const updateSpecification = (itemId, specKey, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId // Ensure we are updating the correct item
          ? {
            ...item,
            specifications: (item.specifications || []).map(
              (
                spec // Map over the specifications of that item
              ) => (spec.key === specKey ? { ...spec, [field]: value } : spec)
            ),
          }
          : item
      )
    );
  };

  /**
   * Calculates the sub-total of all items (sum of quantity * rate for each item).
   * @returns {number} The calculated sub-total.
   */
  const calculateSubTotal = () =>
    items.reduce((sum, i) => sum + (i.quantity || 0) * (i.rate || 0), 0);

  /**
   * Calculates the total GST amount based on individual item percentages,
   * and provides a breakdown for SGST, CGST, and IGST based on gstType.
   * This is the *calculated* GST, before any manual overrides.
   * @returns {object} An object containing totalGst, sgst, cgst, and igst.
   */
  const calculateTotalGst = () => {
    let totalCalculatedGst = items.reduce((sum, i) => {
      const itemTotal = (i.quantity || 0) * (i.rate || 0);
      // Assuming individual item GST % is no longer used for calculation if manual override is present.
      // If there's no manual override, or it's interstate and no manual IGST, then this would be 0
      // unless you re-introduce a global default GST percentage.
      // For now, it will effectively be 0 for calculated GST if no per-item GST%.
      const gstRate = (i.gstPercentage || 0) / 100; // Convert percentage to decimal
      return sum + itemTotal * gstRate;
    }, 0);

    let sgst = 0;
    let cgst = 0;
    let igst = 0;

    if (gstType === "intrastate") {
      sgst = totalCalculatedGst / 2;
      cgst = totalCalculatedGst / 2;
    } else if (gstType === "interstate") {
      igst = totalCalculatedGst;
    }

    return {
      totalGst: totalCalculatedGst,
      sgst: sgst,
      cgst: cgst,
      igst: igst,
    };
  };

  /**
   * Calculates the grand total of the quotation.
   * Applies manual GST overrides in precedence:
   * 1. manualGstAmount (overall total override)
   * 2. manualSgstPercentage + manualCgstPercentage (intrastate percentage override)
   * 3. manualIgstPercentage (interstate percentage override)
   * 4. Calculated total GST from items (which will be 0 if no per-item GST%)
   * @returns {number} The calculated grand total.
   */
  const calculateTotal = () => {
    const subTotal = calculateSubTotal();
    const gstBreakdown = calculateTotalGst(); // Calculated from items

    let taxToUse = 0; // Corrected variable name

    if (manualGstAmount !== null) {
      // If overall manual total GST (absolute amount) is set, use it directly (highest precedence)
      taxToUse = manualGstAmount;
    } else if (gstType === "intrastate" && (manualSgstPercentage !== null || manualCgstPercentage !== null)) {
      // If intrastate and manual SGST/CGST percentages are set, calculate their absolute values
      const manualSgstValue = manualSgstPercentage !== null ? (subTotal * (manualSgstPercentage / 100)) : gstBreakdown.sgst;
      const manualCgstValue = manualCgstPercentage !== null ? (subTotal * (manualCgstPercentage / 100)) : gstBreakdown.cgst;
      taxToUse = manualSgstValue + manualCgstValue;
    } else if (gstType === "interstate" && manualIgstPercentage !== null) { // Add this block
      // If interstate and manual IGST percentage is set
      taxToUse = subTotal * (manualIgstPercentage / 100);
    } else {
      // Otherwise, use the automatically calculated total GST
      taxToUse = gstBreakdown.totalGst; // Corrected variable name
    }

    return subTotal + taxToUse;
  };

  /**
   * Handles the selection of a business from the dropdown.
   * Populates related form fields with the selected business'ss details.
   * @param {string} id - The unique ID of the selected business.
   */
  const handleBusinessSelect = (id) => {
    const selected = businessOptions.find((b) => b._id === id);
    if (selected) {
      setSelectedBusinessDetails(selected);
      const fullInfo = formatBusinessInfo(selected);
      form.setFieldsValue({
        businessId: selected._id,
        businessName: selected.businessName,
        businessType: selected.type,
        gstin: selected.gstNumber,
        businessInfo: fullInfo,
      });
    } else {
      // Clear business details if no business is selected
      setSelectedBusinessDetails(null);
      form.setFieldsValue({
        businessId: null,
        businessName: null,
        businessType: null,
        gstin: null,
        businessInfo: "",
      });
    }
  };

  // Get the current GST breakdown for display
  const currentGstBreakdown = calculateTotalGst();

  return (
    <Card
      title={
        <span style={styles.mainCardTitle}>
          {initialValues ? "Edit Quotation" : "Create New Quotation"}
        </span>
      }
      loading={isSaving} // Show loading spinner on card if saving
      style={styles.quotationCard}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Business Details Section */}
        <Divider style={styles.divider}>Business Details</Divider>
        <Row gutter={[16, 24]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Business Name"
              name="businessId"
              rules={[{ required: true, message: "Please select a business!" }]}
            >
              <Select
                placeholder="Select business"
                showSearch
                optionFilterProp="children" // Filter based on children (Option text)
                filterOption={(input, option) =>
                  (option?.children || "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={handleBusinessSelect}
                allowClear
                style={styles.formField}
              >
                {businessOptions.map((b) => (
                  <Option key={b._id} value={b._id}>
                    {b.businessName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {/* Hidden input to store businessName directly in form values if needed */}
            <Form.Item name="businessName" hidden>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}> {/* Adjusted column size */}
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select a date!" }]}
            >
              <DatePicker style={styles.formField} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Business Info">
              <Card bordered style={styles.businessInfoCard}>
                <pre style={styles.businessInfoPre}>
                  {form.getFieldValue("businessInfo") ||
                    "Select a business to view details..."}
                </pre>
              </Card>
            </Form.Item>
          </Col>

          {/* <Col xs={24} md={12}>
            <Form.Item name="businessType" label="Type">
              <Input readOnly style={styles.readOnlyFormField} />
            </Form.Item>
          </Col> */}
        </Row>





        <Divider style={styles.divider}>Quotation Items</Divider>
        {items.map((item) => {
          return (
            <Card key={item.id} style={styles.itemCard} size="small">
              <Row gutter={[16, 16]} align="middle">
                <Col xs={12} sm={8}>
                  <Form.Item label="Product Name">
                    <Select
                      placeholder="Search or select a product"
                      showSearch
                      optionFilterProp="children" // Filter based on children (Option text)
                      filterOption={(input, option) =>
                        (option?.children || "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      onChange={(value) =>
                        updateItem(item.id, "productId", value)
                      }
                      value={item.productId}
                      style={styles.formField}
                      allowClear
                    >
                      {productOptions.map((p) => (
                        <Option key={p._id} value={p._id}>
                          {p.productName || p.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                  <Form.Item label="Quantity">
                    <InputNumber
                      placeholder="1"
                      value={item.quantity}
                      onChange={(val) => updateItem(item.id, "quantity", val)}
                      style={styles.formField}
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                  <Form.Item label="Price (per unit)">
                    <InputNumber
                      prefix="₹"
                      value={item.rate}
                      onChange={(val) => updateItem(item.id, "rate", val)}
                      style={styles.formField}
                      min={0}
                      precision={2}
                    />
                  </Form.Item>
                </Col>
                <Col
                  xs={14}
                  sm={6}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  {items.length > 1 && (
                    <Tooltip title="Remove Item">
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => removeItem(item.id)}
                        type="text"
                        style={styles.deleteButton}
                      />
                    </Tooltip>
                  )}
                </Col>
              </Row>
              <Row gutter={[16, 16]} style={{ marginTop: token.marginS }}>
                <Col xs={14} sm={8}>
                  <Form.Item label="Description">
                    <TextArea
                      placeholder="Detailed description of the item"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      rows={2}
                    />
                  </Form.Item>
                </Col>
                <Col xs={14} sm={8}>
                  <Form.Item label="HSN/SAC Code">
                    <Input
                      placeholder="HSN/SAC"
                      value={item.hsnSac}
                      onChange={(e) =>
                        updateItem(item.id, "hsnSac", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item label="Item Total">
                    <Input
                      readOnly
                      value={`₹${(
                        (item.quantity || 0) * (item.rate || 0)
                      ).toFixed(2)}`}
                      style={styles.totalItemField}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Individual Item GST % - REMOVED FROM HERE */}
              {/* <Row gutter={[16, 16]} style={{ marginTop: token.marginS }}>
                <Col xs={24} sm={8}>
                  <Form.Item label="GST %">
                    <InputNumber
                      placeholder="e.g., 18"
                      value={item.gstPercentage}
                      onChange={(val) => updateItem(item.id, "gstPercentage", val)}
                      style={{
                        ...styles.formField,
                        backgroundColor: token.colorFillAlter, // Light background
                        borderColor: token.colorPrimary, // Highlight border
                        borderWidth: '2px',
                        fontWeight: 'bold',
                      }}
                      min={0}
                      max={100}
                      formatter={(value) => `${value}%`}
                      parser={(value) => value.replace("%", "")}
                    />
                  </Form.Item>
                </Col>
              </Row> */}

              {/* Specifications Section */}
              {item.specifications && item.specifications.length > 0 && (
                <>
                  <Divider
                    orientation="left"
                    style={styles.specificationDivider}
                  >
                    Specifications
                  </Divider>
                  {item.specifications.map((spec, specIndex) => (
                    <Row
                      key={spec.key}
                      gutter={16}
                      style={styles.specificationRow}
                      align="middle"
                    >
                      <Col xs={24} sm={10}>
                        <Form.Item label="Specification Name">
                          <Input
                            placeholder="e.g., Color"
                            value={spec.name}
                            onChange={(e) =>
                              updateSpecification(
                                item.id,
                                spec.key,
                                "name",
                                e.target.value
                              )
                            }
                            style={styles.formField}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={10}>
                        <Form.Item label="Specification Value">
                          <Input
                            placeholder="e.g., Blue"
                            value={spec.value}
                            onChange={(e) =>
                              updateSpecification(
                                item.id,
                                spec.key,
                                "value",
                                e.target.value
                              )
                            }
                            style={styles.formField}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Space>
                          {item.specifications.length > 1 && (
                            <Tooltip title="Remove Specification">
                              <Button
                                icon={<MinusCircleOutlined />}
                                onClick={() =>
                                  removeSpecification(item.id, spec.key)
                                }
                                type="text"
                                danger
                                style={styles.deleteButton}
                              />
                            </Tooltip>
                          )}
                          {specIndex === item.specifications.length - 1 && (
                            <Tooltip title="Add New Specification">
                              <Button
                                icon={<PlusOutlined />}
                                onClick={() => addSpecification(item.id)}
                                type="dashed"
                                style={styles.addButton}
                              />
                            </Tooltip>
                          )}
                        </Space>
                      </Col>
                    </Row>
                  ))}
                </>
              )}
              {/* Corrected logic for displaying "Add Specification" button */}
              {((!item.specifications || item.specifications.length === 0) ||
                (item.specifications.length > 0 &&
                  item.specifications[item.specifications.length - 1].name &&
                  item.specifications[item.specifications.length - 1].value)) && (
                  <Button
                    onClick={() => addSpecification(item.id)}
                    block
                    type="dashed"
                    style={styles.addSpecButton}
                  >
                    + Add Specification
                  </Button>
                )}
            </Card>
          );
        })}
        <Button
          onClick={addItem}
          block
          type="dashed"
          style={styles.addItemButton}
        >
          + Add Another Item
        </Button>

        {/* Quotation Summary Section */}
        <Divider style={styles.divider}>Quotation Summary</Divider>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="gstType"
              label="GST Type"
              rules={[{ required: true, message: "Please select a GST type!" }]}
            >
              <Select
                placeholder="Select GST calculation type"
                onChange={(value) => {
                  setGstType(value);
                  setManualGstAmount(null); // Clear manual total GST when changing type
                  setManualSgstPercentage(null); // Clear manual SGST percentage
                  setManualCgstPercentage(null); // Clear manual CGST percentage
                  setManualIgstPercentage(null); // Clear manual IGST percentage (ADDED)
                  form.setFieldsValue({ manualGst: null, manualSgst: null, manualCgst: null, manualIgst: null }); // Clear form fields (UPDATED)
                }}
                value={gstType}
                style={styles.formField}
              >
                <Option value="interstate">Interstate - IGST</Option>
                <Option value="intrastate">Intrastate - SGST/CGST</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Sub Total">
              <Input
                readOnly
                value={`₹${calculateSubTotal().toFixed(2)}`}
                style={styles.totalField}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Display GST breakdown based on gstType */}
        {gstType === "intrastate" && (
          <>
            {/* <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Form.Item label="Calculated SGST">
                  <Input
                    readOnly
                    value={`₹${currentGstBreakdown.sgst.toFixed(2)}`}
                    style={styles.totalField}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="Calculated CGST">
                  <Input
                    readOnly
                    value={`₹${currentGstBreakdown.cgst.toFixed(2)}`}
                    style={styles.totalField}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="Calculated Total GST">
                  <Input
                    readOnly
                    value={`₹${currentGstBreakdown.totalGst.toFixed(2)}`}
                    style={styles.totalField}
                  />
                </Form.Item>
              </Col>
            </Row> */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Form.Item label="Manual SGST %"> {/* Label changed to reflect percentage */}
                  <InputNumber
                    value={manualSgstPercentage}
                    onChange={(val) => setManualSgstPercentage(val)}
                    style={{
                      ...styles.formField,
                      backgroundColor: token.colorFillAlter,

                      borderWidth: '2px',
                      fontWeight: 'bold',
                    }}
                    min={0}
                    max={100} // Max value for percentage
                    precision={2} // Allow decimal percentages
                    formatter={(value) => `${value}%`} // Format as percentage
                    parser={(value) => value.replace("%", "")} // Parse as number
                    placeholder="Override SGST %"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="Manual CGST %"> {/* Label changed to reflect percentage */}
                  <InputNumber
                    value={manualCgstPercentage}
                    onChange={(val) => setManualCgstPercentage(val)}
                    style={{
                      ...styles.formField,
                      backgroundColor: token.colorFillAlter,

                      borderWidth: '2px',
                      fontWeight: 'bold',
                    }}
                    min={0}
                    max={100} // Max value for percentage
                    precision={2} // Allow decimal percentages
                    formatter={(value) => `${value}%`} // Format as percentage
                    parser={(value) => value.replace("%", "")} // Parse as number
                    placeholder="Override CGST %"
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {gstType === "interstate" && (
          <Row gutter={[16, 16]}>
            {/* <Col xs={24} sm={12}>
              <Form.Item label="Calculated IGST">
                <Input
                  readOnly
                  value={`₹${currentGstBreakdown.igst.toFixed(2)}`}
                  style={styles.totalField}
                />
              </Form.Item>
            </Col> */}

            {/* <Col xs={24} sm={12}>
              <Form.Item label="Calculated Total GST">
                <Input
                  readOnly
                  value={`₹${currentGstBreakdown.totalGst.toFixed(2)}`}
                  style={styles.totalField}
                />
              </Form.Item>
            </Col> */}
            {/* New Manual IGST % field */}
            <Col xs={24} sm={12}>
              <Form.Item label="Manual IGST %">
                <InputNumber
                  value={manualIgstPercentage}
                  onChange={(val) => setManualIgstPercentage(val)}
                  style={{
                    ...styles.formField,
                    backgroundColor: token.colorFillAlter,
                    borderWidth: '2px',
                    fontWeight: 'bold',
                  }}
                  min={0}
                  max={100}
                  precision={2}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value.replace("%", "")}
                  placeholder="Override IGST %"
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Manual Total GST Override Field (always visible) */}
        <Row gutter={[16, 16]} style={{ marginTop: token.margin }}>

          <Col xs={24} md={12}>
            <Form.Item label="Grand Total">
              <Input
                readOnly
                value={`₹${calculateTotal().toFixed(2)}`}
                style={styles.grandTotalField}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="noteText" label="Add New Note">
              <TextArea
                rows={3}
                style={styles.textAreaField}
                placeholder="Add any additional notes, terms, or conditions for this quotation..."
              />
            </Form.Item>
          </Col>


        </Row>


        {notes.length > 0 && (
          <Form.Item label="Existing Notes">
            <Card style={styles.notesCard}>
              {notes.map((note, index) => (
                <p key={index} style={styles.noteText}>
                  <strong>{note.timestamp}:</strong> {note.text}
                </p>
              ))}
            </Card>
          </Form.Item>
        )}
        {/* Terms and Conditions Section */}
        <Divider style={styles.divider}>Terms and Conditions</Divider>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item name="pricesTerms" label="Price">
              <Input placeholder="e.g., Inclusive of all taxes" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="warranty" label="TAXES">
              <Input placeholder="e.g.,GST@18% shall be extra." />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="paymentTerms" label="Payment Terms">
              <Input placeholder="e.g., 50% advance, balance on delivery" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="delivery" label="Delivery">
              <Input placeholder="e.g., Within 7 days from PO" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="packingForwardingCharges" label="Packing & Forwarding Charges">
              <Input placeholder="e.g., ₹500 fixed" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="transportationCharges" label="Transportation Charges">
              <Input placeholder="e.g., As per actuals" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="transporterName" label="Transporter Name">
              <Input placeholder="e.g., ABC Logistics" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="modePlaceDelivery" label="Mode & Place of Delivery">
              <Input placeholder="e.g., Road - Chennai" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="offerValidity" label=" Validity">
              <Input placeholder="e.g., 30 days from quotation date" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="customerScope" label="Customer's Scope">
              <TextArea rows={3} placeholder="e.g., Civil work, Power supply, Internet setup..." />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="quotationNotes" label="Quotation Notes">
              <TextArea rows={3} placeholder="e.g., Civil work, Power supply, Internet setup..." />
            </Form.Item>
          </Col>
        </Row>


        <Form.Item style={styles.buttonGroup}>
          <Space size="middle">
            <Button onClick={onCancel} disabled={isSaving} size="large">
              Cancel
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              style={{ backgroundColor: '#ef7a1b', borderColor: '#orange', color: 'white' }}
              icon={<SaveOutlined />}
              loading={isSaving}
              size="large"
            >
              Save Quotation
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default QuotationForm;