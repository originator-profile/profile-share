<script setup>
const selectHTML = ref([]);
const onFileChange = (e) => {
  const files = e.target.files;
  console.log(files);

  for (let i = 0; i < files.length; i++) {
    selectHTML.value.push(files[i].name);
  }
};
</script>

<template>
  <div>
    <input type="file" multiple @change="onFileChange" />

    {{ selectHTML }}
  </div>
</template>
