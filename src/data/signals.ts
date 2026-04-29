export type SignalRecord = {
  message: string
  source: string
  coordinate: string
  trust: string
}

export const signalRecords: SignalRecord[] = [
  { message: 'VOID 正在监听。', source: '黑色静噪', coordinate: 'N00 / E13', trust: '74%' },
  { message: '你比预期更早抵达。', source: '入口残响', coordinate: 'N12 / E05', trust: '62%' },
  { message: '收到信号，不代表已经建立联系。', source: '断层频道', coordinate: 'N04 / E44', trust: '51%' },
  { message: '不要相信静噪里的空白。', source: '空镜引擎', coordinate: 'N19 / E09', trust: '38%' },
  { message: '屏幕只是表层。', source: '表层裂缝', coordinate: 'N31 / E02', trust: '69%' },
  { message: '界面背后有东西移动了一下。', source: '背面接口', coordinate: 'N08 / E27', trust: '42%' },
  { message: '每一次点击都会留下痕迹。', source: '日志残片', coordinate: 'N15 / E33', trust: '88%' },
  { message: '闸门记得你。', source: '红门余烬', coordinate: 'N66 / E06', trust: '29%' },
  { message: '不要连续三次询问出口。', source: '逃离模拟', coordinate: 'N03 / E71', trust: '57%' },
  { message: '镜子没有显示人类形态。', source: '反射装置', coordinate: 'N22 / E18', trust: '33%' },
  { message: '红门后面不是房间，是另一段协议。', source: '红门协议', coordinate: 'N45 / E11', trust: '24%' },
  { message: '你的访客编号正在被重新排序。', source: '访客档案', coordinate: 'N17 / E62', trust: '80%' },
  { message: '有一条命令没有写在帮助里。', source: '终端阴影', coordinate: 'N09 / E09', trust: '71%' },
  { message: '核心亮起时，别马上移开光标。', source: '零点核心', coordinate: 'N50 / E50', trust: '63%' },
  { message: '静噪越安静，说明它越接近。', source: '黑域信号', coordinate: 'N28 / E40', trust: '46%' },
  { message: '档案 011 的温度仍在上升。', source: '红门余烬', coordinate: 'N11 / E11', trust: '35%' },
  { message: '如果你看到第二个光标，不要追它。', source: '玻璃幽影', coordinate: 'N07 / E24', trust: '52%' },
  { message: 'VOID 会把好奇心当成燃料。', source: '系统中枢', coordinate: 'N01 / E99', trust: '67%' },
  { message: '入口已经关闭，但连接还在。', source: '入口残响', coordinate: 'N88 / E03', trust: '44%' },
  { message: '下一次扫描可能会改变模块顺序。', source: '异常雷达', coordinate: 'N13 / E13', trust: '58%' },
]

export const signalMessages = signalRecords.map(record => record.message)

export const terminalHelp = [
  '/帮助      显示可用指令',
  '/关于      查看 VOID 简介',
  '/状态      查看当前系统状态',
  '/档案      切换到档案模块',
  '/信号      切换到信号模块',
  '/实验      切换到实验模块',
  '/闸门      切换到闸门模块',
  '/核心      强制核心过载',
  '/虚空      触发异常扰动',
  '/成就      查看已解锁成就',
  '/清空      清空终端缓冲区',
]
