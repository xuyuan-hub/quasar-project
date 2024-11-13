import { ref, h } from "vue";
import { useRouter } from 'vue-router';
import OpenAI from "openai";
import { v4 as uuidv4, validate } from 'uuid';
import axios from "axios";
import { getProtectedObject, protectedUpload, updateDefinition, upload_file, ab1_seq_val } from "@/api/userApi"
import { QwenAgent, get_tree_definition } from "@/api/api";
import { agentInteractionControl, agentMsgControl, agentQwenMsgControl, agentStoreContorl } from "@/store/agentStore"
import { userControl } from "@/store/store";
import { downloadFileFromObject, parseTableFile, parseZipFile, getCurrentDateTime, generateExcel } from "./base-function";

import VisualizationTable from "@/components/webComponent/VisualizationTable.vue"
import VisualizationStr from "@/components/webComponent/VisualizationStr.vue"
import UserInfoComponent from "@/components/webComponent/UserInfoComponent.vue"
import ListDataComponent from "@/components/webComponent/ListDataComponent.vue";
import HelpComponent from "@/components/webComponent/HelpComponent.vue";
import JSZip from "jszip";
import { cacheDataControl, configControl } from "@/store/webCache";


const client = new OpenAI(
    {
        apiKey: "sk-c4aa479e83644440b77c48e82490a592",
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        dangerouslyAllowBrowser: true
    }
);

const tools = [
    // // 工具1 数据可视化
    // {
    //     type: "function",
    //     function: {
    //         name: "Visulization",
    //         description: "用来将多种数据可视化并将结果呈现给用户。",
    //         parameters: {
    //             data: {
    //                 type: "object",
    //                 description: "需要可视化的数据。['table','str']"
    //             },
    //             type: {
    //                 type: "string",
    //                 description: "传入的data的类型有['table','str']"
    //             }
    //         },
    //     }
    // },
    // 工具3 查看当前文件
    {
        type: "function",
        function: {
            name: "view_current_file",
            description: "查看当前缓存在浏览器里的文件。",
            parameters: {}
        }
    },
    //工具4 上传数据
    {
        type: "function",
        function: {
            name: "upload_data",
            description: "上传数据到服务器。",
            parameters: {}
        }
    },
    // //工具5 查看我的数据
    // {
    //     type: "function",
    //     function: {
    //         name: "view_my_data",
    //         description: "查看我的数据。查看上传数据。返回数据结构以及最多10条数据，可通过数据定义字段与用户的限定词获取筛选字段进行筛选。",
    //         parameters: {
    //             filters: {
    //                 type: "array",
    //                 description: "用来筛选数据的各类限定字段以键值对的形式存储[key:value,key:value],"
    //             }
    //         }
    //     }
    // },
    // 工具6 获取上传模板文件
    {
        type: "function",
        function: {
            name: "get_upload_template_xlsx",
            description: "获取上传表格模板文件。",
            parameters: {}
        }
    },
    // 工具7 查看我的信息
    {
        type: "function",
        function: {
            name: "view_my_info",
            description: "查看我的个人信息。",
            parameters: {
            }
        }
    },
    // 工具8 help
    {
        type: "function",
        function: {
            name: "help",
            description: "获取帮助。 help",
            parameters: {}
        }
    },
    // 工具11
    {
        type: "function",
        function: {
            name: "get_data",
            description: "从后端服务器获取数据的详细信息/查看详情/get detail of id。",
            parameters: {
                id: {
                    type: "string",
                    description: "各种数据对象的ID"
                }
            },
            required: ["id"]
        }
    },
    // 获取选中的数据
    {
        type: "function",
        function: {
            name: "get_selected_data",
            description: "获取用户在前端选中的数据。",
            parameters: {},
        }
    },
    {
        type: "function",
        function: {
            name: "get_selected_folder",
            description: "获取用户在前端选中的文件夹。",
            parameters: {},
        }
    },
    // 在页面缓存数据
    {
        type: "function",
        function: {
            name: "cache_data",
            description: "将目标数据缓存到前端以便后续调用",
            parameters: {
                name: {
                    type: "string",
                    description: "给缓存数据的命名"
                },
                data: {
                    type: "object",
                    description: "缓存的数据"
                }
            }
        }
    },
    // 获取缓存数据
    {
        type: "function",
        function: {
            name: "get_cache_data",
            description: "从页面的缓存里获取数据，如果当前页面没有缓存数据再尝试从服务器获取，即调用`get_data`",
            parameters: {
                name: {
                    type: "string",
                    description: "缓存数据的名字"
                }
            }
        }
    },
    // 获取当前时间
    {
        type: "function",
        function: {
            name: "get_current_time",
            description: "任何和当前时间有关的语句你都应该先调用此工具来获取当前的时间，根据反馈再自动调用后面工具。",
            parameters: {}
        }
    },
    {
        type: "function",
        function: {
            name: "ab1_sequence_validation",
            description: "一个用于进行 ab1 序列验证的程序",
            parameters: {}
        }
    },
    {
        type: "function",
        function: {
            name: "build_connection",
            description: "将不同对象建立关系的函数，用对象的`id`代表该对象，关系名由用户指出，可实现一对一，一对多的关系建立；面对多对多关系的建立，需要循环调用",
            parameters: {
                src_id: {
                    type: "string",
                    description: "源对象的`id`"
                },
                connection: {
                    type: "string",
                    description: "关系名",
                },
                des_ids: {
                    type: "list",
                    description: "目标对象`id`列表"
                }
            },
            required: ["src_id", "connection", "des_ids"]
        }
    },
    {
        type: "function",
        function: {
            name: "get_field_definition",
            description: "获取字段定义(关系)定义,在用户上传一些数据时，需要先检查相关数据的的field有没有被定义，如果没有，需要提醒用户定义对应字段。并根据用户定义来调用update_definition 来更新字段（关系）的定义",
            parameters: {}
        }
    },
    {
        type: "function",
        function: {
            name: "update_definition",
            description: "更新/上传字段(关系)定义",
            parameters: {
                name: {
                    type: "string",
                    description: "字段名"
                },
                description: {
                    type: "string",
                    description: "字段的详细解释"
                },
                params: {
                    type: "object",
                    description: "其它属性"
                }
            },
            required: ["name", "description"]
        }
    },
    {
        type: "function",
        function: {
            name: "get_selected_object_definition",
            description: "获取选中的对象定义",
            parameters: {
            }
        }
    }
];


