<template>
  <n-form
    :label-width="90"
    :model="formValue"
    :rules="rules"
    label-placement="left"
    ref="form2Ref"
    style="max-width: 500px; margin: 40px auto 0 80px"
  >
    <n-form-item label="邮箱：" path="email">
      <span v-text=formData.email></span>
    </n-form-item>
    <n-form-item label="用户名：" path="username">
      <span v-text=formData.username></span>
    </n-form-item>
    <n-form-item label="密码" path="password">
      <span v-text=formData.password></span>
    </n-form-item>
    <n-divider />
    <n-form-item label="验证码" path="code">
      <n-input type="text" v-model:value="formData.code" />
    </n-form-item>
    <div style="margin-left: 80px">
      <n-space>
        <n-button type="primary" :loading="loading" @click="formSubmit">提交</n-button>
        <n-button @click="prevStep">上一步</n-button>
      </n-space>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
  import { ref, defineEmits } from 'vue';
  import { useMessage } from 'naive-ui';
  import {formData}  from './store';
  import { useUserStore } from '@/store/modules/user';
  import { ResultEnum } from '@/enums/httpEnum';
  const form2Ref: any = ref(null);
  const message = useMessage();
  const loading = ref(false);

  const formValue = ref({
    password: '086611',
  });

  const rules = {
    password: {
      required: true,
      message: '请输入验证码',
      trigger: 'blur',
    },
  };
  const userStore = useUserStore();
  const emit = defineEmits(['prevStep', 'nextStep']);

  function prevStep() {
    emit('prevStep');
  }

  function formSubmit() {
    loading.value = true;
    form2Ref.value.validate(async (errors) => {
      if (!errors) {
        const {code, msg} = await userStore.verify(formData.value);
        if(code == ResultEnum.SUCCESS){
        message.success('验证成功');
        setTimeout(() => {
          emit('nextStep');
        }, 1500);
        }else{
          loading.value = false;
          message.info(msg || '验证失败');
        }
        
      } else {
        loading.value = false;
        message.error('验证失败，请填写完整信息');
      }
    });
  }
</script>
