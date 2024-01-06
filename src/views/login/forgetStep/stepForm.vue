<template>
  <div class="view-account">
    <div class="view-account-container">
      <div class="view-account-top">
          <div class="view-account-top-logo">
            <img :src="websiteConfig.loginImage" alt="" />
          </div>
          <div class="view-account-top-desc">{{ websiteConfig.loginDesc }}</div>
      </div>
  
  
      <div class="view-account-form">
        <n-card :bordered="false" class="mt-4 proCard">
          <n-space vertical class="steps" justify="center">
            <n-steps :current="currentTab" :status="currentStatus">
              <n-step title="邮箱找回" description="请填写注册邮箱" />
              <n-step title="填写邮箱验证码" description="确认信息" />
              <n-step title="找回密码啦" description="恭喜您,重置密码成功！" />
            </n-steps>
            <step1 v-if="currentTab === 1" @next-step="nextStep" />
            <step2 v-if="currentTab === 2" @next-step="nextStep" @prevStep="prevStep" />
            <step3 v-if="currentTab === 3" @prev-step="prevStep" @finish="finish" />
          </n-space>
        </n-card>
      </div>
    </div>
  </div>
  
  
  </template>
  
  <script setup>
    import { defineComponent, ref } from 'vue';
    import step1 from './Step1.vue';
    import step2 from './Step2.vue';
    import step3 from './Step3.vue';
    import router from '@/router';
    import { websiteConfig } from '@/config/website.config';
    import { useUserStore } from '@/store/modules/user';
  
    const currentTab = ref(1);
    const currentStatus = ref('process');
    const userStore = useUserStore();
  
  
    function nextStep() {
      if (currentTab.value < 3) {
        currentTab.value += 1;
      }
    }
  
    function prevStep() {
      if (currentTab.value > 1) {
        currentTab.value -= 1;
      }
    }
  
    function finish() {
      router.replace("/login?redirect=/dashboard")
    }
  </script>
  
  <style lang="less" scoped>
    .view-account {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: auto;
  
      &-container {
        flex: 1;
        padding: 32px 12px;
        max-width: 384px;
        min-width: 320px;
        margin: 0 auto;
      }
  
      &-top {
        padding: 32px 0;
        text-align: center;
  
        &-desc {
          font-size: 14px;
          color: #808695;
        }
      }
  
      &-other {
        width: 100%;
      }
  
      .default-color {
        color: #515a6e;
  
        .ant-checkbox-wrapper {
          color: #515a6e;
        }
      }
    }
    
    .view-account-top {
    height: 80px; /* 设置 .view-account-top 的高度，可以根据需要调整 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  
  .view-account-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 32px 12px;
    max-width: 100%;
    margin: 0 auto;
    margin-top: -100px; /* 负值表示往上移动，可以根据需要调整 */
  }
  
  .view-account-form {
    width: 100%;
    max-width: 800px;
  }
  
  
    @media (min-width: 768px) {
      .view-account {
        background-image: url('../../assets/images/login.svg');
        background-repeat: no-repeat;
        background-position: 50%;
        background-size: 100%;
      }
  
      .page-account-container {
        padding: 32px 0 24px 0;
      }
    }
  </style>
  