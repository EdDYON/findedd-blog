export const siteAnnouncement = {
  title: '这周的小公告',
  content: '互动区就在这里。路过的话留一句就行，不用写得太满。',
  updatedAt: '2026.03.24',
}

export const weeklyTopic = {
  title: '如果最近只能反复打开一个东西，会是什么？',
  prompt: '歌、游戏、番、软件、网页都算，甚至一张图也行。',
}

export const gachaPool = [
  '如果你是从九机展示页绕进来的，那也算被我顺手拐进来了。',
  '旧歌最近听得有点多，循环到自己都知道下一句是什么了。',
  '要是你也喜欢 ACG，那后面大概还会在别的页面碰到。',
  '今天的随机建议：去翻一翻旧照片，说不定会突然想写点什么。',
  '深夜路过也没关系，这里本来就挺适合深夜打开。',
  '先别急着走，留一句话再跑也来得及。',
  '如果你愿意在这里留一句话，那这页就已经值了。',
  '有些站不是为了高效，是为了偶尔回来坐一会儿。',
]

export const roleQuiz = {
  title: '你更像站里的哪一边？',
  questions: [
    {
      title: '先选一个你最想点开的入口',
      options: [
        { label: '折腾工具和建站记录', type: 'tech' },
        { label: '普通日子和陪伴感', type: 'life' },
        { label: 'ACG / 音乐 / 兴趣碎片', type: 'acg' },
      ],
    },
    {
      title: '如果周末空下来，你更想干什么？',
      options: [
        { label: '改站、写点代码、试新东西', type: 'tech' },
        { label: '出去走走或者慢慢待着', type: 'life' },
        { label: '补番、听歌、逛喜欢的内容', type: 'acg' },
      ],
    },
    {
      title: '你更喜欢什么气质的博客？',
      options: [
        { label: '清楚、顺手、能留下方法', type: 'tech' },
        { label: '真实、柔一点、有生活味', type: 'life' },
        { label: '有趣、带氛围、像个人小站', type: 'acg' },
      ],
    },
  ],
  results: {
    tech: {
      title: 'Tech 侧来客',
      copy: '你大概会先去翻我怎么折腾这个站，顺手再看看工具流和建站记录。',
    },
    life: {
      title: 'Life 侧来客',
      copy: '你更在意一个站有没有人味，也更愿意停下来看看普通日子。',
    },
    acg: {
      title: 'ACG 侧来客',
      copy: '你多半会先被气质和兴趣吸进来，然后自然会去点别的页。',
    },
  },
}

export const defaultPostQuestion = '看到这里了，想回一句什么都行。'

export const reactionOptions = [
  {
    label: '有共鸣',
    message: '这篇我挺有共鸣，尤其是：',
  },
  {
    label: '想继续看',
    message: '这篇还想继续看，下次可以再写写：',
  },
  {
    label: '记下了',
    message: '这篇我先记下了，最戳到我的是：',
  },
  {
    label: '来串门',
    message: '路过留个脚印，我想说一句：',
  },
]
