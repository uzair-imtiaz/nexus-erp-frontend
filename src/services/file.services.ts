import { responseMetadata } from "../apis/types";
import { postCallback } from "../utils/network-helper";

export const downloadSampleFile = async (type: string): Promise<void> => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/files/sample/${type}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to download sample file");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${type}-sample.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const importFile = async (
  type: string,
  file: File
): Promise<responseMetadata> => {
  const formData = new FormData();
  formData.append("file", file);

  const response: responseMetadata = await postCallback(
    `/files/import/${type}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};
