<script setup>
import { ref } from 'vue';
const props = defineProps(['headers', 'tdData'])
const headers = ref(props.headers || [])
const parsedData = ref(props.tdData || [])

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

</script>

<template>
    <div class="table-responsive" style="max-height: 800px;">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <template v-for="(header, index) in headers" :key="index">
                        <th scope="col" class="t-header">
                            {{ header }}
                        </th>
                    </template>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in parsedData" :key="row.id">
                    <template v-for="(header) in headers">
                        <template v-if="row[header]">
                            <td v-if="row[header].constructor.name == 'Date'" style="white-space: nowrap;">
                                {{ formatDate(row[header]) }}
                            </td>
                            <td v-else>{{ row[header] }}</td>
                        </template>
                        <template v-else>
                            <td></td>
                        </template>
                    </template>
                </tr>
            </tbody>
        </table>
    </div>

</template>