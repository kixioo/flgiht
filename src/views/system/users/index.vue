<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
      <template #statusSlot="{ model, field }">
        <n-input v-model:value="model[field]" />
      </template>
    </BasicForm>

    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row:ListData) => row.id"
      :dataSource="dataform"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1090"
    >
      <template #tableTitle>
        <n-button type="primary" @click="addTable">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建
        </n-button>
      </template>

      <template #toolbar>
        <n-button type="primary" @click="reloadTable">刷新数据</n-button>
      </template>
    </BasicTable>

    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="新建">
      <n-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="80"
        class="py-4"
      >
        <n-form-item label="用户名" path="username">
          <n-input placeholder="请输入用户名" v-model:value="formParams.username" />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input type="password" placeholder="请输入密码" show-password-on="click" v-model:value="formParams.password" />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input  placeholder="请输入邮箱"  v-model:value="formParams.email" />
        </n-form-item>
        <n-form-item label="选择角色" path="isDefault">
          <n-select v-model:value="formParams.type" :options="options" clearable />
        </n-form-item>
        <n-form-item label="角色是否启用" path="available">
          <n-switch v-model:value="formParams.available" />
        </n-form-item>
      </n-form>

      <template #action>
        <n-space>
          <n-button @click="() => (showModal = false)">取消</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
  import { h, onMounted, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getUsers } from '@/api/system/role';
  import { getIds ,addUser} from '@/api/system/role'
  import { columns, ListData } from './columns';
  import { PlusOutlined } from '@vicons/antd';
  import { useRouter } from 'vue-router';
  import { FormItemRule, type FormRules } from 'naive-ui';
import { ResultEnum } from '@/enums/httpEnum';

  const rules: FormRules = {
    username: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入用户名',
    },
    password: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入密码',
    },
    email: [
  {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('请输入邮箱');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return new Error('请输入有效的邮箱地址');
      }
      return true;
    },
    trigger: ['input', 'blur']
  }
],
  };

  const options =ref([])
  const schemas: FormSchema[] = [
    {
      field: 'name',
      // labelMessage: '这是一个提示',
      component: 'NInput',
      label: '用户名',
      componentProps: {
        placeholder: '请输入用户名',
      },
      // rules: [{ required: true, message: '请输入用户名', trigger: ['blur'] }],
    },
    {
      field: 'email',
      component: 'NInput',
      label: '注册邮箱',
      componentProps: {
        placeholder: '请输入邮箱',
        showButton: false,
      },
    },
    {
      field: 'type',
      component: 'NSelect',
      label: '角色类型',
      componentProps: {
        placeholder: '请选择类型',
        options: []
      },
    },
    {
      field: 'available',
      component: 'NRadioGroup',
      label: '用户状态',
      componentProps: {
        options: [
          {
            label: '正常',
            value: 1,
          },
          {
            label: '封禁',
            value: 0,
          },
        ]
      },
    },
  ];

  const router = useRouter();
  const formRef: any = ref(null);
  const actionRef = ref();
  const response = ref(null);
  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const formParams = reactive({
    username: '',
    password: '',
    email: '',
    type: '',
    available: true,
  });
  const dataform = ref();
  const actionColumn = reactive({
    width: 220,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '删除',
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['basic_list'],
          },
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true;
            },
            auth: ['basic_list'],
          },
        ],
        dropDownActions: [
          {
            label: '启用',
            key: 'enabled',
            // 根据业务控制是否显示: 非enable状态的不显示启用按钮
            ifShow: () => {
              return true;
            },
          },
          {
            label: '禁用',
            key: 'disabled',
            ifShow: () => {
              return true;
            },
          },
        ],
        select: (key) => {
          window['$message'].info(`您点击了，${key} 按钮`);
        },
      });
    },
  });

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
  });

  function addTable() {
    showModal.value = true;
  }

  const loadDataTable = async (res) => {
    const rese = await getUsers({ ...getFieldsValue(), ...res });
    return rese.data;
  };

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  function reloadTable() {
    actionRef.value.reload();
  }

  async function confirmForm(e) {
    e.preventDefault();
    formParams.available = formParams.available ? 1 : 0;
    console.log(formParams)
    formBtnLoading.value = true;
    formRef.value.validate(async (errors) => {
      if (!errors) {
        const response = await addUser(formParams);
        if(response.code == ResultEnum.SUCCESS){
            window['$message'].success('新建成功');
          setTimeout(() => {
            showModal.value = false;
            reloadTable();
        });
        }
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  }

  function handleEdit(record: Recordable) {
    console.log('点击了编辑', record);
    router.push({ name: 'basic-info', params: { id: record.id } });
  }

  function handleDelete(record: Recordable) {
    console.log('点击了删除', record);
    window['$message'].info('点击了删除');
  }

  async function handleSubmit(values: Recordable) {
  // 检查 actionRef 是否存在且包含 getPaginationInfo 函数

    const paginationInfo = actionRef.value.pagination;

        // 提取 page 和 pageSize
    const { page, pageSize } = paginationInfo;

// 将分页信息与其他参数合并传递给 getUsers 函数
    const response = await getUsers({ ...values, page, pageSize });

    // 处理 response，更新数据等
    dataform.value = response.data;
    reloadTable();
}


  function handleReset(values: Recordable) {
    console.log(values);
  }

  
  onMounted(async () => {
    try {
      response.value = await getIds();

      // 将角色列表转换为 NSelect 组件的选项格式
      const roleOptions = response.value.data.map((role) => ({
        label: role.roleDescription,
        value: role.roleId
      }));
// 在formParams.type中更新options
      formParams.type = roleOptions[0].value; // 如果需要，可以设置默认值
      options.value = roleOptions;
      // 找到角色类型字段的 schema 索引
      const roleTypeSchemaIndex = schemas.findIndex((schema) => schema.field === 'type');

      // 如果找到了角色类型字段的 schema，则将角色选项设置到 componentProps.options 中
      if (roleTypeSchemaIndex !== -1) {
        schemas[roleTypeSchemaIndex].componentProps.options = roleOptions;
      }
    } catch (error) {
      console.error('获取角色数据失败', error);
    }
  });

</script>

<style lang="less" scoped></style>
