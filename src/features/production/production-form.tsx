import { LeftOutlined } from "@ant-design/icons";
import {
  Alert,
  Form as AntForm,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  notification,
  Row,
  Select,
  Space,
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
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { getFormulationsApi } from "../../services/formulation.services";
import { createProductionApi } from "../../services/production.services";
import FormulationDetail from "../formulation/formulation-detail";
import { FormulationItem } from "../formulation/types";
import { getCodeApi } from "../../services/common.services";
import { buildQueryString } from "../../utils";

const { Title } = Typography;

interface FormValues {
  code: string;
  date: string;
  formulationId: string;
  batchSize: number;
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

  const formikRef = useRef<FormikProps<FormValues>>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const initialValues: FormValues = {
    code: "",
    date: "",
    formulationId: "",
    batchSize: 1,
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

    const getCode = async () => {
      const query = buildQueryString({ entity: "PRODUCTION" });
      const response = await getCodeApi(query);
      formikRef?.current?.setFieldValue("code", response.data.code);
    };
    fetchFormulations();
    if (formikRef?.current?.values?.code === "") getCode();
  }, []);

  useEffect(() => {
    const found = formulations.find((f) => f.id === formulationId);
    setSelectedFormulation(found || null);
  }, [formulationId, formulations]);

  // Check for ingredient shortages
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!selectedFormulation || !(selectedFormulation as any).ingredients) {
      setIngredientShortages([]);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shortages = ((selectedFormulation as any).ingredients as any[])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((ing: any) => {
        const required =
          (ing.quantityRequired ?? ing.qtyRequired ?? 0) * batchSize;
        const available = ing.quantityAvailable ?? ing.availableQuantity ?? 0;
        return required > available;
      })
      .map(
        (ing) =>
          `${ing.name} (Required: ${
            (ing.quantityRequired ?? ing.qtyRequired ?? 0) * batchSize
          }, Available: ${ing.quantityAvailable ?? ing.availableQuantity ?? 0})`
      );
    setIngredientShortages(shortages);
  }, [selectedFormulation, batchSize]);

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
        quantity: values.batchSize,
        totalCost: batchSize * parseFloat(selectedFormulation.totalCost ?? 0),
      };
      const response = await createProductionApi(payload);
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
    <>
      <Space className="mb-6">
        <Button onClick={() => navigate(-1)} icon={<LeftOutlined />} />
        <Title level={3} style={{ margin: 0 }}>
          {isEditing ? "Edit Formulation" : "Add New Formulation"}
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
                <Row gutter={16} align="middle">
                  <Col xs={24} sm={6} md={5} lg={5} xl={5}>
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
                  <Col xs={24} sm={6} md={5} lg={5} xl={5}>
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
                  <Col xs={24} sm={6} md={5} lg={5} xl={5}>
                    <AntForm.Item
                      label="Batch Size"
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                    >
                      <InputNumber
                        min={1}
                        value={batchSize}
                        onChange={(value) => setBatchSize(value || 1)}
                        style={{ width: "100%" }}
                      />
                    </AntForm.Item>
                  </Col>
                  <Col xs={24} sm={7} md={6} lg={6} xl={6}>
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
                        placeholder="Select a formulation"
                        optionFilterProp="label"
                        value={values.formulationId || undefined}
                        onChange={(value: string) => {
                          setFieldValue("formulationId", value);
                          setFormulationId(value);
                        }}
                        filterOption={(
                          input: string,
                          option?: { label: string; value: string }
                        ) =>
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
                    sm={24}
                    md={3}
                    lg={3}
                    xl={3}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                      paddingTop: 24,
                    }}
                  >
                    <AntForm.Item
                      label=" "
                      colon={false}
                      style={{ marginBlock: 0 }}
                    >
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmitting}
                        style={{ width: "100%" }}
                        disabled={ingredientShortages.length > 0}
                      >
                        Submit
                      </Button>
                    </AntForm.Item>
                  </Col>
                </Row>
              </Form>

              {/*  */}

              <Divider style={{ margin: "32px 0 16px 0" }}>
                Formulation Detail
              </Divider>
              <Card>
                {selectedFormulation ? (
                  <FormulationDetail
                    formulation={selectedFormulation}
                    batchSize={batchSize}
                  />
                ) : (
                  <span style={{ color: "#888" }}>
                    Select a formulation to view its details.
                  </span>
                )}
              </Card>
            </div>
          </div>
        )}
      </Formik>
    </>
  );
};

export default ProductionForm;
