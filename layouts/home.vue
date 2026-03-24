<template>
  <YunLayoutWrapper :no-margin="true">
    <div class="w-full flex flex-col items-center home-shell">
      <div class="w-full home-top-shell">
        <ClientOnly>
          <YunBanner />
        </ClientOnly>
        <YunSay w="full" />
      </div>

      <HomeBoard />

      <section class="post-stream">
        <div class="section-heading">
          <div>
            <p class="eyebrow">最近写了什么</p>
            <h2>最近写了什么</h2>
          </div>
          <p class="post-stream-copy">先把想留下来的东西写下来，页面就会慢慢有自己的样子。</p>
        </div>

        <RouterView />
      </section>
    </div>
  </YunLayoutWrapper>
</template>
