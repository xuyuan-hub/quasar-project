import { ref } from "vue";

// 定义缓存对象
const webCache = ref({});

// 缓存控制对象
const webCacheControl = {
  // 设置缓存
  set(key, value) {
    webCache.value[key] = value;
  },
  // 获取缓存
  get(key) {
    return webCache.value[key];
  },
  // 根据值获取键
  getKeyByValue(value) {
    for (const [key, val] of Object.entries(webCache.value)) {
      if (val === value) {
        return key;
      }
    }
    return null; // 如果没有找到对应的键，返回 null
  },
  // 删除缓存
  delete(key) {
    if (webCache.value.hasOwnProperty(key)) {
      delete webCache.value[key];
    }
  },
  // 清空缓存
  clear() {
    webCache.value = {};
  },
};

export { webCache, webCacheControl };
