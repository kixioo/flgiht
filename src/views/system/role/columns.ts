import { h } from 'vue';
import { NTag } from 'naive-ui';

export const columns = [
  {
    title: 'id',
    key: 'roleId',
  },
  {
    title: '角色名称',
    key: 'roleName',
  },
  {
    title: '说明',
    key: 'roleDescription',
  },
  {
    title: '是否默认角色',
    key: 'isDefault',
    render(row) {
      return h(
        NTag,
        {
          type: row.isDefault ? 'success' : 'error',
        },
        {
          default: () => (row.isDefault ? '是' : '否'),
        }
      );
    },
  },
  {
    title: '创建时间',
    key: 'createTime',
  },
  {
    title: '角色状态',
    key: 'status',
    render(row) {
      return h(
        NTag,
        {
          type: row.status ? 'success' : 'error',
        },
        {
          default: () => (row.status ? 'enable' : 'disable'),
        }
      );
  }
}
];