<template>
  <section>
    <div class="container p-4 mx-auto">
      <slot name="before" />
      <slot />
    </div>
    <slot name="after" />
  </section>
</template>
