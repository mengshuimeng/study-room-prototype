import React, { useMemo, useState } from "react";

const seats = [
  { id: "A01", area: "安静区", floor: "1楼", status: "free" },
  { id: "A02", area: "安静区", floor: "1楼", status: "reserved" },
  { id: "A03", area: "安静区", floor: "1楼", status: "occupied" },
  { id: "A04", area: "安静区", floor: "1楼", status: "free" },
  { id: "B01", area: "讨论区", floor: "2楼", status: "occupied" },
  { id: "B02", area: "讨论区", floor: "2楼", status: "free" },
  { id: "B03", area: "讨论区", floor: "2楼", status: "reserved" },
  { id: "B04", area: "讨论区", floor: "2楼", status: "free" },
  { id: "C01", area: "考研区", floor: "3楼", status: "occupied" },
  { id: "C02", area: "考研区", floor: "3楼", status: "free" },
  { id: "C03", area: "考研区", floor: "3楼", status: "free" },
  { id: "C04", area: "考研区", floor: "3楼", status: "reserved" },
];

const violations = [
  { user: "20243001", seat: "A02", type: "预约超时未签到", time: "09:15", status: "待处理" },
  { user: "20243018", seat: "B03", type: "临时离开超时", time: "10:42", status: "待处理" },
  { user: "20243035", seat: "C04", type: "学生申诉中", time: "11:20", status: "异常处理" },
];

const pageBtnStyle = (active) => ({
  padding: "10px 16px",
  borderRadius: 12,
  border: active ? "1px solid #0f172a" : "1px solid #cbd5e1",
  background: active ? "#0f172a" : "#ffffff",
  color: active ? "#ffffff" : "#0f172a",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
});

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 20,
  padding: 20,
  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
};

const smallCardStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 16,
  background: "#ffffff",
};

function Tag({ text, bg, color }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 999,
        background: bg,
        color,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {text}
    </span>
  );
}

