import {
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Flex,
  notification,
  Row,
  Spin,
  Table,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { getBalanceSheetReport } from "../../services/reports.services";
import { buildQueryString, formatCurrency } from "../../utils";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const sectionStyle = { marginBottom: 24 };

const columns = [
  {
    title: "Account",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Amount",
    dataIndex: "balance",
    key: "balance",
    align: "right",
    render: (value: number) => (
      <Text type={value < 0 ? "danger" : "success"}>
        {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </Text>
    ),
  },
];
const BalanceSheet = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const query = buildQueryString({
        date: selectedDate ? selectedDate : dayjs(),
      });
      const response = await getBalanceSheetReport(query);
      if (response?.success) {
        setData(response?.data);
      } else {
        notification.error({
          message: "Error",
          description: response?.message || response?.error,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error?.message,
      });
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={3}>Balance Sheet</Title>

      <Flex gap={12}>
        <DatePicker
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          placeholder="Select date"
          style={{ width: 300 }}
          className="mb-4"
        />
        <Button type="primary" onClick={fetchReportData}>
          Run Report
        </Button>
      </Flex>
      {loading ? (
        <div className="mt-40 flex justify-center">
          <Spin />
        </div>
      ) : (
        data && (
          <>
            <Row gutter={32}>
              <Col span={12}>
                <Card
                  title="Equity and Liabilities"
                  bordered={false}
                  style={sectionStyle}
                >
                  <Collapse ghost defaultActiveKey={["1", "2"]}>
                    <Panel header="Capital & Reserves" key="1">
                      <Table
                        columns={columns}
                        dataSource={data.equity.accounts}
                        pagination={false}
                        rowKey="name"
                        summary={() => (
                          <Table.Summary.Row>
                            <Table.Summary.Cell>
                              Total Capital & Reserves
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align="right">
                              <Text strong>
                                {formatCurrency(data.equity.total)}
                              </Text>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        )}
                      />
                    </Panel>
                    <Panel header="Current Liabilities" key="2">
                      <Table
                        columns={columns}
                        dataSource={data.liabilities.accounts}
                        pagination={false}
                        rowKey="name"
                        summary={() => (
                          <Table.Summary.Row>
                            <Table.Summary.Cell>
                              Total Liabilities
                            </Table.Summary.Cell>
                            <Table.Summary.Cell align="right">
                              <Text strong>
                                {formatCurrency(data.liabilities.total)}
                              </Text>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        )}
                      />
                    </Panel>
                  </Collapse>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="Assets" bordered={false} style={sectionStyle}>
                  <Collapse ghost defaultActiveKey={["1", "2", "3"]}>
                    <Panel header="Non-Current Assets" key="2">
                      <Table
                        columns={columns}
                        dataSource={data.assets.nonCurrent.accounts}
                        pagination={false}
                        rowKey="name"
                        summary={() => (
                          <Table.Summary.Row>
                            <Table.Summary.Cell>Total</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">
                              <Text strong>
                                {formatCurrency(data.assets.nonCurrent.total)}
                              </Text>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        )}
                      />
                    </Panel>

                    <Panel header="Current Assets" key="3">
                      <Table
                        columns={columns}
                        dataSource={data.assets.current.accounts}
                        pagination={false}
                        rowKey="name"
                        summary={() => (
                          <Table.Summary.Row>
                            <Table.Summary.Cell>Total</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">
                              <Text strong>
                                {formatCurrency(
                                  data.assets.current.total
                                ).toLocaleString()}
                              </Text>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        )}
                      />
                    </Panel>
                  </Collapse>
                </Card>
              </Col>
            </Row>

            <Card style={sectionStyle}>
              <Row justify="space-between">
                <Col>
                  <Title level={4}>Total Liabilities & Equity</Title>
                  <Text strong>
                    {formatCurrency(data.totalLiabilitiesAndEquity)}
                  </Text>
                </Col>
                <Col>
                  <Title level={4}>Total Assets</Title>
                  <Text strong>
                    {formatCurrency(
                      data.assets.current.total + data.assets.nonCurrent.total
                    )}
                  </Text>
                </Col>
              </Row>
            </Card>
          </>
        )
      )}
    </div>
  );
};

export default BalanceSheet;
