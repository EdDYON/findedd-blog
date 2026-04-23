<script setup lang="ts">
const planPoints = [
  {
    index: '01',
    title: 'PLAN',
  },
  {
    index: '02',
    title: 'LONG',
  },
  {
    index: '03',
    title: 'SOON',
  },
]
</script>

<template>
  <main class="temporary-plan-cover">
    <div class="plan-bg-grid" />
    <div class="plan-orb plan-orb-a" />
    <div class="plan-orb plan-orb-b" />
    <div class="plan-frame">
      <section class="plan-hero">
        <div class="plan-mark">
          <span />
          <span />
          <span />
        </div>

        <p class="plan-kicker">
          EdDYON
        </p>

        <h1>
          A New Plan
        </h1>

        <p class="plan-copy">
          这里先留给一个新的计划。原来的博客内容暂时收在后面，等这件事放好之后再回来。
        </p>

        <div class="plan-actions" aria-label="plan markers">
          <span class="plan-link">Alpha</span>
          <span class="plan-link plan-link-ghost">2026</span>
        </div>
      </section>

      <aside class="plan-panel">
        <div v-for="point in planPoints" :key="point.index" class="plan-point">
          <span>{{ point.index }}</span>
          <strong>{{ point.title }}</strong>
        </div>
      </aside>
    </div>
  </main>
</template>

<style scoped lang="scss">
.temporary-plan-cover {
  position: relative;
  display: grid;
  min-height: 100svh;
  overflow: hidden;
  place-items: center;
  padding: clamp(1rem, 3vw, 2rem);
  color: #f8fbff;
  background:
    radial-gradient(circle at 20% 18%, rgba(116, 207, 255, 0.18), transparent 28%),
    radial-gradient(circle at 82% 72%, rgba(255, 146, 196, 0.2), transparent 32%),
    linear-gradient(135deg, rgba(7, 12, 25, 0.94), rgba(12, 18, 35, 0.9));
}

.temporary-plan-cover::before {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(115deg, rgba(255, 255, 255, 0.08), transparent 36%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0));
  content: '';
  pointer-events: none;
}

.plan-bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.055) 1px, transparent 1px);
  background-size: 84px 84px;
  mask-image: radial-gradient(circle at center, #000 0%, transparent 72%);
  opacity: 0.45;
}

.plan-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(70px);
  opacity: 0.55;
  pointer-events: none;
}

.plan-orb-a {
  top: 8%;
  right: 15%;
  width: 18rem;
  height: 18rem;
  background: rgba(100, 205, 255, 0.28);
}

.plan-orb-b {
  bottom: 8%;
  left: 10%;
  width: 22rem;
  height: 22rem;
  background: rgba(255, 121, 181, 0.26);
}

.plan-frame {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 0.35fr);
  gap: clamp(1rem, 3vw, 2rem);
  width: min(1120px, 100%);
  min-height: min(680px, calc(100svh - 4rem));
  padding: clamp(1.2rem, 3vw, 2rem);
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: clamp(28px, 4vw, 46px);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.035)),
    rgba(7, 12, 24, 0.46);
  box-shadow:
    0 30px 90px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(24px) saturate(140%);
}

.plan-hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: clamp(0.2rem, 2vw, 1rem);
}

.plan-mark {
  display: flex;
  gap: 0.55rem;
  margin-bottom: clamp(2rem, 7vw, 5rem);
}

.plan-mark span {
  display: block;
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 0 24px rgba(255, 255, 255, 0.44);
}

.plan-mark span:nth-child(2) {
  background: #75d5ff;
}

.plan-mark span:nth-child(3) {
  background: #ff91bf;
}

.plan-kicker {
  margin: 0 0 0.7rem;
  color: rgba(244, 248, 255, 0.62);
  font-size: 0.78rem;
  letter-spacing: 0.34em;
  text-transform: uppercase;
}

h1 {
  max-width: 7ch;
  margin: 0;
  font-family: 'ZCOOL XiaoWei', 'STSong', 'Songti SC', serif;
  font-size: clamp(4rem, 12vw, 9rem);
  font-weight: 500;
  line-height: 0.86;
  letter-spacing: -0.08em;
  text-shadow: 0 24px 52px rgba(0, 0, 0, 0.28);
}

.plan-copy {
  max-width: 34rem;
  margin: 1.5rem 0 0;
  color: rgba(241, 246, 255, 0.72);
  font-size: clamp(1rem, 2vw, 1.15rem);
  line-height: 1.9;
}

.plan-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 2rem;
}

.plan-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 8.5rem;
  min-height: 3.1rem;
  padding: 0.8rem 1.4rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  color: #121827;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.2);
}

.plan-link:hover {
  transform: translateY(-3px);
}

.plan-link-ghost {
  background: rgba(255, 255, 255, 0.08);
  color: #f7fbff;
}

.plan-panel {
  display: grid;
  align-content: end;
  gap: 0.8rem;
  min-width: 0;
}

.plan-point {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 5rem;
  padding: 1rem 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.065);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.09);
}

.plan-point span {
  color: rgba(238, 244, 255, 0.45);
  font-size: 0.75rem;
  letter-spacing: 0.16em;
}

.plan-point strong {
  color: rgba(255, 255, 255, 0.92);
  font-size: clamp(1.25rem, 2.8vw, 2rem);
  letter-spacing: 0.08em;
}

@media (max-width: 760px) {
  .temporary-plan-cover {
    padding: 0.8rem;
  }

  .plan-frame {
    grid-template-columns: 1fr;
    min-height: calc(100svh - 1.6rem);
    padding: 1rem;
  }

  .plan-mark {
    margin-bottom: 4rem;
  }

  h1 {
    font-size: clamp(4.4rem, 23vw, 6rem);
  }

  .plan-copy {
    font-size: 0.98rem;
  }

  .plan-panel {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-content: stretch;
  }

  .plan-point {
    min-height: 4.2rem;
    align-items: start;
    flex-direction: column;
    padding: 0.85rem;
  }

  .plan-point strong {
    font-size: 1rem;
  }
}
</style>
