import type { AchievementId } from '@/types/void'

export const achievements: Record<AchievementId, { title: string; description: string }> = {
  FIRST_CONTACT: {
    title: '首次接入',
    description: '你进入了 VOID 的主界面。',
  },
  TERMINAL_USER: {
    title: '终端访客',
    description: '隐藏终端桥已被打开。',
  },
  SIGNAL_HUNTER: {
    title: '信号猎手',
    description: '你连续扫描了不稳定传输。',
  },
  CORE_TOUCH: {
    title: '核心触碰',
    description: '你直接触碰了异常核心。',
  },
  GATEBREAKER: {
    title: '闸门破译者',
    description: '封锁闸门被你打开了。',
  },
  VOID_TOUCHED: {
    title: '虚空扰动',
    description: '异常场被你扭曲了一次。',
  },
  COMMAND_SEEKER: {
    title: '指令追踪者',
    description: '终端开始记住你的输入。',
  },
  LOST_SIGNAL: {
    title: '身份丢失',
    description: 'VOID 无法确认你是谁。',
  },
  NO_EXIT: {
    title: '没有出口',
    description: '你尝试离开，但 VOID 拒绝释放信号。',
  },
  MIRROR_ERROR: {
    title: '镜像错误',
    description: '镜面没有检测到人类形态。',
  },
  REDGATE_WITNESS: {
    title: '红门目击者',
    description: '你在闸门开启后呼叫了红门。',
  },
  LISTENER: {
    title: '静噪倾听者',
    description: '你听见了静噪背后的回声。',
  },
}
