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
            <p class="eyebrow">Latest Notes</p>
            <h2>最近更新</h2>
          </div>
          <p class="post-stream-copy">先从短记录开始，把这座站真正写活。</p>
        </div>

        <RouterView />
      </section>
    </div>
  </YunLayoutWrapper>
</template>
