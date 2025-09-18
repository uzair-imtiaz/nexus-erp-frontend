import { LeftOutlined } from "@ant-design/icons";
import {
  Alert,
  Form as AntForm,
  Button,
  Col,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  notification,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  ErrorMessage,
  Field,
  FieldProps,
  Form,
  Formik,
  FormikProps,
} from "formik";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { getFormulationsApi } from "../../services/formulation.services";
import {
  createProductionApi,
  getProductionApi,
  updateProductionApi,
} from "../../services/production.services";
import { getCodeApi } from "../../services/common.services";
import {
  buildExpensesPayload,
  buildIngredientsPayload,
  buildProductsPayload,
  buildQueryString,
} from "../../utils";
import { FormulationItem } from "../formulation/types";
import { useInventoryAndExpenses } from "../../hooks/useExpensesAndInventory.hook";
import FormulationEditor from "../../components/common/formulation-editor/formulation-editor";

const { Title } = Typography;

interface FormValues {
  code: string;
  date: string;
  formulationId: string;
  batchSize: number;
  repetition: number;
}

const validationSchema = Yup.object({
  code: Yup.string().required("Code is required"),
  date: Yup.string().required("Date is required"),
  formulationId: Yup.string().required("Formulation is required"),
});

const ProductionForm: React.FC = () => {
  const [formulations, setFormulations] = useState<FormulationItem[]>([]);
  const [selectedFormulation, setSelectedFormulation] =
    useState<FormulationItem | null>(null);
  const [formulationId, setFormulationId] = useState<string>("");
  const [batchSize, setBatchSize] = useState<number>(1);
  const [ingredientShortages, setIngredientShortages] = useState<string[]>([]);
  const [repetition, setRepetition] = useState<number>(1);
  const [productionFetchLoading, setProductionFetchLoading] = useState(false);

  const formikRef = useRef<FormikProps<FormValues>>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  // inventory + expenses data
  const { inventoryItems, expensesList, loading } = useInventoryAndExpenses();

  const initialValues: FormValues = {
    code: "",
    date: "",
    formulationId: "",
    batchSize: 1,
    repetition: 1,
  };

  useEffect(() => {
    const fetchFormulations = async () => {
      try {
        const response = await getFormulationsApi("");
        if (response?.success) {
          setFormulations(response?.data);
        } else {
          notification.error({
            message: "Error",
            description: response?.message,
          });
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: String(error),
        });
      }
    };

    const fetchProduction = async (id: string) => {
      try {
        setProductionFetchLoading(true);
        const response = await getProductionApi(id);
        if (response?.success) {
          setFormulationId(response?.data?.formulation?.id);
          setSelectedFormulation({
            ...response.data?.formulation,
            products: response.data?.products,
            ingredients: response.data?.ingredients,
            expenses: response.data?.expenses,
            totalCost: response.data?.formulationCost,
          });
          setBatchSize(response?.data?.quantity);
          setRepetition(response?.data?.repetition);
          formikRef?.current?.setValues({
            code: response?.data?.code,
            date: response?.data?.date,
            formulationId: response?.data?.formulation?.id,
            batchSize: response?.data?.quantity,
            repetition: response?.data?.repetition,
          });
        } else {
          notification.error({
            message: "Error",
            description: response?.message,
          });
        }
      } catch {
        notification.error({
          message: "Error",
          description: "Something Went Wrong",
        });
      } finally {
        setProductionFetchLoading(false);
      }
    };

    const getCode = async () => {
      const query = buildQueryString({ entity: "PRODUCTION" });
      const response = await getCodeApi(query);
      formikRef?.current?.setFieldValue("code", response.data.code);
    };

    fetchFormulations();
    if (isEditing) fetchProduction(id);
    if (!formikRef?.current?.values?.code && !isEditing) getCode();
  }, []);

  // inside ProductionForm component

  useEffect(() => {
    const found = formulations.find((f) => f.id === formulationId);
    // clone to avoid referencing list item directly (prevents accidental mutation)
    setSelectedFormulation(found ? JSON.parse(JSON.stringify(found)) : null);
  }, [formulationId, formulations]);

  const handleFormulationChange = useCallback(
    ({ finishedGoods, ingredients, expenses, totalCost }) => {
      setSelectedFormulation((prev) => {
        const base = prev ? { ...prev } : {};
        const newState = {
          ...base,
          products: finishedGoods, // keep stored shape consistent: products
          ingredients,
          expenses,
          totalCost,
        };
        // compare shallow by stringifying base (safe since these are small)
        if (JSON.stringify(base) === JSON.stringify(newState)) return prev;
        return newState;
      });
    },
    []
  );

  // Check for ingredient shortages
  useEffect(() => {
    if (!selectedFormulation || !(selectedFormulation as any).ingredients) {
      setIngredientShortages([]);
      return;
    }
    const shortages = ((selectedFormulation as any).ingredients as any[])
      .filter((ing: any) => {
        const requiredPerBatch = ing.quantityRequired ?? ing.qtyRequired ?? 0;
        const required = requiredPerBatch * batchSize * repetition;
        const available = ing.quantityAvailable ?? ing.availableQuantity ?? 0;
        return required > available;
      })
      .map(
        (ing) =>
          `${ing.name} (Required: ${
            (ing.quantityRequired ?? ing.qtyRequired ?? 0) *
            batchSize *
            repetition
          }, Available: ${ing.quantityAvailable ?? ing.availableQuantity ?? 0})`
      );

    setIngredientShortages(shortages);
  }, [selectedFormulation, batchSize, repetition]);

  const formulationOptions = formulations.map((f) => ({
    label: `${f.name} (${f.id})`,
    value: f.id,
  }));

  const handleSubmit = async (values: FormValues) => {
    try {
      const payload = {
        code: values.code,
        date: values.date,
        formulationId: values.formulationId,
        quantity: batchSize,
        repetition,
        products: buildProductsPayload(
          (selectedFormulation as any)?.products || []
        ),
        ingredients: buildIngredientsPayload(
          (selectedFormulation as any)?.ingredients || []
        ),
        expenses: buildExpensesPayload(
          (selectedFormulation as any)?.expenses || []
        ),
        formulationCost: (selectedFormulation as any)?.totalCost,
        totalCost: parseFloat(
          (selectedFormulation as any)?.totalCost ?? "0"
        ).toFixed(3),
      };
      const response = isEditing
        ? await updateProductionApi(id, payload)
        : await createProductionApi(payload);
      if (response.success) {
        notification.success({
          message: "Success",
          description: response.message,
        });
        navigate("/production");
      } else {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    } catch {
      notification.error({
        message: "Error",
        description: "Failed to create production",
      });
    }
  };

  return (
    <Spin spinning={productionFetchLoading || loading}>
      <Space className="mb-6">
        <Button onClick={() => navigate(-1)} icon={<LeftOutlined />} />
        <Title level={3} style={{ margin: 0 }}>
          {isEditing ? "Edit Production" : "Add New Production"}
        </Title>
      </Space>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        innerRef={formikRef}
      >
        {({ setFieldValue, values, errors, touched, isSubmitting }) => (
          <div>
            {ingredientShortages.length > 0 && (
              <Alert
                type="warning"
                showIcon
                message="Ingredient Shortage Warning"
                description={
                  <div>
                    The following ingredients do not have enough stock:
                    <br />
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {ingredientShortages.map((msg) => (
                        <li key={msg}>{msg}</li>
                      ))}
                    </ul>
                  </div>
                }
                style={{ marginBottom: 16 }}
              />
            )}
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <Form>
                <Row gutter={12} align="middle" wrap>
                  <Col xs={24} sm={4}>
                    <AntForm.Item
                      label="Code"
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      validateStatus={
                        touched.code && errors.code ? "error" : ""
                      }
                      help={<ErrorMessage name="code" />}
                    >
                      <Field name="code">
                        {({ field }: FieldProps) => (
                          <Input {...field} placeholder="Enter code" />
                        )}
                      </Field>
                    </AntForm.Item>
                  </Col>

                  <Col xs={24} sm={4}>
                    <AntForm.Item
                      label="Date"
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      validateStatus={
                        touched.date && errors.date ? "error" : ""
                      }
                      help={<ErrorMessage name="date" />}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        value={values.date ? dayjs(values.date) : null}
                        onChange={(date: Dayjs | null) =>
                          setFieldValue(
                            "date",
                            date ? date.format("YYYY-MM-DD") : ""
                          )
                        }
                        format="YYYY-MM-DD"
                      />
                    </AntForm.Item>
                  </Col>

                  <Col xs={24} sm={3}>
                    <AntForm.Item label="Batch" labelCol={{ span: 24 }}>
                      <InputNumber
                        min={1}
                        value={batchSize}
                        onChange={(value) => setBatchSize(value || 1)}
                        style={{ width: "100%" }}
                      />
                    </AntForm.Item>
                  </Col>

                  <Col xs={24} sm={3}>
                    <AntForm.Item label="Repetition" labelCol={{ span: 24 }}>
                      <InputNumber
                        min={1}
                        value={repetition}
                        onChange={(value) => setRepetition(value || 1)}
                        style={{ width: "100%" }}
                      />
                    </AntForm.Item>
                  </Col>

                  <Col xs={24} sm={6}>
                    <AntForm.Item
                      label="Formulation"
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      validateStatus={
                        touched.formulationId && errors.formulationId
                          ? "error"
                          : ""
                      }
                      help={<ErrorMessage name="formulationId" />}
                    >
                      <Select
                        showSearch
                        placeholder="Select"
                        optionFilterProp="label"
                        value={values.formulationId || undefined}
                        onChange={(value: string) => {
                          setFieldValue("formulationId", value);
                          setFormulationId(value);
                        }}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={formulationOptions}
                      />
                    </AntForm.Item>
                  </Col>

                  <Col
                    xs={24}
                    sm={2}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <AntForm.Item label=" " colon={false}>
                      <Button
                        type="primary"
                        className="mt-1"
                        htmlType="submit"
                        loading={isSubmitting}
                        disabled={ingredientShortages.length > 0}
                      >
                        Submit
                      </Button>
                    </AntForm.Item>
                  </Col>
                </Row>
              </Form>

              <div style={{ marginTop: 32 }}>
                <Divider style={{ margin: "32px 0 16px 0" }}>
                  Formulation Detail
                </Divider>
                {selectedFormulation && (
                  <FormulationEditor
                    initialData={selectedFormulation}
                    inventoryItems={inventoryItems}
                    expensesList={expensesList}
                    showHeader={false}
                    onChange={handleFormulationChange}
                    loading={loading}
                    batchSize={batchSize}
                    repetition={repetition}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </Formik>
    </Spin>
  );
};

export default ProductionForm;
