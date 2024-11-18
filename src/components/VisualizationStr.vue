<template>
    <div>
        <q-chat-message :name="props.role" :text="formattedMessages" :stamp="props.stamp" :sent="props.role === 'user'"
            :text-html="true" />
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'

const props = defineProps({ role: String, msg: [Array, String], stamp: String })

const formattedMessages = computed(() => {
    const messages = Array.isArray(props.msg) ? props.msg : [props.msg];

    return messages.map((msg) => {
        const parts = msg.split(/(```[\s\S]*?```)/g);

        return parts.map((part) => {
            if (part.startsWith('```') && part.endsWith('```')) {
                const codeBlock = part.slice(3, -3);
                const [lang, ...lines] = codeBlock.split('\n');
                const code = lines.join('\n');
                if (lang == 'vue') {
                    lang == 'html'
                }
                try {
                    return `<pre><code class="hljs">${hljs.highlight(code, { language: lang.trim() }).value}</code></pre>`;
                } catch {
                    console.warn(`无法高亮代码: "${lang.trim()}".`);
                    return `<pre><code>${code}</code></pre>`;
                }
            }
            return `<p>${part}</p>`;
        }).join('');
    });
});

onMounted(() => {
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block)
    })
})
</script>

<style scoped>
pre {
    background-color: #2d2d2d;
    color: #f8f8f2;
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
    overflow-x: auto;
}
</style>