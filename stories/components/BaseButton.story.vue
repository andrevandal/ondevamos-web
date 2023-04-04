<script lang="ts" setup>
import { BaseButton } from '#components'

type BaseButtonProps = InstanceType<typeof BaseButton>['$props']

function initState(props: BaseButtonProps) {
  return {
    ...props,
  }
}

const propsVariants = Object.entries({
  primary: {
    title: 'Primary',
    props: {
      disabled: false,
      variant: 'primary',
      outlined: false,
    },
  },
  dark: {
    title: 'Dark',
    props: {
      disabled: false,
      variant: 'dark',
      outlined: false,
    },
  },
  neutral: {
    title: 'Neutral',
    props: {
      disabled: false,
      variant: 'neutral',
      outlined: false,
    },
  },
  destructive: {
    title: 'Destructive',
    props: {
      disabled: false,
      variant: 'destructive',
      outlined: false,
    },
  },
  link: {
    title: 'Link',
    props: {
      disabled: false,
      variant: 'link',
      outlined: false,
    },
  },
  icon: {
    title: 'Primary (com ícone)',
    props: {
      disabled: false,
      variant: 'primary',
      outlined: false,
      iconLeft: 'edit',
    },
  },
  twoIcons: {
    title: 'Primary (com 2 ícones)',
    props: {
      disabled: false,
      variant: 'primary',
      outlined: false,
      iconLeft: 'edit',
      iconRight: 'close',
    },
  },
  primaryOutlined: {
    title: 'Primary (Outlined)',
    props: {
      variant: 'primary',
      outlined: true,
      iconLeft: 'edit',
    },
  },
  darkOutlined: {
    title: 'Dark (Outlined)',
    props: {
      variant: 'dark',
      outlined: true,
    },
  },
  neutralOutlined: {
    title: 'Neutral (Outlined)',
    props: {
      variant: 'neutral',
      outlined: true,
    },
  },
})
</script>

<template>
  <Story
    title="BaseButton"
    :layout="{
      type: 'grid',
    }"
  >
    <Variant
      v-for="[key, variant] of propsVariants"
      :key="key"
      :title="variant.title"
      :init-state="() => initState(variant.props as BaseButtonProps)"
    >
      <template #default="{ state }: { state: ReturnType<typeof initState> }">
        <BaseButton
          :href="state.href"
          :icon-left="state.iconLeft"
          :icon-right="state.iconRight"
          :variant="state.variant"
          :outlined="state.outlined"
        >
          Click Me
        </BaseButton>
      </template>
      <template #controls="{ state }">
        <HstText v-model="state.href" title="href" />
      </template>
    </Variant>
  </Story>
</template>