function SeatBlock({ seat, selected, onClick }) {
  const statusMap = {
    free: { label: "空闲", bg: "#dcfce7", color: "#166534" },
    reserved: { label: "已预约", bg: "#fef3c7", color: "#92400e" },
    occupied: { label: "使用中", bg: "#e2e8f0", color: "#334155" },
  };

  return (
    <button
      onClick={() => onClick(seat)}
      style={{
        textAlign: "left",
        borderRadius: 16,
        border: selected?.id === seat.id ? "2px solid #475569" : "1px solid #dbeafe",
        background: "#ffffff",
        padding: 14,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <strong>{seat.id}</strong>
        <Tag text={statusMap[seat.status].label} bg={statusMap[seat.status].bg} color={statusMap[seat.status].color} />
      </div>
      <div style={{ marginTop: 8, color: "#475569", fontSize: 14 }}>{seat.floor} · {seat.area}</div>
    </button>
  );
}

function SectionTitle({ title, desc }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>{title}</div>
      {desc ? <div style={{ marginTop: 6, color: "#475569", fontSize: 14 }}>{desc}</div> : null}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [keyword, setKeyword] = useState("");
  const [selectedSeat, setSelectedSeat] = useState(seats[1]);
  const [leaveEnabled, setLeaveEnabled] = useState(true);

  const filteredSeats = useMemo(() => {
    return seats.filter((s) => `${s.id}${s.area}${s.floor}`.includes(keyword));
  }, [keyword]);

  const stats = useMemo(() => {
    const free = seats.filter((s) => s.status === "free").length;
    const reserved = seats.filter((s) => s.status === "reserved").length;
    const occupied = seats.filter((s) => s.status === "occupied").length;
    return { free, reserved, occupied, total: seats.length };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: 24,
        fontFamily: "Arial, PingFang SC, Microsoft YaHei, sans-serif",
        color: "#0f172a",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 32 }}>校园自习室预约系统 · 软件原型</h1>
            <p style={{ marginTop: 10, color: "#475569", lineHeight: 1.6 }}>
              纯 React 本地可运行版，用于展示情景剧中“软件原型法”：通过界面原型直观暴露需求规则、异常处理和管理细节。
            </p>
          </div>
          <div style={{ ...smallCardStyle, fontSize: 14, color: "#475569" }}>
            页面：首页 / 预约 / 签到 / 临时离开 / 管理后台
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20, marginBottom: 24 }}>
          <button style={pageBtnStyle(page === "home")} onClick={() => setPage("home")}>首页</button>
          <button style={pageBtnStyle(page === "reserve")} onClick={() => setPage("reserve")}>预约座位</button>
          <button style={pageBtnStyle(page === "checkin")} onClick={() => setPage("checkin")}>扫码签到</button>
          <button style={pageBtnStyle(page === "leave")} onClick={() => setPage("leave")}>临时离开</button>
          <button style={pageBtnStyle(page === "admin")} onClick={() => setPage("admin")}>管理后台</button>
        </div>

        {page === "home" && (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
            <div style={cardStyle}>
              <SectionTitle title="楼层与区域概览" desc="学生出发前即可查看剩余座位，减少白跑和盲目找位。" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                <div style={{ ...smallCardStyle, background: "#ecfdf5" }}>
                  <div style={{ color: "#475569", fontSize: 14 }}>空闲座位</div>
                  <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>{stats.free}</div>
                </div>
                <div style={{ ...smallCardStyle, background: "#fffbeb" }}>
                  <div style={{ color: "#475569", fontSize: 14 }}>已预约</div>
                  <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>{stats.reserved}</div>
                </div>
                <div style={{ ...smallCardStyle, background: "#f1f5f9" }}>
                  <div style={{ color: "#475569", fontSize: 14 }}>使用中</div>
                  <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>{stats.occupied}</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 18 }}>
                <div style={smallCardStyle}>
                  <strong>1楼 安静区</strong>
                  <div style={{ marginTop: 8, fontSize: 14, color: "#475569" }}>适合个人安静学习</div>
                  <div style={{ marginTop: 14, background: "#e2e8f0", borderRadius: 999, height: 8 }}>
                    <div style={{ width: "60%", height: 8, borderRadius: 999, background: "#0f172a" }} />
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>使用率 60%</div>
                </div>
                <div style={smallCardStyle}>
                  <strong>2楼 讨论区</strong>
                  <div style={{ marginTop: 8, fontSize: 14, color: "#475569" }}>适合讨论和小组作业</div>
                  <div style={{ marginTop: 14, background: "#e2e8f0", borderRadius: 999, height: 8 }}>
                    <div style={{ width: "75%", height: 8, borderRadius: 999, background: "#0f172a" }} />
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>使用率 75%</div>
                </div>
                <div style={smallCardStyle}>
                  <strong>3楼 考研区</strong>
                  <div style={{ marginTop: 8, fontSize: 14, color: "#475569" }}>优先保障安静环境</div>
                  <div style={{ marginTop: 14, background: "#e2e8f0", borderRadius: 999, height: 8 }}>
                    <div style={{ width: "68%", height: 8, borderRadius: 999, background: "#0f172a" }} />
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>使用率 68%</div>
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <SectionTitle title="学生端首页" desc="聚焦情景剧里的核心需求：看空位、按区域找位、快速进入预约。" />
              <div style={{ background: "#0f172a", color: "white", borderRadius: 18, padding: 18 }}>
                <div style={{ fontSize: 14, color: "#cbd5e1" }}>当前时段</div>
                <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>今天 14:00 - 18:00</div>
                <div style={{ marginTop: 10, fontSize: 14, color: "#cbd5e1" }}>目标：出发前就知道哪里有座位</div>
              </div>
              <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                <div style={smallCardStyle}>查看实时空位 <span style={{ float: "right", color: "#475569", fontSize: 12 }}>核心需求</span></div>
                <div style={smallCardStyle}>按楼层/区域筛选 <span style={{ float: "right", color: "#475569", fontSize: 12 }}>核心需求</span></div>
                <div style={smallCardStyle}>到馆扫码签到 <span style={{ float: "right", color: "#475569", fontSize: 12 }}>规则需求</span></div>
              </div>
              <button style={{ ...pageBtnStyle(true), width: "100%", marginTop: 16 }} onClick={() => setPage("reserve")}>进入座位预约</button>
            </div>
          </div>
        )}

        {page === "reserve" && (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
            <div style={cardStyle}>
              <SectionTitle title="座位选择与预约" desc="点击具体座位后进入预约确认，直观看到规则。" />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="搜索座位号 / 楼层 / 区域"
                  style={{
                    flex: 1,
                    minWidth: 240,
                    border: "1px solid #cbd5e1",
                    borderRadius: 12,
                    padding: "10px 12px",
                    fontSize: 14,
                  }}
                />
                <button style={pageBtnStyle(false)}>1楼</button>
                <button style={pageBtnStyle(false)}>安静区</button>
                <button style={pageBtnStyle(false)}>空闲优先</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {filteredSeats.map((seat) => (
                  <SeatBlock key={seat.id} seat={seat} selected={selectedSeat} onClick={setSelectedSeat} />
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <SectionTitle title="预约详情" desc="用原型直接暴露‘迟到多久算违约’这类容易遗漏的问题。" />
              <div style={smallCardStyle}>
                <div style={{ fontSize: 14, color: "#64748b" }}>当前选择</div>
                <div style={{ marginTop: 8, fontSize: 30, fontWeight: 700 }}>{selectedSeat?.id}</div>
                <div style={{ marginTop: 6, fontSize: 14, color: "#475569" }}>{selectedSeat?.floor} · {selectedSeat?.area}</div>
              </div>
              <div style={{ marginTop: 16, ...smallCardStyle, background: "#fffbeb" }}>
                预约成功后需在 <strong>15 分钟内签到</strong>，超时将自动取消。
              </div>
              <div style={{ marginTop: 16, lineHeight: 1.9, color: "#334155", fontSize: 14 }}>
                <div>预约时段：14:00 - 18:00</div>
                <div>签到截止：14:15</div>
                <div>连续违约 3 次将限制预约</div>
              </div>
              <button style={{ ...pageBtnStyle(true), width: "100%", marginTop: 16 }}>确认预约</button>
            </div>
          </div>
        )}

        {page === "checkin" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={cardStyle}>
              <SectionTitle title="到馆扫码签到" desc="签到成功后，座位状态从‘已预约’变为‘使用中’。" />
              <div
                style={{
                  height: 280,
                  borderRadius: 20,
                  border: "2px dashed #cbd5e1",
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  color: "#475569",
                }}
              >
                <div>
                  <div style={{ fontSize: 48 }}>▣</div>
                  <div style={{ fontWeight: 700, marginTop: 10 }}>请扫描座位二维码完成签到</div>
                  <div style={{ marginTop: 8, fontSize: 14 }}>签到后系统自动更新座位状态</div>
                </div>
              </div>
              <div style={{ marginTop: 16, ...smallCardStyle, background: "#f1f5f9", color: "#334155" }}>
                规则提醒：预约后 15 分钟内未签到，系统将自动释放座位。
              </div>
            </div>

            <div style={cardStyle}>
              <SectionTitle title="签到结果反馈" desc="让用户知道系统记录了什么，避免模糊反馈。" />
              <div style={{ ...smallCardStyle, background: "#ecfdf5", border: "1px solid #bbf7d0" }}>
                <div style={{ color: "#166534", fontWeight: 700 }}>签到成功</div>
                <div style={{ marginTop: 8, fontSize: 14, color: "#334155" }}>座位 A02 已签到，使用时间：14:02 - 18:00</div>
              </div>
              <div style={{ marginTop: 16, lineHeight: 1.9, fontSize: 14, color: "#334155" }}>
                <div>学生：20243018</div>
                <div>座位：A02</div>
                <div>当前位置：图书馆 1 楼闸机内</div>
                <div>状态变化：已预约 → 使用中</div>
              </div>
              <button style={{ ...pageBtnStyle(true), width: "100%", marginTop: 18 }} onClick={() => setPage("leave")}>进入临时离开页面</button>
            </div>
          </div>
        )}

        {page === "leave" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={cardStyle}>
              <SectionTitle title="临时离开" desc="解决学生‘正常离开会不会被误判’的关键争议。" />
              <div style={smallCardStyle}>
                <div style={{ fontSize: 14, color: "#64748b" }}>当前座位</div>
                <div style={{ marginTop: 8, fontSize: 30, fontWeight: 700 }}>A02</div>
                <div style={{ marginTop: 8, fontSize: 14, color: "#475569" }}>已学习 42 分钟，本次可申请保留 15 分钟。</div>
              </div>
              <div style={{ ...smallCardStyle, marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>启用临时离开</div>
                  <div style={{ marginTop: 6, fontSize: 14, color: "#475569" }}>离开期间保留座位，超时自动释放</div>
                </div>
                <button
                  onClick={() => setLeaveEnabled(!leaveEnabled)}
                  style={{
                    width: 62,
                    height: 34,
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    background: leaveEnabled ? "#0f172a" : "#cbd5e1",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 4,
                      left: leaveEnabled ? 32 : 4,
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "white",
                      transition: "all .2s ease",
                    }}
                  />
                </button>
              </div>
              <div style={{ marginTop: 16, ...smallCardStyle, background: "#fffbeb" }}>
                规则：每天最多可申请 2 次临时离开；单次不超过 15 分钟。
              </div>
              <button style={{ ...pageBtnStyle(true), width: "100%", marginTop: 16 }}>开始计时</button>
            </div>

            <div style={cardStyle}>
              <SectionTitle title="倒计时与风险提醒" desc="超时规则必须可视化，否则用户会质疑系统是否公平。" />
              <div style={{ background: "#0f172a", color: "white", borderRadius: 22, padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: 14, color: "#cbd5e1" }}>剩余保留时间</div>
                <div style={{ fontSize: 54, fontWeight: 700, marginTop: 10 }}>12:36</div>
                <div style={{ marginTop: 10, fontSize: 14, color: "#cbd5e1" }}>超时未返回将自动释放座位</div>
              </div>
              <div style={{ marginTop: 16, ...smallCardStyle, background: "#fef2f2", border: "1px solid #fecaca" }}>
                离开结束前 3 分钟发送提醒；超时后记录一次违规并释放座位。
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <button style={{ ...pageBtnStyle(false), flex: 1 }}>提前返回</button>
                <button style={{ ...pageBtnStyle(true), flex: 1 }} onClick={() => setPage("admin")}>查看管理端</button>
              </div>
            </div>
          </div>
        )}

        {page === "admin" && (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
            <div style={cardStyle}>
              <SectionTitle title="管理后台：违规记录与异常处理" desc="管理员必须能手动处理设备故障、误判申诉等特殊情况。" />
              <div style={{ display: "grid", gap: 12 }}>
                {violations.map((item, index) => (
                  <div key={index} style={{ ...smallCardStyle, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{item.type}</div>
                      <div style={{ marginTop: 6, fontSize: 14, color: "#475569" }}>学号 {item.user} · 座位 {item.seat} · 时间 {item.time}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: "#334155", padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: 999 }}>{item.status}</span>
                      <button style={pageBtnStyle(false)}>查看详情</button>
                      <button style={pageBtnStyle(true)}>手动处理</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gap: 20 }}>
              <div style={cardStyle}>
                <SectionTitle title="异常处理入口" desc="这是情景剧里新增的重要需求。" />
                <div style={{ display: "grid", gap: 10, fontSize: 14, color: "#334155" }}>
                  <div style={smallCardStyle}>设备故障导致无法签到</div>
                  <div style={smallCardStyle}>学生申诉：临时离开被误判</div>
                  <div style={smallCardStyle}>管理员手动释放异常座位</div>
                  <div style={smallCardStyle}>黑名单阈值调整</div>
                </div>
              </div>

              <div style={cardStyle}>
                <SectionTitle title="原型验证出的关键规则" />
                <div style={{ fontSize: 14, lineHeight: 1.9, color: "#334155" }}>
                  <div>1. 预约后 15 分钟内必须签到</div>
                  <div>2. 临时离开单次不超过 15 分钟</div>
                  <div>3. 管理员需具备异常人工处理入口</div>
                  <div>4. 违规记录需要可追溯</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 24, color: "#64748b", fontSize: 13, lineHeight: 1.8 }}>
          运行说明：这是单文件纯 React 原型版。
        </div>
      </div>
    </div>
  );
}
