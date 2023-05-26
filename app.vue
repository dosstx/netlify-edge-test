<template>
  <div>
    <button type="button" @click="apiTest">API request</button>
    {{ hello }}
  </div>
</template>

<script setup>
const hello = ref('')
const apiTest = async () => {
  const { data } = await useFetch('api/hello')
  hello.value = data.value
}
</script>
