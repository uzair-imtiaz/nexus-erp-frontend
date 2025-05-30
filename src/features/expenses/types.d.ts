import { Dayjs } from "dayjs";

export interface ExpenseRow {
    key: number;
    date: Dayjs;
    refNo: string;
    mode: string;
    nominalAccount: string;
    project: string;
    details: string;
    amount: number;
} 