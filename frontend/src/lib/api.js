const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Upload failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch (e) {
      errorMessage = `Server error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const analyzeDocument = async (fileId) => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file_id: fileId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Analysis failed");
  }

  return response.json();
};

export const verifyActions = async (fileId, actions, verifiedBy = "officer_john") => {
    const response = await fetch(`${API_BASE_URL}/verify`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_id: fileId, verified_by: verifiedBy, actions }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Verification failed");
    }

    return response.json();
};

export const fetchVerifiedCases = async () => {
    const response = await fetch(`${API_BASE_URL}/cases`, {
        method: "GET",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to fetch cases");
    }

    return response.json();
};
