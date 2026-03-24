<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useVisitorAuth } from '../composables/useVisitorAuth'

const { authenticated, loadVisitor, user } = useVisitorAuth()

let observer: MutationObserver | null = null

function setInputValue(input: HTMLInputElement | HTMLTextAreaElement, value: string) {
  if (input.value === value)
    return

  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))
}

function hydrateWalineIdentity() {
  if (typeof document === 'undefined' || !authenticated.value || !user.value)
    return

  const panels = Array.from(document.querySelectorAll('.wl-panel'))

  panels.forEach((panel) => {
    const nickInput = panel.querySelector('.wl-header input') as HTMLInputElement | null
    const editor = panel.querySelector('.wl-editor') as HTMLTextAreaElement | null

    if (nickInput) {
      setInputValue(nickInput, user.value!.nickname)
      nickInput.readOnly = true
      nickInput.dataset.qqBound = 'true'
      nickInput.title = '当前会使用 QQ 昵称提交'
    }

    if (editor) {
      editor.placeholder = `以 ${user.value!.nickname} 的名字留一句话吧`
    }
  })
}

onMounted(async () => {
  await loadVisitor()
  await nextTick()
  hydrateWalineIdentity()

  observer = new MutationObserver(() => {
    hydrateWalineIdentity()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

watch([authenticated, user], async () => {
  await nextTick()
  hydrateWalineIdentity()
})
</script>

<template>
  <span class="visitor-waline-bridge" aria-hidden="true" />
</template>
