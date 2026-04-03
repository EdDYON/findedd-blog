<template>
  <YunLayoutWrapper>
    <div class="page-shell">
      <RouterView />
    </div>
  </YunLayoutWrapper>
</template>

<style scoped>
.page-shell {
  flex: 1;
  width: min(880px, calc(100vw - 2rem));
  min-width: 0;
}

.page-shell :deep(.content > .yun-card),
.page-shell :deep(.yun-page) {
  max-width: 100%;
}

@media (max-width: 960px) {
  .page-shell {
    width: calc(100vw - 0.8rem);
  }
}
</style>
