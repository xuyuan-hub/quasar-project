import { ref, h } from "vue";
import { useRouter } from 'vue-router';
import OpenAI from "openai";
import { v4 as uuidv4, validate } from 'uuid';
import axios from "axios";
import { agentInteractionControl, agentMsgControl, agentQwenMsgControl, agentStoreContorl } from "src/store/agentStore"
import VisualizationTable from "src/components/VisualizationTable.vue"
import VisualizationStr from "src/components/VisualizationStr.vue"
import VisualizationHtml from "src/components/VisualizationHtml.vue";
import { getCurrentDateTime } from "./base-function";


const client = new OpenAI(
    {
        apiKey: "sk-c4aa479e83644440b77c48e82490a592",
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        dangerouslyAllowBrowser: true
    }
);

const tools = [
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
            name: "visualization_html",
            description: "用户提示说要查看html时，调用此函数",
            parameters: {
                strHtml: {
                    type: "string",
                    description: "用户要看的信息的html字符串，需要去除head,body后再放入"
                }
            }
        }
    }
];


const actions = {
    "get_current_time": () => {
        const now = new Date();
        return now.toISOString();
    },
    "visualization_html": (strHtml) => {
        return h(VisualizationHtml, { strHtml: strHtml })
    }
}

const agentActionControl = {
    async pushMsg(msg, role) {
        const msgObj = { role: role, content: msg, stamp: getCurrentDateTime() }
        agentMsgControl.pushMsg(agentUtils.Visualization(msgObj, 'str'), role)
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
        const msgObj = { content: `${assistantOutput?.content}`, role: "assistant", stamp: getCurrentDateTime() }
        agentMsgControl.pushMsg(agentUtils.Visualization(msgObj, 'str'), "assistant")
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
            while (assistantOutput["tool_calls"] !== null && !assistantOutput.tool_calls) {
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
                // console.log(`工具输出信息：${JSON.stringify(toolInfo)}`);
                // agentMsgControl.pushMsg(agentUtils.Visualization(toolInfo.content, 'str'), toolInfo.role)
                const msgObj = { content: `${toolInfo?.content}`, role: toolInfo.role, stamp: getCurrentDateTime() }
                agentMsgControl.pushMsg(agentUtils.Visualization(msgObj, 'str'), toolInfo.role)

                console.debug(`toolInfo:${JSON.stringify(toolInfo)}`)
                agentQwenMsgControl.pushMsg(toolInfo.content, toolInfo.role)
                messages.push(toolInfo)
                assistantOutput = (await this.getAgentResponse(messages)).choices[0].message;
                if (Object.is(assistantOutput.content, null)) {
                    assistantOutput.content = "";
                }
                // console.debug(`second assistantOutput:${JSON.stringify(assistantOutput.content)} ${JSON.stringify(assistantOutput.role)}`)
                agentQwenMsgControl.pushMsg(assistantOutput.content, assistantOutput.role);
                // agentMsgControl.pushMsg(agentUtils.Visualization(assistantOutput.content, 'str'), assistantOutput.role)
                const aMsg = { content: `${assistantOutput?.content}`, role: assistantOutput.role, stamp: getCurrentDateTime() }
                agentMsgControl.pushMsg(agentUtils.Visualization(aMsg, 'str'), "assistant")
                messages.push(assistantOutput)
                i += 1;
                console.log(`第${i}轮大模型输出信息：${JSON.stringify(assistantOutput)}`)
            }
            agentRes = JSON.stringify(assistantOutput.content).replace(/^['"]|['"]$/g, '')
        }
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
                    msg: data.content || "",
                    role: data.role || "",
                    stamp: data.stamp || ""
                })
            }
        }
        else {
            return false
        }
    }
}


export { agentActionControl, agentUtils }