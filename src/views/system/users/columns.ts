import { h } from 'vue';
import { NTag } from 'naive-ui';

import { BasicColumn } from '@/components/Table';
export interface ListData {
  id: string;
  userName: string;
  mailName: string;
  available: string;
}
export const columns: BasicColumn<ListData>[] = [
  {
    title: 'id',
    key: 'id',
    width: 300,
  },
  {
    title: '用户名',
    key: 'userName',
    width: 300,
  },
  {
    title: '邮箱',
    key: 'mailName',
    width: 300,
  },
  {
    title: '账号状态',
    key: 'status',
    render(row) {
      return h(
        NTag,
        {
          type: row.available ? 'success' : 'error',
        },
        {
          default: () => (row.available ? 'enable' : 'disable'),
        }
      );
  }
}
];
