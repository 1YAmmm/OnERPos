// src/services/employeeService.js

import { employeeRepository } from '../repositories/employeeRepository';
import { authService } from './authService';

export const employeeService = {
  async register({
    email,
    password,
    fullName,
    position,
    hourlyRate,
    hireDate,
  }) {
    if (!email || !email.includes('@'))
      throw new Error('Invalid email address');
    if (!password || password.length < 6)
      throw new Error('Password must be at least 6 characters');
    if (!fullName?.trim()) throw new Error('Employee name is required');

    const token = authService.getToken();
    if (!token) throw new Error('Not authenticated');

    const session = authService.getSession();
    const ownerId = session?.user?.id;
    if (!ownerId) throw new Error('Could not determine owner ID');

    await employeeRepository.register({
      email,
      password,
      fullName,
      position,
      hourlyRate,
      hireDate,
      ownerId,
      token,
    });
    return { success: true };
  },

  async getAll() {
    const token = authService.getToken();
    if (!token) throw new Error('Not authenticated');
    return employeeRepository.getAll(token);
  },

  async update({ id, fullName, position, hourlyRate, hireDate, status }) {
    const token = authService.getToken();
    if (!token) throw new Error('Not authenticated');
    return employeeRepository.update({
      id,
      fullName,
      position,
      hourlyRate,
      hireDate,
      status,
      token,
    });
  },

  async delete(id) {
    const token = authService.getToken();
    if (!token) throw new Error('Not authenticated');
    return employeeRepository.delete(id, token);
  },
};
