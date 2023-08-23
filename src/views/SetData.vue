<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
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
const id = ref<string>(route.params.id as string)

function initFormModel() {
  if (id.value) {
    formModel.value = { ...(store.getItemById(id.value) as Item) }
  } else {
    formModel.value = { content: '', title: '' }
  }
}

initFormModel()
//从其它页面，浏览器返回按钮不触发 所以需要initFormModel()
watch(route, () => {
  id.value = route.params.id as string
  initFormModel()
  console.log('route change')
})
onBeforeRouteUpdate((to) => {})

function submit() {
  console.log(formModel.value)
  if (formModel.value.id) {
    store.setItem(formModel.value)
    router.push({ path: '/test/' + id.value })
  } else {
    let nid = store.addItem(formModel.value)
    router.push({ path: '/test/' + nid })
  }
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

const menuActiveIndex = computed(() => {
  return formModel.value.id || ''
})

function deleteItem() {
  store.delItem(id.value)
  router.replace(route.path.replace(id.value, ''))
}
</script>
<template>
  <el-container :key="id || 'key'">
    <el-aside>
      <el-menu :default-active="menuActiveIndex" class="min-h-screen" router>
        <el-menu-item
          v-for="item in store.list.filter((item) => item.title)"
          :key="item.id"
          :index="item.id"
          @click="router.push('/set/' + item.id)"
          @dblclick="router.push('/test/' + item.id)"
        >
          {{ item.title }}
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <!--key useFor resetForm dynamic route-->
      <el-form ref="formEl" :model="formModel" :rules="rules" class="max-w-2xl mx-auto">
        <el-form-item prop="title">
          <el-input v-model="formModel.title"></el-input>
        </el-form-item>
        <el-form-item prop="content">
          <el-input v-model="formModel.content" class="mt-5" rows="20" type="textarea"></el-input>
        </el-form-item>

        <div class="text-right mt-5">
          <el-button @click="resetForm(formEl)">Cancel</el-button>
          <el-popconfirm
            v-if="id"
            @confirm="deleteItem"
            width="250"
            title="Are you sure to delete this?"
          >
            <template #reference>
              <el-button type="danger">delete</el-button>
            </template>
          </el-popconfirm>
          <el-button type="primary" @click="submitForm(formEl)"> Submit </el-button>
        </div>
      </el-form>
    </el-main>
  </el-container>
</template>
