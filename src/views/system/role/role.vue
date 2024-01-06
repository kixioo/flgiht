<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="角色权限管理">
      </n-card>
    </div>
    <n-card :bordered="false" class="mt-4 proCard">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
      >
      <template #tableTitle>
        <n-button type="primary" @click="addTable">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建角色
        </n-button>
      </template>

        <template #action>
          <TableAction />
        </template>
      </BasicTable>
    </n-card>

    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" :title="editRoleTitle">
      <div class="py-3 menu-list">
        <n-tree
          block-line
          cascade
          checkable
          :virtual-scroll="true"
          :data="treeData"
          :expandedKeys="expandedKeys"
          :checked-keys="checkedKeys"
          ref = "TreeSelectInstInstRef"
          style="max-height: 950px; overflow: hidden"
          @update:checked-keys="checkedTree"
          @update:expanded-keys="onExpandedKeys"
        />
      </div>
      <template #action>
        <n-space>
          <n-button type="info" ghost icon-placement="left" @click="packHandle">
            全部{{ expandedKeys.length ? '收起' : '展开' }}
          </n-button>

          <n-button type="info" ghost icon-placement="left" @click="checkedAllHandle">
            全部{{ checkedAll ? '取消' : '选择' }}
          </n-button>
          <n-button type="primary" :loading="formBtnLoading" @click="confirmForm">提交</n-button>
        </n-space>
      </template>
    </n-modal>

    <n-modal v-model:show="showModals" :show-icon="false" preset="dialog" title="新建角色">
      <n-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="80"
        class="py-4"
      >
        <n-form-item label="角色名称" path="roleName">
          <n-input placeholder="请输入角色名称" v-model:value="formParams.roleName" />
        </n-form-item>
        <n-form-item label="角色说明" path="roleDescription">
          <n-input type="textarea" placeholder="请输入角色说明" v-model:value="formParams.roleDescription" />
        </n-form-item>
        <n-form-item label="是否设置为默认角色" path="isDefault">
          <n-switch v-model:value="formParams.isDefault" />
        </n-form-item>
        <n-form-item label="角色是否启用" path="status">
          <n-switch v-model:value="formParams.status" />
        </n-form-item>
        <div class="py-3 menu-list">
        <n-tree
          block-line
          cascade
          checkable
          :virtual-scroll="true"
          :data="treeData"
          ref = "TreeSelectInstInstRef"
          style="max-height: 950px; overflow: hidden"
        />
      </div>
      </n-form>
      <template #action>
        <n-space>
          <n-button @click="() => (showModals = false)">取消</n-button>
          <n-button type="info" :loading="newForBtnLoading" @click="newConfirmForm">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, unref, h, onMounted } from 'vue';
  import { useMessage,TreeSelectInst ,useDialog,type FormRules} from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import { getRoleList ,disableRole , enableRole, addRole} from '@/api/system/role';
  import { getMenuList, updateMenuList} from '@/api/system/menu';
  import { columns } from './columns';
  import { getTreeAll } from '@/utils';
  import { ResultEnum } from '@/enums/httpEnum';
  import { PlusOutlined } from '@vicons/antd';
  const message = useMessage();
  const TreeSelectInstInstRef = ref<TreeSelectInst | null>(null)
  const actionRef = ref();
  const showModal = ref(false);
  const showModals = ref(false);
  const formBtnLoading = ref(false);
  const newForBtnLoading = ref(false)
  const checkedAll = ref(false);
  const editRoleTitle = ref('');
  const treeData = ref([]);
  const expandedKeys = ref([]);
  const checkedKeys = ref(['console', 'step-form']);
  const handleRoleId = ref();
  const formRef: any = ref(null);
  const params = reactive({
    pageSize: 5,
  });
  const formParams = reactive({
    roleName: '',
    roleDescription: '',
    isDefault: false,
    status: true
  });
  const rules: FormRules = {
    roleName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入名称',
    },
    roleDescription: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入角色描述',
    }
  };
  const dialog = useDialog();
  const actionColumn = reactive({
    width: 250,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      const disableLabel = record.status === 1 ? '禁用' : '启用';
      return h(TableAction, {
        style: 'button',
        actions: [
          {
            label: '菜单权限',
            onClick: handleMenuAuth.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['dashboard'],
          },
          {
            label: disableLabel,
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['dashboard'],
          },
        ],
      });
    },
  });

  function addTable() {
    showModals.value = true;
  }
  const loadDataTable = async (res: any) => {
    let _params = {
      ...unref(params),
      ...res,
    };
    const refe = await  getRoleList(_params);
    return refe.data;
  };

  function onCheckedRow(rowKeys: any[]) {
    console.log(rowKeys);
  }

  function reloadTable() {
    actionRef.value.reload();
  }


  function handleMenuAuth(record: Recordable) {
    editRoleTitle.value = `分配 ${record.roleName} 的菜单权限`;
    checkedKeys.value = record.menuList;
    showModal.value = true;
    handleRoleId.value = record.roleId;
  }

  function newConfirmForm(e) {
  e.preventDefault();
  newForBtnLoading.value = true;
  formRef.value.validate(async (errors) => {
    if (!errors) {
      const menuList = TreeSelectInstInstRef.value?.getCheckedData().keys;

      // 将 formParams 和 checkedDatas 合并到一个对象中
      const formData = {
        ...formParams,
        isDefault: formParams.isDefault ? 1 : 0, // 转换为数字
        status: formParams.status ? 1 : 0,       // 转换为数字
        menuList,
      };
      
      const response = await addRole(formData);
      if(response.code == ResultEnum.SUCCESS){
        console.log(formData);
        window['$message'].success('新建成功');
        setTimeout(() => {
          showModals.value = false;
          reloadTable();
        });
      }else{
        window['$message'].error('失败请稍后再试');
      }
      
    } else {
      window['$message'].error('请填写完整信息');
    }
    newForBtnLoading.value = false;
  });
}



  function confirmForm(e: any) {
    e.preventDefault();
    formBtnLoading.value = true;
    setTimeout(async () => {
      showModal.value = false;
      const checkedData = TreeSelectInstInstRef.value?.getCheckedData().keys;

        const filteredKeys = checkedData.filter(item => typeof item === 'string');
        const combinedKeys = [...filteredKeys.filter(item => typeof item === 'string')];
        console.log('Filtered Keys:', combinedKeys,handleRoleId.value);//获取到更新后menu表了，现在需要传给后台处理

      // 构建请求数据
      const requestData = {
        menuKeys: combinedKeys,
        roleId: handleRoleId.value,
      };
      console.log(requestData)

      const response = await updateMenuList(requestData);
      console.log(response)
      if(response.code == ResultEnum.SUCCESS){
        message.success('更改权限成功');
        reloadTable();
        formBtnLoading.value = false;
      }else{
        message.success('更改权限失败');
      }
    }, 200);
  }


  function handleDelete(record: Recordable) {
    if(record.status == 1 ){
      dialog.warning({
          title: '确认禁用该账号',
          content: '你确定？',
          positiveText: '确定',
          negativeText: '不确定',
          onPositiveClick: async () => {
            const response = await disableRole({ roleId: record.roleId });
            if(response.code == ResultEnum.SUCCESS){
              message.success('禁用成功');
              reloadTable();
            }else{
              message.error("网络问题，请重试")
            } 
          },
        })
    }
    if(record.status == 0){
      dialog.warning({
          title: '确认启用该账号',
          content: '你确定？',
          positiveText: '确定',
          negativeText: '不确定',
          onPositiveClick: async () => {
            const response = await enableRole({ roleId: record.roleId });
            if(response.code == ResultEnum.SUCCESS){
              message.success('启用成功');
              reloadTable();
            }else{
              message.error("网络问题，请重试")
            } 
          },
        })
    }
    
  }




  function checkedTree(keys) {
    checkedKeys.value = [checkedKeys.value, ...keys];
  }

  function onExpandedKeys(keys) {
    expandedKeys.value = keys;
  }

  function packHandle() {
    if (expandedKeys.value.length) {
      expandedKeys.value = [];
    } else {
      expandedKeys.value = treeData.value.map((item: any) => item.key) as [];
    }
  }

  function checkedAllHandle() {
    if (!checkedAll.value) {
      checkedKeys.value = getTreeAll(treeData.value);
      checkedAll.value = true;
    } else {
      checkedKeys.value = [];
      checkedAll.value = false;
    }
  }

  onMounted(async () => {
    const treeMenuList = await getMenuList();
    expandedKeys.value = treeMenuList.data.map((item) => item.key);
    treeData.value = treeMenuList.data;
    console.log(treeData.value)
  });
</script>

<style lang="less" scoped></style>