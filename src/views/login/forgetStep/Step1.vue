<template>
  <n-form ref="formRef" :model="model" :rules="rules">
    <n-form-item path="email" label="邮箱">
      <n-input v-model:value="model.email" @keydown.enter.prevent />
    </n-form-item>

    <n-form-item path="password" label="新密码">
      <n-input
        v-model:value="model.password"
        type="password"
        @input="handlePasswordInput"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item
      ref="rPasswordFormItemRef"
      first
      path="reenteredPassword"
      label="请再次输入密码"
    >
      <n-input
        v-model:value="model.reenteredPassword"
        :disabled="!model.password"
        type="password"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
        :disabled="remainingTime > 0"
        round
        type="primary"
        @click="handleValidateButtonClick"
  >
    {{ remainingTime > 0 ? `等待 ${remainingTime} 秒` : '发送验证码' }}
  </n-button>
        </div>
      </n-col>
    </n-row>
  </n-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FormInst, FormItemInst, FormItemRule, useMessage, FormRules } from 'naive-ui';
import {formData}  from './store';
import { useUserStore } from '@/store/modules/user';
import { ResultEnum } from '@/enums/httpEnum';
const emit = defineEmits(['nextStep']);
const remainingTime = ref(0);
interface ModelType {
  email: string | null;
  password: string | null;
  reenteredPassword: string | null;
}

const formRef = ref<FormInst | null>(null);
const rPasswordFormItemRef = ref<FormItemInst | null>(null);
const message = useMessage();
const model = ref<ModelType>({
  email: formData.value.email,
  password: formData.value.password,
  reenteredPassword: formData.value.password
});
const userStore = useUserStore();


function validatePasswordStartWith(rule: FormItemRule, value: string): boolean {
  return (
    !!model.value.password &&
    model.value.password.startsWith(value) &&
    model.value.password.length >= value.length
  );
}

function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === model.value.password;
}

const rules: FormRules = {
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
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: ['input', 'blur']
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码'
    }
  ],
  reenteredPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur']
    },
    {
      validator: validatePasswordStartWith,
      message: '两次密码输入不一致',
      trigger: 'input'
    },
    {
      validator: validatePasswordSame,
      message: '两次密码输入不一致',
      trigger: ['blur', 'password-input']
    }
  ]
};

function handlePasswordInput() {
  if (model.value.reenteredPassword) {
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' });
  }
}
function handleValidateButtonClick() {
    if (remainingTime.value === 0) {
        // 启动计时器，每秒减少 remainingTime
        remainingTime.value = 60;
        const timer = setInterval(() => {
            remainingTime.value -= 1;
            if (remainingTime.value === 0) {
                clearInterval(timer);
            }
        }, 1000);

        // 这里可以添加发送验证码的逻辑
        // 比如调用发送验证码的函数
        sendVerificationCode()
            .then((result) => {
                if (result === 1) {
                    message.success('发送成功！请注意查收');
                }
            })
            .catch((error) => {
                // 处理发送失败的情况
                console.error('发送失败，返回值为:', error);
                remainingTime.value =0;
            });
    }
}


async function sendVerificationCode() {
    return new Promise((resolve, reject) => {
        formData.value.email = model.value.email;
        formData.value.password = model.value.password;
        formData.value.code = null;

        formRef.value?.validate(async (errors) => {
            if (!errors) {
                const { code, msg } = await userStore.forget(formData.value);
                console.log("code",code)
                if (code === ResultEnum.SUCCESS) {
                    emit('nextStep');
                    resolve(1);
                } else {
                    message.info(msg);
                    reject(0);
                }
            } else {
                message.error('验证失败');
                reject(0);
            }
        });
    });
}
// function handleValidateButtonClick(e: MouseEvent) {
//   formData.value.email = model.value.email;
//   formData.value.username = model.value.username;
//   formData.value.password =model.value.password;
//   formData.value.code = null;
//   e.preventDefault();
//   formRef.value?.validate(async (errors) => {
//     if (!errors) {
//       const {code, msg } = await userStore.register(formData.value);
//       if(code == ResultEnum.SUCCESS){
//         message.success('发送成功！请注意查收');
//         emit('nextStep');
//       }else{
//         message.info(msg);
//       }


//     } else {
//       console.log(errors);
//       message.error('验证失败');
//     }
//   });
// }
</script>
