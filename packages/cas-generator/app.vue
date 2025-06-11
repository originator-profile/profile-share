<template>
  <div class="container h-dvh flex flex-col py-4 gap-y-4">
    <div class="jumpu-card p-4 shrink-0">
      <h2 class="font-bold text-2xl mb-2">Generate Content Attestation Set</h2>
      <div class="flex items-center gap-x-4">
        <div class="grow">
          <div class="text-sm flex gap-x-4">
            <div class="jumpu-card p-4">
              <div class="text-sm">CAS 生成済み</div>
              <span class="text-2xl font-semibold"> {{ body.length }}</span> /
              {{ selectedFiles.length }}
            </div>
            <div class="jumpu-card p-4 text-green-700">
              <div class="text-sm flex items-center gap-x-1">
                <Icon name="material-symbols:check-rounded" class="text-xl" />
                Successed
              </div>
              <span class="text-2xl font-semibold">
                {{ successed.length }}</span
              >
              /
              {{ selectedFiles.length }}
            </div>
            <div class="jumpu-card p-4 text-amber-600">
              <div class="text-sm flex items-center gap-x-1">
                <Icon
                  name="mage:exclamation-triangle-fill"
                  class="text-xl"
                />Warning
              </div>
              <span class="text-2xl font-semibold"> {{ failed.length }}</span>
              /
              {{ selectedFiles.length }}
            </div>
            <div class="self-end">
              <button
                @click="setting = !setting"
                class="jumpu-text-button inline-flex items-center gap-x-1"
              >
                <Icon name="uil:cog" class="text-xl" />
                Settings
              </button>
            </div>
          </div>
          <progress
            class="w-full h-2"
            max="100"
            :value="
              selectedFiles.length > 0
                ? (body.length / selectedFiles.length) * 100
                : 0
            "
          ></progress>
        </div>
        <div class="shrink-0">
          <p>
            <button
              class="jumpu-button inline-flex items-center gap-x-2"
              @click="fetchChatStream(selectedFiles)"
              :disabled="generating || selectedFiles.length === 0"
            >
              <span v-if="!generating"
                >生成を始める ({{ selectedFiles.length }}件)</span
              >
              <div class="flex items-center gap-x-2" v-else>
                <div class="jumpu-spinner w-4 h-4">
                  <svg viewBox="25 25 50 50">
                    <circle cx="50" cy="50" r="20"></circle>
                  </svg>
                </div>
                <span>生成中...</span>
              </div>
            </button>
          </p>
        </div>
      </div>
    </div>
    <section class="grow shrink overflow-y-auto" ref="scrollSection">
      <table class="w-full relative">
        <thead class="sticky top-0 bg-white shadow-xs z-10">
          <tr class="table-row">
            <th class="w-10">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleAllSelection"
                  class="checkbox"
              /></label>
            </th>
            <th>File name</th>
            <th>status</th>
            <th>title</th>
            <th class="">VC resource path</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="table-row"
            v-for="(file, index) in htmlfiles"
            :key="file.cas || index"
          >
            <td class="text-center">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  :checked="selectedFileIds.has(file.cas)"
                  @change="toggleFileSelection(file.cas)"
                  class="checkbox"
                />
              </label>
            </td>
            <td class="">
              <div class="line-clamp-2" :title="file.cas">{{ file.cas }}</div>
            </td>
            <td>
              <div class="w-16 text-xl text-center">
                <span v-if="!getBodyItemByFile(file)" class="text-gray-400"
                  >-</span
                >
                <span
                  v-else-if="!getBodyItemByFile(file).error"
                  class="text-green-700"
                >
                  <Icon
                    name="material-symbols:check-rounded"
                    class="text-success"
                  />
                </span>
                <span v-else class="text-amber-600">
                  <Icon name="mage:exclamation-triangle-fill" />
                </span>
              </div>
            </td>
            <td>
              <div :title="file.title" class="line-clamp-2">
                {{ file.title }}
              </div>
            </td>
            <td class="">
              <div :title="file.vc_path">
                {{ file.vc_path }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <div
      v-if="setting"
      class="jumpu-card p-4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-95"
    >
      <h2 class="font-bold text-2xl mb-2">Settings</h2>

      <table class="w-full">
        <tr
          class="table-row"
          v-for="item in Object.entries(settingItems)"
          :key="item"
        >
          <td>{{ item[0] }}</td>
          <td>{{ item[1] }}</td>
        </tr>
      </table>

      <button
        class="jumpu-icon-button absolute top-4 right-4"
        @click="setting = false"
      >
        <Icon name="material-symbols:close-rounded" class="text-xl" />
      </button>
    </div>
  </div>
</template>

<script setup>
const scrollSection = ref(null);
const body = ref([]);
const generating = ref(false);
const setting = ref(false);
const selectedFileIds = ref(new Set());

const { data: settingItems } = useFetch("/api/settings");

// 選択されたファイルを取得するcomputed
const selectedFiles = computed(() => {
  if (!htmlfiles.value) return [];
  return htmlfiles.value.filter((file) => selectedFileIds.value.has(file.cas));
});

// 全選択状態をチェックするcomputed
const isAllSelected = computed(() => {
  if (!htmlfiles.value || htmlfiles.value.length === 0) return false;
  return htmlfiles.value.every((file) => selectedFileIds.value.has(file.cas));
});

// ファイル選択状態をトグルする関数
function toggleFileSelection(fileId) {
  if (selectedFileIds.value.has(fileId)) {
    selectedFileIds.value.delete(fileId);
  } else {
    selectedFileIds.value.add(fileId);
  }
}

// 全選択/全解除をトグルする関数
function toggleAllSelection() {
  if (!htmlfiles.value) return;

  if (isAllSelected.value) {
    // 全解除
    selectedFileIds.value.clear();
  } else {
    // 全選択
    htmlfiles.value.forEach((file) => {
      selectedFileIds.value.add(file.cas);
    });
  }
}

async function fetchChatStream(prompt, callback) {
  generating.value = true;
  const response = await fetch("http://localhost:4000/cas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prompt), // このprompt変数を使ってサーバ側でAPI callする
  });
  const reader = response.body.getReader();
  if (!reader) return;

  let decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    const lines = decoder.decode(value);
    console.log(lines);
    const resData = JSON.parse(lines.trim().replace("data:", ""));
    console.log(resData);
    body.value.push(resData);
  }
}

const successed = computed(() => body.value.filter((item) => !item.error));
const failed = computed(() => body.value.filter((item) => item.error));

function getBodyItemByFile(file) {
  return body.value.find((item) => item.cas === file.cas);
}

const { data: htmlfiles, status } = useFetch("/api/htmlFiles/get");
</script>

<style scoped>
@reference "./assets/css/tailwind.css";
.table-row {
  @apply text-xs font-mono border-b border-gray-100 py-2;
  td,
  th {
    @apply py-0.5 px-3 border-r border-gray-100;
  }
}
thead {
  th {
    @apply text-gray-600 font-normal text-left;
  }
}
.checkbox-label {
  @apply p-2 flex justify-center aspect-square rounded hover:bg-gray-200;
}
</style>