const actions = {
    "view_current_file": async () => {
        const file = agentStoreContorl.getFile();
        if (file) {
            try {
                const data = await agentUtils.parseFile(file);
                // console.log(data)
                if (data.data.data.length > 0) {
                    const VisualizedDataMsg = agentUtils.Visualization(data.data, data.type);
                    agentMsgControl.pushMsg(VisualizedDataMsg, "agent")
                }
                if (data.fileList.data.length > 0) {
                    const VisualizedDataMsg = agentUtils.Visualization(data.fileList, data.type);
                    agentMsgControl.pushMsg(VisualizedDataMsg, "agent")
                }
                return "当前文件已展示"
            } catch (error) {
                console.error('Error parsing file:', error);
                return "解析文件出错，请检查文件！"
            }
        }
        else {
            agentMsgControl.pushMsg(agentUtils.Visualization("未检测到上传文件，请确认已选择了上传文件！", 'str'), 'agent')
            return "未检测到上传文件，请确认已选择了上传文件！"
        }
    },
    "upload_data_with_definition": async (router) => {
        const file = agentStoreContorl.getFile();
        const selected_folder = agentInteractionControl.getSelectedFolder()
        // console.log(selected_folder)
        if (!selected_folder) {
            return `请选择文件夹后再上传`
        }
        if (!file) {
            // agentMsgControl.pushMsg(agentUtils.Visualization("未检测到上传文件，请确认已选择了上传文件！", 'str'), 'agent')
            return "未检测到上传文件，请确认已选择了上传文件！"
        }
        try {
            let uid
            try {
                uid = userControl.getuserInfo().uid
            } catch {
                agentMsgControl.pushMsg(agentUtils.Visualization("用户未登录！", "str"), 'agent')
                router.push("/login")
                return
            }
            const data = await agentUtils.parseFile(file);
            // console.log(data)
            // downloadFileFromObject(data.zipFile)
            const submitData = [];
            var filePath = ""
            if (data.zipFile) {
                const res = await upload_file(data.zipFile)
                if (res.status == 200) {
                    filePath = res.data.split(': ').pop()
                }
                // console.log(filePath)
            }

            const excelData = data.data.data.slice(1)
            const objDef = data.data.data[0]
            const defList = [];
            const fileList = []
            const uploadTime = getCurrentDateTime()
            for (let key in objDef) {
                const defObj = {
                    "field": key,
                    "uid": uid,
                    "type": "str",
                    "description": objDef[key] || ""
                }
                if (objDef[key] == "file") {
                    fileList.push(key)
                    defObj.type = 'file'
                }
                defList.push(defObj)
            }

            excelData.forEach(element => {
                let id = `${data.name}_${uuidv4().replace(/-/g, "")}`
                for (let key in element) {
                    let eleVal
                    if (fileList.includes(key)) {
                        eleVal = `${filePath}/${element[key]}`
                    }
                    else {
                        eleVal = element[key]
                    }
                    submitData.push({
                        "id": id,
                        "field": key,
                        "value": eleVal
                    })
                }
                submitData.push({
                    "id": id,
                    "field": "is",
                    "value": data.name
                }, {
                    "id": data.name,
                    "field": "contains",
                    "value": id
                }, {
                    "id": id,
                    "field": "上传时间",
                    "value": uploadTime
                }, {
                    "id": id,
                    "field": "belongs to",
                    "value": uid
                }, {
                    "id": uid,
                    "field": "has",
                    "value": id
                }, {
                    "id": id,
                    "field": "父文件夹为",
                    "value": selected_folder
                }, {
                    "id": selected_folder,
                    "field": "子文件有",
                    "value": id
                })
            });

            // console.log(submitData)
            // console.log(defList)
            try {
                const requests = [];
                requests.push(protectedUpload(submitData));
                requests.push(updateDefinition(defList));
                const [uploadResponse, updateResponse] = await axios.all(requests);
                agentMsgControl.pushMsg(agentUtils.Visualization("提交成功！", 'str'), 'agent')
                return "数据上传成功！"
            } catch (error) {
                console.error(error)
                return `出现错误，错误为: ${error}`
            }
        } catch (error) {
            console.error('Error parsing file:', error);
            return `解析文件时出现错误: ${error}`
        }
    },
    "upload_data": async (router) => {
        const file = agentStoreContorl.getFile();
        const selected_folder = agentInteractionControl.getSelectedFolder()
        // console.log(selected_folder)
        if (!selected_folder) {
            return `请选择文件夹后再上传`
        }
        if (!file) {
            // agentMsgControl.pushMsg(agentUtils.Visualization("未检测到上传文件，请确认已选择了上传文件！", 'str'), 'agent')
            return "未检测到上传文件，请确认已选择了上传文件！"
        }
        try {
            let uid
            try {
                uid = userControl.getuserInfo().uid
            } catch {
                agentMsgControl.pushMsg(agentUtils.Visualization("用户未登录！", "str"), 'agent')
                router.push("/login")
                return
            }
            const data = await agentUtils.parseFile(file);
            // console.log(data)
            // downloadFileFromObject(data.zipFile)
            const submitData = [];
            var filePath = ""
            if (data.zipFile) {
                const res = await upload_file(data.zipFile)
                if (res.status == 200) {
                    filePath = res.data.split(': ').pop()
                }
                // console.log(filePath)
            }

            const excelData = data.data.data
            const fileList = []
            const uploadTime = getCurrentDateTime()
            const objDef = configControl.getObjectDef()[selected_folder.value]
            const reverseMap = {}
            for (let key in objDef) {
                if (objDef[key].type == "file") {
                    fileList.push(objDef[key].name)
                }
                if (objDef[key].name) {
                    reverseMap[objDef[key].name] = key
                }
            }
            // console.log(reverseMap)
            excelData.forEach(element => {
                let id = `${uuidv4().replace(/-/g, "")}`
                for (let key in element) {
                    let eleVal
                    if (fileList.includes(key)) {
                        eleVal = `${filePath}/${element[key]}`
                    }
                    else {
                        eleVal = element[key]
                    }
                    if (reverseMap[key]) {
                        if (key == "上传时间") {
                            eleVal = uploadTime
                        }
                        submitData.push({
                            "id": id,
                            "field": reverseMap[key],
                            "value": eleVal
                        })
                    }

                }
                submitData.push(
                    {
                        "id": id,
                        "field": "is",
                        "value": selected_folder.value
                    }, {
                    "id": selected_folder.value,
                    "field": "contains",
                    "value": id
                },
                    {
                        "id": id,
                        "field": "belongs to",
                        "value": uid
                    }, {
                    "id": uid,
                    "field": "has",
                    "value": id
                }, {
                    "id": id,
                    "field": "父文件夹为",
                    "value": selected_folder.value
                }, {
                    "id": selected_folder.value,
                    "field": "子文件有",
                    "value": id
                })
            });
            // console.log(submitData)
            try {
                const res = await protectedUpload(submitData);
                agentMsgControl.pushMsg(agentUtils.Visualization("提交成功！", 'str'), 'agent')
                return "数据上传成功！"
            } catch (error) {
                console.error(error)
                return `出现错误，错误为: ${error}`
            }
        } catch (error) {
            console.error('Error parsing file:', error);
            return `解析文件时出现错误: ${error}`
        }
    },
    // "view_my_data": (filters) => {
    //     // router.push({ name: "list data" })
    //     agentMsgControl.pushMsg(h(ListDataComponent, { editMode: false, filters: filters }), "agent", true)
    //     console.log(cacheDataControl.get("mydataFields"))
    //     return JSON.stringify({ fields: ["编号", "更新时间", "上传时间", "负责人"], data: [{}, {}] })
    //     // agentMsgControl.pushMsg(agentUtils.Visualization("已将页面跳转到我的数据", "str"), "agent", true)
    // },
    "get_upload_template_xlsx": () => {
        const selected_folder = actions["get_selected_folder"]()
        if (!selected_folder) {
            return "未选中文件夹"
        }
        const objDef = configControl.getObjectDef()[selected_folder.value]
        const fields = []
        for (let key in objDef) {
            if (objDef[key].name) {
                fields.push(objDef[key].name)
            }
        }
        generateExcel(objDef.name, fields, [])
        return "已下载模板文件，请检查。"
    },
    "view_my_info": () => {
        agentMsgControl.pushMsg(h(UserInfoComponent, { editMode: false }), 'agent', true)
        return "你的信息已展示！"
    },
    "help": () => {
        agentMsgControl.pushMsg(h(HelpComponent), 'agent')
        return "已显示帮助信息"
    },
    "get_data": async (queryPair) => {
        const response = await getProtectedObject(queryPair.id)
        console.log(response)
        return response
    },
    "get_selected_data": () => {
        const result = agentInteractionControl.getSelectedItems()
        // console.log(result)
        return JSON.stringify(result)
    },
    "get_selected_folder": () => {
        const selectedFolder = agentInteractionControl.getSelectedFolder()
        if (!selectedFolder) {
            return "未选中文件夹"
        }
        return selectedFolder
    },
    "get_current_time": () => {
        const now = new Date();
        return now.toISOString();
    },
    "定义数据结构": () => {
        agentMsgControl.pushMsg(h(UserInfoComponent, { editMode: true }), 'agent', true)
        return `已显示定义数据结构的界面`
    },
    "cache_data": (args) => {
        cacheDataControl.set(args.name, args.data)
        // console.log(args.name)
        // console.log(args.data)
        return `已将${args.name}放入缓存！`
    },
    "get_cache_data": (args) => {
        const cached = cacheDataControl.get(args.name)
        return cached || `没有${args.name}的相关数据`
    },
    "ab1_sequence_validation": async () => {
        let uid
        let username
        try {
            uid = userControl.getuserInfo().uid
            username = userControl.getuserInfo().username
        } catch {
            agentMsgControl.pushMsg(agentUtils.Visualization("用户未登录！", "str"), 'agent')
            router.push("/login")
            return
        }
        const start_time = getCurrentDateTime()
        const tid = uuidv4().replace(/-/g, "")
        const submitArray =
            [{ id: tid, field: "编号", value: tid },
            { id: tid, field: "tool_name", value: "ab1 sequence validation" },
            { id: tid, field: "上传时间", value: start_time },
            { id: tid, field: "创建时间", value: start_time },
            { id: tid, field: "is", value: "task" },
            { id: tid, field: "status", value: "processing" },
            { id: tid, field: "belongs to", value: uid },
            { id: tid, field: "负责人", value: username },
            { id: uid, field: "has", value: tid },
            { id: "task", field: "contains", value: tid },
            ]
        const file = agentStoreContorl.getFile();
        if (!file) {
            agentMsgControl.pushMsg(agentUtils.Visualization("未检测到上传文件，请确认已选择了上传文件！", 'str'), 'agent')
            return "未检测到上传文件，请确认已选择了上传文件！"
        }
        const res = await protectedUpload(submitArray)
        const res2 = await ab1_seq_val({ file: file, task_id: tid })
        console.log(res)
        console.log(res2)
        return `已经开始执行ab1 sequence validation 任务id为${tid}`
    },
    "build_connection": async (args) => {
        const submitArray = []
        if (!args.src_id || !args.connection || !args.des_ids) {
            return `参数传入异常，请检查参数是否正确${JSON.stringify(args)}`
        }
        args.des_ids.forEach(des_id => {
            submitArray.push({ id: args.src_id, field: args.connection, value: des_id },
                { id: des_id, field: `reverse_${args.connection}`, value: args.src_id },
            )
        })
        console.log(submitArray)
        const res = await protectedUpload(submitArray)
        console.log(res)
        if (res.status != 201) {
            return `建立联系失败！${res}`
        }
        return `已建立联系`
    },
    "get_selected_object_definition": () => {
        return configControl.getSelectedObjectDefinition()
    },
    "create_a_new_connection": (args) => {
        if (!args.name || !args.description) {
            return `参数传入异常请检查参数name:${args.name},description:${args.description}`
        }
        const conName = args.name
        const description = args.description

    }
}

