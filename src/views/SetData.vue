<script setup lang="ts">
import { reactive, ref, watch, watchEffect } from 'vue'
import type { FormInstance, FormItemRule, FormRules } from 'element-plus'
import { useListStore } from '@/stores/list'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import type { Item } from '@/types/store'
const store = useListStore()
const router = useRouter()
const route = useRoute()

const formModel = ref<Item>({ content: '', title: '' })
const formEl = ref<FormInstance>()
const rules = reactive<FormRules<Item>>({
  title: [{ required: true, message: 'please input title' }],
  content: [{ required: true, message: 'please input title' }]
})
const id = ref(route.params.id as string)

function initFormModel() {
  if (id.value) {
    formModel.value = { ...(store.getItemById(id.value) as Item) }
  } else {
    formModel.value = { content: '', title: '' }
  }
}

initFormModel()
//从其它页面，浏览器返回按钮不触发 所以需要initFormModel()
/*watch(route, () => {
  initFormModel()
  console.log('route change')
})*/
onBeforeRouteUpdate((to) => {
  id.value = to.params.id
  initFormModel()
  console.log('onBeforeRouteUpdate')
})

function submit() {
  if (formModel.value.id) {
    store.setItem(formModel.value)
  } else {
    store.addItem(formModel.value)
  }
  router.push({ path: '/', query: { id: id.value } })
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      submit()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const menuActiveIndex = ref('')
</script>
<template>
  <el-container>
    <el-aside>
      <el-menu class="min-h-screen" :default-active="menuActiveIndex">
        <el-menu-item
          @click="router.push('/set/' + item.id)"
          v-for="item in store.list.filter((item) => item.title)"
          :key="item.id"
          :index="item.id"
        >
          {{ item.title }}
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <!--key useFor resetForm dynamic route-->
      <el-form class="max-w-2xl mx-auto" :key="id" :model="formModel" :rules="rules" ref="formEl">
        <el-form-item prop="title">
          <el-input v-model="formModel.title"></el-input>
        </el-form-item>
        <el-form-item prop="content">
          <el-input class="mt-5" type="textarea" rows="20" v-model="formModel.content"></el-input>
        </el-form-item>

        <div class="text-right mt-5">
          <el-button @click="resetForm(formEl)">Cancel</el-button>
          <el-button @click="submitForm(formEl)" type="primary"> Submit </el-button>
        </div>
      </el-form>
    </el-main>
  </el-container>
</template>
