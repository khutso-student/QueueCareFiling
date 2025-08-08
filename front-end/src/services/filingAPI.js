import api from '../services/api';

// ✅ Get all filings
export const getAllFilings = async () => {
  try {
    const response = await api.get('/filings');
    return response.data;
  } catch (error) {
    console.error('Error fetching filings:', error);
    throw error;
  }
};

// ✅ Create a new filing
export const createFiling = async (filingData) => {
  try {
    const res = await api.post('/filings', filingData);
    return res.data;
  } catch (error) {
    console.error('Error creating filing:', error);
    throw error;
  }
};

// ✅ Update a filing by ID
export const updateFiling = async (id, updatedData) => {
  try {
    const res = await api.put(`/filings/${id}`, updatedData);
    return res.data;
  } catch (error) {
    console.error('Error updating filing:', error);
    throw error;
  }
};

// ✅ Delete a filing by ID
export const deleteFiling = async (id) => {
  try {
    const res = await api.delete(`/filings/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting filing:', error);
    throw error;
  }
};
