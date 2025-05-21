<script setup>
const cards = [
{
    title: 'Total Karyawan Keluar / Melakukan SIKEL',
    total: 25,
},
{
    title: 'Total Karyawan SIKEL Dinas',
    total: 12,
},
{
    title: 'Total Karyawan SIKEL Pribadi > 2 Jam',
    total: 8,
},
{
    title: 'Total Karyawan SIKEL Pribadi > 4 Jam',
    total: 3,
},
]
</script>

<template>
    <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="item in cards" :key="item.title" class="bg-white rounded-2xl shadow p-4">
        <div class="text-3xl font-bold text-blue-600">{{ item.total }}</div>
        <div class="mt-2 text-gray-700 font-medium">{{ item.title }}</div>
      </div>
    </div>
</template>
