// src/contexts/EmployeeContext.jsx

import { createContext, useContext, useState } from 'react';
import { employeeService } from '../services/employeeService';

const EmployeeContext = createContext(null);

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clearError = () => setError('');

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const registerEmployee = async (form) => {
    setError('');
    try {
      await employeeService.register(form);
      await fetchEmployees(); // keep list in sync
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  };

  const updateEmployee = async (payload) => {
    setError('');
    try {
      await employeeService.update(payload);
      await fetchEmployees();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  };

  const deleteEmployee = async (id) => {
    setError('');
    try {
      await employeeService.delete(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        error,
        clearError,
        fetchEmployees,
        registerEmployee,
        updateEmployee,
        deleteEmployee,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export const useEmployees = () => useContext(EmployeeContext);
