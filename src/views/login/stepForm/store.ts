
import { ref } from 'vue';

interface FormData {
  email: string | null;
  username: string | null;
  password: string | null;
  code: string | null;
}

export const formData = ref<FormData>({
  email: null,
  username: null,
  password: null,
  code: null
});

export function resetFormData() {
  formData.value = {
    email: null,
    username: null,
    password: null,
    code: null
  };
}
