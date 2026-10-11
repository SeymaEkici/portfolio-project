import { api } from '@/lib/api';
import { ContactMessage } from '@/types';

export async function getMessages(): Promise<ContactMessage[]> {
  const response = await api.get('/messages');
  return response.data.data.messages;
}

export async function deleteMessage(id: string): Promise<void> {
  await api.delete(`/messages/${id}`);
}