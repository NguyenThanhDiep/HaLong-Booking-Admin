<template>
  <CFooter :fixed="false">
    <div>
      <a href="">Ha Long Booking Admin</a>
      <span class="ml-1">&copy; {{new Date().getFullYear()}} creativeLabs.</span>
    </div>
    <div class="mfs-auto">
      <span class="mr-1" target="_blank">Author</span>
      <a href="">Diep Nguyen</a>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>
