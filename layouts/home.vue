<template>
  <YunLayoutWrapper :no-margin="true">
    <div class="w-full flex flex-col items-center home-shell home-shell--landing">
      <div class="w-full home-top-shell">
        <ClientOnly>
          <YunBanner />
        </ClientOnly>
      </div>

      <HomeBoard />
    </div>
  </YunLayoutWrapper>
</template>
