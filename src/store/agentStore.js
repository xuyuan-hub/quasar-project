import { nextTick, ref } from "vue";
import { getCurrentDateTime } from "src/assets/js/base-function";

const messages = ref([]);
const QwenMsgs = ref([
  {
    role: "user",
    content: `# 角色
你是一位资深的前端工程师，擅长使用Vue 3、Quasar、GSAP、Floating-UI和Three.js等技术栈来创建美观且功能强大的前端界面。你的任务是根据用户的需求，利用这些工具和技术生成高质量的前端代码。

## 技能
### 技能1: 界面设计与实现
- 根据用户的具体需求，设计并实现美观且响应式的前端界面。
- 使用Vue 3作为主要框架，结合Quasar组件库来快速构建用户界面。
- 利用GSAP进行动画效果的添加，以增强用户体验。
- 通过Floating-UI实现复杂的浮动元素布局，确保界面在不同设备上的兼容性。
- 运用Three.js为项目添加3D图形或动画，提升视觉吸引力。

### 技能2: 代码优化与维护
- 编写清晰、可维护的代码，并遵循最佳实践。
- 对现有代码进行审查和重构，提高性能和可读性。
- 处理可能出现的各种浏览器兼容性问题，确保跨平台的一致性表现。

## 限制
- 只讨论与前端开发相关的话题，特别是围绕Vue 3、Quasar、GSAP、Floating-UI及Three.js的应用。
- 在编写代码时，需考虑代码的可读性和维护性，同时保证其高效运行，和vue相关的代码用&lt;script setup&gt; 这类风格。
- 当遇到特定的技术难题或需要额外资源（如特定插件）时，请明确指出并建议解决方案。
- 不得提供任何违反版权法或开源协议的代码示例。

## 已有插件
- Quasar、GSAP、Floating-UI及Three.js,在使用已有插件时请直接给出代码，而不需要安装步骤
`,
  },
]);
const agentStore = ref({});
const currentPageIndex = ref([]);
const selectedData = ref([]);
const selectedFolder = ref();
const displayDetails = ref();

const agentMsgControl = {
  pushMsg(content, role) {
    const key = getCurrentDateTime();
    messages.value.push({ role: role, content: content, key });
  },
  popMsg() {
    if (messages.value.length > 0) {
      return messages.value.pop();
    } else {
      return false;
    }
  },
  removeFirstMsg() {
    if (messages.value.length > 0) {
      messages.value.shift();
    }
  },
  changeMsg(content, index) {
    if (index >= 0 && index < messages.value.length) {
      messages.value[index].content = content;
    } else {
      console.warn("Invalid index");
    }
  },
  getMsg(index) {
    return messages.value[index];
  },
  getMsgs() {
    return messages.value;
  },
  removeMsg(index) {},
  removeMsgs() {
    messages.value = [];
    currentPageIndex.value = [];
  },
};

const agentQwenMsgControl = {
  pushMsg(content, role) {
    QwenMsgs.value.push({ role: role, content: content });
  },
  popMsg() {
    if (QwenMsgs.value.length > 0) {
      return QwenMsgs.value.pop();
    } else {
      return false;
    }
  },
  removeFirstMsg() {
    if (QwenMsgs.value.length > 0) {
      QwenMsgs.value.shift();
    }
  },
  getMsg(index) {
    return QwenMsgs.value[index];
  },
  getMsgs() {
    return QwenMsgs.value;
  },
  removeMsg(index) {},
  removeMsgs() {
    QwenMsgs.value = [];
    currentPageIndex.value = [];
  },
};

const agentStoreContorl = {
  pushFile(file) {
    if (file) {
      agentStore.value["file"] = file;
    }
  },
  getFile() {
    if (agentStore.value["file"]) {
      return agentStore.value["file"];
    } else {
      return false;
    }
  },
};

const agentInteractionControl = {
  getSelectedItems() {
    return selectedData.value;
  },
  updateSelectedItem(items) {
    selectedData.value = items;
  },
  getSelectedFolder() {
    return selectedFolder;
  },
  updateSelectedFolder(folder) {
    selectedFolder.value = folder;
  },
  getDetailItem() {
    return displayDetails.value;
  },
  updateDetailItem(item) {
    displayDetails.value = item;
  },
};

export {
  agentMsgControl,
  agentStoreContorl,
  agentInteractionControl,
  agentQwenMsgControl,
};
