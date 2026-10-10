import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Backend'e giden isteklerde httpOnly cookie'lerin (JWT) taşınmasını sağlar!
  headers: {
    'Content-Type': 'application/json',
  },
});