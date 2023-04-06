<template>
  <section>
    <div class="container p-4 mx-auto">
      <slot name="before" />
      <slot />
      <slot name="after" />
    </div>
  </section>
</template>
