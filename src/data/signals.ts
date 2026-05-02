export type SignalRecord = {
  message: string
  source: string
  coordinate: string
  trust: string
  ip: string
  latency: string
  protocol: string
  risk: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL'
}

export const signalRecords: SignalRecord[] = [
  { message: 'VOID 正在监听。', source: '黑色静噪', coordinate: 'N00 / E13', trust: '74%', ip: '198.51.100.13', latency: '21ms', protocol: 'VOID/TCP', risk: 'LOW' },
  { message: '你比预期更早抵达。', source: '入口残响', coordinate: 'N12 / E05', trust: '62%', ip: '203.0.113.45', latency: '37ms', protocol: 'SYNC/UDP', risk: 'MED' },
  { message: '收到信号，不代表已经建立联系。', source: '断层频道', coordinate: 'N04 / E44', trust: '51%', ip: '192.0.2.77', latency: '83ms', protocol: 'ECHO/ICMP', risk: 'MED' },
  { message: '不要相信静噪里的空白。', source: '空镜引擎', coordinate: 'N19 / E09', trust: '38%', ip: '198.51.100.66', latency: '144ms', protocol: 'NULL/RAW', risk: 'HIGH' },
  { message: '屏幕只是表层。', source: '表层裂缝', coordinate: 'N31 / E02', trust: '69%', ip: '203.0.113.9', latency: '18ms', protocol: 'SURF/HTTP', risk: 'LOW' },
  { message: '界面背后有东西移动了一下。', source: '背面接口', coordinate: 'N08 / E27', trust: '42%', ip: '192.0.2.104', latency: '201ms', protocol: 'BACK/WS', risk: 'HIGH' },
  { message: '每一次点击都会留下痕迹。', source: '日志残片', coordinate: 'N15 / E33', trust: '88%', ip: '198.51.100.88', latency: '12ms', protocol: 'LOG/TCP', risk: 'LOW' },
  { message: '闸门记得你。', source: '红门余烬', coordinate: 'N66 / E06', trust: '29%', ip: '203.0.113.6', latency: '309ms', protocol: 'GATE/RAW', risk: 'CRITICAL' },
  { message: '不要连续三次询问出口。', source: '逃离模拟', coordinate: 'N03 / E71', trust: '57%', ip: '192.0.2.71', latency: '97ms', protocol: 'EXIT/DNS', risk: 'MED' },
  { message: '镜子没有显示人类形态。', source: '反射装置', coordinate: 'N22 / E18', trust: '33%', ip: '198.51.100.22', latency: '188ms', protocol: 'MIRROR/TLS', risk: 'HIGH' },
  { message: '红门后面不是房间，是另一段协议。', source: '红门协议', coordinate: 'N45 / E11', trust: '24%', ip: '203.0.113.111', latency: '404ms', protocol: 'RED/VOID', risk: 'CRITICAL' },
  { message: '你的访客编号正在被重新排序。', source: '访客档案', coordinate: 'N17 / E62', trust: '80%', ip: '192.0.2.17', latency: '31ms', protocol: 'ID/SYNC', risk: 'LOW' },
  { message: '有一条命令没有写在帮助里。', source: '终端阴影', coordinate: 'N09 / E09', trust: '71%', ip: '198.51.100.9', latency: '52ms', protocol: 'TERM/PTY', risk: 'MED' },
  { message: '核心亮起时，别马上移开光标。', source: '零点核心', coordinate: 'N50 / E50', trust: '63%', ip: '203.0.113.50', latency: '6ms', protocol: 'CORE/BUS', risk: 'HIGH' },
  { message: '静噪越安静，说明它越接近。', source: '黑域信号', coordinate: 'N28 / E40', trust: '46%', ip: '192.0.2.40', latency: '167ms', protocol: 'DARK/UDP', risk: 'HIGH' },
  { message: '档案 011 的温度仍在上升。', source: '红门余烬', coordinate: 'N11 / E11', trust: '35%', ip: '198.51.100.11', latency: '244ms', protocol: 'HEAT/TCP', risk: 'CRITICAL' },
  { message: '如果你看到第二个光标，不要追它。', source: '玻璃幽影', coordinate: 'N07 / E24', trust: '52%', ip: '203.0.113.24', latency: '122ms', protocol: 'CURSOR/HID', risk: 'MED' },
  { message: 'VOID 会把好奇心当成燃料。', source: '系统中枢', coordinate: 'N01 / E99', trust: '67%', ip: '192.0.2.99', latency: '44ms', protocol: 'FUEL/BUS', risk: 'MED' },
  { message: '入口已经关闭，但连接还在。', source: '入口残响', coordinate: 'N88 / E03', trust: '44%', ip: '198.51.100.3', latency: '151ms', protocol: 'LINK/TCP', risk: 'HIGH' },
  { message: '下一次扫描可能会改变模块顺序。', source: '异常雷达', coordinate: 'N13 / E13', trust: '58%', ip: '203.0.113.13', latency: '73ms', protocol: 'RADAR/UDP', risk: 'MED' },
]

export const signalMessages = signalRecords.map(record => record.message)

export const terminalHelp = [
  'help              显示公开命令',
  'whoami            显示访客与站点身份',
  'projects          展开作品节点卡片',
  'scan              执行一次动态伪扫描',
  'contact           解密联系通道',
  'trace             追踪节点到 VOID_CORE',
  'decrypt           启动乱码解密动画',
  'breach            触发红色警戒事件',
  'root              尝试提升到 ROOT',
  'kill              关闭红色警戒',
  'core              强制核心过载',
  'void              触发异常扰动',
  'achievements      查看已解锁成就',
  'clear             清空终端缓冲区',
]