const agentActionControl = {
    async pushMsg(msg, role) {
        agentMsgControl.pushMsg(agentUtils.Visualization(msg, 'str'), role)
        const response = await this.finalAgent(msg)
        console.debug(response)
    },
    getMsgs() {
        return agentMsgControl.getMsgs()
    },
    pushFile(file) {
        agentStoreContorl.pushFile(file)
        if (file) {
            this.pushMsg(`已缓存文件：${file.name}`, 'agent')
        }
    },
    getFile() {
        agentStoreContorl.getFile()
    },
    async getAgentResponse(messages) {
        let response2 = await client.chat.completions.create({
            model: "qwen-plus",
            messages: messages,
            tools: tools,
        });

        // let response2 = await QwenAgent(messages)
        // response2 = response2.data
        return response2
    },
    async finalAgent(prompt) {
        let i = 1
        let agentRes
        const messages = [{ role: "user", content: prompt }]
        agentQwenMsgControl.pushMsg(prompt, "user")
        const firstResponse = await this.getAgentResponse(messages)
        console.log(firstResponse)
        // const firstResponse = await this.QwenAgent
        let assistantOutput = firstResponse.choices[0].message
        // console.log(`第${i}轮大模型输出信息：${JSON.stringify(assistantOutput)}`);
        agentMsgControl.pushMsg(agentUtils.Visualization(`第${i}轮大模型输出信息：${JSON.stringify(assistantOutput)}`, 'str'), "assistant")
        // agentQwenMsgControl.pushMsg(JSON.stringify(assistantOutput), "assistant")
        if (Object.is(assistantOutput.content, null)) {
            assistantOutput.content = "";
        }
        agentQwenMsgControl.pushMsg(assistantOutput.content, assistantOutput.role);
        messages.push(assistantOutput)
        if (!("tool_calls" in assistantOutput)) {
            agentRes = assistantOutput.content.replace(/^['"]|['"]$/g, '')
        } else if (assistantOutput["tool_calls"] == null) {
            agentRes = assistantOutput.content.replace(/^['"]|['"]$/g, '')
        }
        else {
            // while ("tool_calls" in assistantOutput) {
            while (assistantOutput["tool_calls"] !== null) {
                let toolInfo = {};
                const calledTool = assistantOutput.tool_calls[0].function.name
                if (Object.keys(actions).includes(calledTool)) {
                    const action = actions[calledTool];
                    if (assistantOutput.tool_calls[0].function.arguments) {
                        try {
                            // 将字符串的 arguments 解析为对象
                            const args = JSON.parse(assistantOutput.tool_calls[0].function.arguments);
                            console.debug(`${calledTool} triggered with arguments:`, args);
                            // 传递解析后的参数给 action
                            const res = await action(args);
                            toolInfo = { "role": "tool", "content": res || "" }
                        } catch (error) {
                            console.error("Error parsing arguments:", error);
                            return `Error parsing arguments:", ${error}`
                        }
                    } else {
                        // 没有参数时调用 action
                        console.debug(`${calledTool} triggered without arguments`);
                        const res = await action();
                        toolInfo = { "role": "tool", "content": res || "" }
                    }
                }
                console.log("=".repeat(100));
                // console.log(`工具输出信息：${JSON.stringify(toolInfo)}`);
                agentMsgControl.pushMsg(agentUtils.Visualization(toolInfo.content, 'str'), toolInfo.role)
                console.debug(`toolInfo:${JSON.stringify(toolInfo)}`)
                agentQwenMsgControl.pushMsg(toolInfo.content, toolInfo.role)
                messages.push(toolInfo)
                assistantOutput = (await this.getAgentResponse(messages)).choices[0].message;
                if (Object.is(assistantOutput.content, null)) {
                    assistantOutput.content = "";
                }
                // console.debug(`second assistantOutput:${JSON.stringify(assistantOutput.content)} ${JSON.stringify(assistantOutput.role)}`)
                agentQwenMsgControl.pushMsg(assistantOutput.content, assistantOutput.role);
                agentMsgControl.pushMsg(agentUtils.Visualization(assistantOutput.content, 'str'), assistantOutput.role)
                messages.push(assistantOutput)
                i += 1;
                console.log(`第${i}轮大模型输出信息：${JSON.stringify(assistantOutput)}`)
                // agentMsgControl.pushMsg(agentUtils.Visualization(`第${i}轮大模型输出信息：${JSON.stringify(assistantOutput)}`, 'str'), assistantOutput.role)
            }
            console.log("=".repeat(100));
            agentRes = JSON.stringify(assistantOutput.content).replace(/^['"]|['"]$/g, '')
        }
        // agentQwenMsgControl.pushMsg(agentRes, "assistant")
        // agentMsgControl.pushMsg(agentUtils.Visualization(agentRes, 'str'), "assistant")
        return agentRes
    }
}


const agentUtils = {
    async parseFile(file) {
        const tableSubfix = ['csv', 'tsv', 'xlsx', 'xls']
        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (tableSubfix.includes(fileExtension)) {
            const parsedData = await parseTableFile(file)
            return parsedData
        } else if (fileExtension == "zip") {
            const parsedData = await parseZipFile(file)
            // console.log(parsedData)
            return parsedData
        }
        else {
            return { status: "failed", error_info: "unexcepted file type" }
        }

    },
    Visualization(data, type) {
        if (data && type) {
            if (type == 'table') {
                return h(VisualizationTable, {
                    headers: data.headers,
                    tdData: data.data
                });
            } else if (type == 'str') {
                return h(VisualizationStr, {
                    msg: data,
                })
            }
        }
        else {
            return false
        }
    }
}


export { agentActionControl, agentUtils }