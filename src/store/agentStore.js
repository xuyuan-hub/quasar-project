import { nextTick, ref } from 'vue'
import { getCurrentDateTime } from 'src/assets/js/base-function'

const messages = ref([])
const QwenMsgs = ref([])
const agentStore = ref({})
const currentPageIndex = ref([])
const selectedData = ref([])
const selectedFolder = ref()
const displayDetails = ref()

const agentMsgControl = {
    pushMsg(content, role) {
        const key = getCurrentDateTime()
        messages.value.push({ role: role, content: content, key })
    },
    popMsg() {
        if (messages.value.length > 0) {
            return messages.value.pop();
        }
        else {
            return false
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
        return messages.value[index]
    },
    getMsgs() {
        return messages.value
    },
    removeMsg(index) {

    },
    removeMsgs() {
        messages.value = []
        currentPageIndex.value = []
    }
}

const agentQwenMsgControl = {
    pushMsg(content, role) {
        QwenMsgs.value.push({ role: role, content: content })
    },
    popMsg() {
        if (QwenMsgs.value.length > 0) {
            return QwenMsgs.value.pop();
        }
        else {
            return false
        }
    },
    removeFirstMsg() {
        if (QwenMsgs.value.length > 0) {
            QwenMsgs.value.shift();
        }
    },
    getMsg(index) {
        return QwenMsgs.value[index]
    },
    getMsgs() {
        return QwenMsgs.value
    },
    removeMsg(index) {

    },
    removeMsgs() {
        QwenMsgs.value = []
        currentPageIndex.value = []
    },
}

const agentStoreContorl = {
    pushFile(file) {
        if (file) {
            agentStore.value['file'] = file
        }
    },
    getFile() {
        if (agentStore.value['file']) {
            return agentStore.value['file']
        }
        else {
            return false
        }
    }
}

const agentInteractionControl = {
    getSelectedItems() {
        return selectedData.value
    },
    updateSelectedItem(items) {
        selectedData.value = items
    },
    getSelectedFolder() {
        return selectedFolder
    },
    updateSelectedFolder(folder) {
        selectedFolder.value = folder
    },
    getDetailItem() {
        return displayDetails.value
    },
    updateDetailItem(item) {
        displayDetails.value = item
    }

}

export { agentMsgControl, agentStoreContorl, agentInteractionControl, agentQwenMsgControl }