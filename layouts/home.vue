<template>
  <YunLayoutWrapper :no-margin="true">
    <div class="w-full flex flex-col items-center">
      <div class="w-full">
        <ClientOnly>
          <YunBanner />
        </ClientOnly>
        <YunSay w="full" />
      </div>

      <HomeBoard />

      <section class="post-stream">
        <div class="section-heading">
          <div>
            <p class="eyebrow">最近更新</p>
            <h2>最近更新</h2>
          </div>
          <p class="post-stream-copy">先把想说的话写下来，站自然就会慢慢长起来。</p>
        </div>

        <RouterView />
      </section>
    </div>
  </YunLayoutWrapper>
</template>
