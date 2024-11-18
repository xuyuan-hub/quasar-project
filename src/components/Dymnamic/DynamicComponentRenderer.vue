<template>
    <div>
        <component :is="dynamicComponent" />
    </div>
</template>
<script>
import { ref, onMounted, computed } from 'vue';
export default {
    props: {
        componentString:
            { type: String, required: true, },
    }, setup(props) {
        const dynamicComponent = ref(null);
        const parseComponentString = (componentString) => {
            const component = eval(`(${componentString})`);
            return component;
        };
        onMounted(() => { dynamicComponent.value = parseComponentString(props.componentString); });
        return { dynamicComponent, };
    },
}; 
</script>
<style scoped>