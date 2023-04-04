<script lang="ts">
import { h, defineComponent, useCssModule } from 'vue'

import { NuxtIcon, NuxtLink } from '#components'

export enum ButtonVariants {
  'primary',
  'dark',
  'neutral',
  'destructive',
  'link',
}

export default defineComponent({
  props: {
    href: {
      type: String,
      default: '#',
    },
    iconLeft: {
      type: String,
      default: null,
    },
    iconRight: {
      type: String,
      default: null,
    },
    variant: {
      type: String as PropType<keyof typeof ButtonVariants>,
      default: 'neutral',
    },
    outlined: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, { slots }) {
    const $style = useCssModule()
    const classListFromVariant = (variant: keyof typeof ButtonVariants) => {
      const classList = {
        primary: [$style.primary],
        dark: [$style.dark],
        neutral: [$style.neutral],
        destructive: [$style.destructive],
        link: [$style.link],
      }
      return classList[variant] ?? classList.primary
    }

    const classList = [
      [$style.button],
      ...classListFromVariant(props?.variant),
      {
        [$style.outlined]: props?.outlined,
        [$style.hasLeftIcon]: !!props.iconLeft && !props.iconRight,
        [$style.hasRightIcon]: !!props.iconRight && !props.iconLeft,
      },
    ]

    const tag = props.href ? NuxtLink : 'a'

    return () =>
      h(
        tag,
        {
          href: props?.href,
          class: classList,
        },
        () => [
          ...[
            props.iconLeft &&
              h(NuxtIcon, {
                filled: true,
                name: props.iconLeft,
              }),
          ],
          slots.default!(),
          ...[
            props.iconRight &&
              h(NuxtIcon, {
                filled: true,
                name: props.iconRight,
              }),
          ],
        ],
      )
  },
})
</script>

<style module lang="postcss">
.button {
  @apply inline-flex items-center gap-3 px-4 py-3 lg:py-2 transition-all ease-in ring-4 border-2 border-transparent m-[4px] ring-transparent font-medium rounded-lg;
  &.primary {
    &:not(.outlined) {
      @apply text-gray-900 bg-yellow-500 hover:bg-yellow-400 hover:ring-yellow-500/20  focus:border-yellow-700;
    }
    &.outlined {
      @apply ring-1 ring-yellow-500 bg-transparent text-yellow-500 hover:bg-yellow-500 hover:text-gray-900 focus:ring-2 focus:bg-transparent focus:text-yellow-500;
    }
  }
  &.dark {
    &:not(.outlined) {
      @apply text-white bg-gray-900 hover:bg-gray-800 hover:ring-gray-800/20;
    }
    &.outlined {
      @apply ring-1 ring-gray-800 bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white focus:ring-2 focus:bg-transparent focus:text-gray-900;
    }
  }
  &.neutral {
    &:not(.outlined) {
      @apply text-gray-900 bg-gray-100 hover:bg-gray-200 hover:text-black focus:bg-gray-100 focus:border-gray-300;
    }
    &.outlined {
      @apply ring-1 ring-gray-200 bg-transparent text-gray-900 hover:text-black hover:ring-gray-400 focus:ring-2 focus:ring-gray-400;
    }
  }
  &.destructive {
    @apply text-white bg-red-500  hover:ring-red-500/30 focus:ring-0 focus:border-red-100;
  }
  &.link {
    @apply text-blue-500 bg-transparent hover:underline hover:underline-offset-1 focus:no-underline focus:border-blue;
  }

  &.hasLeftIcon {
    @apply pr-[1.125rem];
  }
  &.hasRightIcon {
    @apply pl-[1.125rem];
  }
}
</style>
