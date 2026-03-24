export const siteAnnouncement = {
  title: '这周的小公告',
  content: '这周先把互动区搭起来。你如果路过，欢迎随手留一句话，或者去许愿池丢个愿望。',
  updatedAt: '2026.03.24',
}

export const weeklyTopic = {
  title: '如果你最近只能反复打开一个东西，会是什么？',
  prompt: '可以是歌、游戏、番、软件、网页，甚至是一段让你停不下来的日常。',
}

export const gachaPool = [
  '最近在反复听旧歌，明知道会循环很久还是会继续点。',
  '如果你是从九机展示页绕进来的，那也算成功把你抓进站里了。',
  '有些页面还在收边，但这站已经开始慢慢像个真的小地盘。',
  '最近想补的内容很多，手比脑子慢一点，只能一点一点填。',
  '如果你刚好也喜欢 ACG，那我们大概率会在别的页面再碰到。',
  '今天的推荐是：去翻一翻旧相册，可能会突然想写点什么。',
  '如果你正好在熬夜，那就当这里是一个路过的深夜小站。',
  '先别急着走，可以在纸条墙上留一句话。',
]

export const roleQuiz = {
  title: '你更像站里的哪一边？',
  questions: [
    {
      title: '先选一个你更想点开的入口',
      options: [
        { label: '折腾工具和建站记录', type: 'tech' },
        { label: '普通日子和陪伴感', type: 'life' },
        { label: 'ACG / 音乐 / 兴趣碎片', type: 'acg' },
      ],
    },
    {
      title: '如果周末空下来，你更可能做什么？',
      options: [
        { label: '改站、写点代码、试新东西', type: 'tech' },
        { label: '出去走走或者慢慢待着', type: 'life' },
        { label: '补番、听歌、逛喜欢的内容', type: 'acg' },
      ],
    },
    {
      title: '你更喜欢哪种博客气质？',
      options: [
        { label: '好用、清楚、能留下方法', type: 'tech' },
        { label: '真实、柔软、有生活味', type: 'life' },
        { label: '有趣、带氛围、像个人主页', type: 'acg' },
      ],
    },
  ],
  results: {
    tech: {
      title: 'Tech 侧来客',
      copy: '你大概率会先去看我怎么折腾这个站，顺手还想翻点工具流和建站记录。',
    },
    life: {
      title: 'Life 侧来客',
      copy: '你更在意一个站有没有人味，愿意停下来看看普通日子是怎么被写下来的。',
    },
    acg: {
      title: 'ACG 侧来客',
      copy: '你多半会先被气质和兴趣吸进来，之后再慢慢去翻别的内容。',
    },
  },
}

export const defaultPostQuestion = '看到这里时，你最想回一句什么？'

export const reactionOptions = [
  {
    label: '有共鸣',
    message: '这篇我有共鸣，尤其是：',
  },
  {
    label: '想继续看',
    message: '这篇我还想继续看，你下次可以再写写：',
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
