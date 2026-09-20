import { useEffect, useRef, useState } from "react";
import { ChevronDown, Info, Lock, Check , Bot,DatabasePlus } from "lucide-react";
import { GiCpu} from "react-icons/gi";
import { useChat } from "../context/ChatContext";
import { MODEL_OPTIONS } from "./ModelMenu";

const AVAILABLE_MODELS = [
  { label: "Reasoning", status: "Loaded" },
  { label: "Coding", status: "Available" },
  { label: "Vision", status: "Available" },
  { label: "Fast", status: "Available" },
];

export default function TopStatsBar() {
  const { selectedModelId, sidebarOpen } = useChat();
  const [open, setOpen] = useState(false);
  const barRef = useRef(null);

  const selectedModel =
    MODEL_OPTIONS.find((m) => m.id === selectedModelId) || MODEL_OPTIONS[0];
  const gpu = 0;
  const memory = 0;
  const vram = "0 / 0 GB";
  const cpu = 0;
  const context = "0 / 0";
  const tokensPerSec = 0;

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className={"top-stats" + (sidebarOpen ? " top-stats--shifted" : "")} ref={barRef}>
      <button
        type="button"
        className="top-stats__bar"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="top-stats__item">
          <GiCpu size={15} />
          GPU {gpu}%
        </span>
        <span className="top-stats__divider" />
        <span className="top-stats__item">
          <DatabasePlus size={15} />
          Memory {memory}%
        </span>
        <span className="top-stats__divider" />
        <span className="top-stats__item">
          <Bot size={15} />
          {selectedModel.label}
        </span>
        <ChevronDown
          size={14}
          className={"top-stats__chevron" + (open ? " top-stats__chevron--open" : "")}
        />
      </button>

      {open && (
        <div className="top-stats__panel">
          <div className="top-stats__section-label">System</div>
          <div className="top-stats__gauges">
            <GaugeCard title="GPU Usage" value={gpu} label="GPU" color="#3b9cff" />
            <div className="top-stats__gauge-divider" />
            <GaugeCard title="Memory (RAM)" value={memory} label="RAM" color="#a855f7" />
          </div>
          <div className="top-stats__model-row">
            <span>VRAM</span>
            <span>{vram}</span>
          </div>
          <div className="top-stats__model-row">
            <span>CPU</span>
            <span>{cpu}%</span>
          </div>

          <div className="top-stats__model-card">
            <div className="top-stats__model-header">
              <Bot size={16} />
              <span>Model</span>
            </div>
            <div className="top-stats__model-status">
              <span className="top-stats__status-dot" />
              Loaded
            </div>
            <div className="top-stats__model-row">
              <span>Model</span>
              <span>{selectedModel.label}</span>
            </div>
            <div className="top-stats__model-row">
              <span>Parameters</span>
              <span>-</span>
            </div>
            <div className="top-stats__model-row">
              <span>Quantization</span>
              <span>-</span>
            </div>
            <div className="top-stats__model-row">
              <span>Context</span>
              <span>{context}</span>
            </div>
            <div className="top-stats__model-row">
              <span>Tokens/sec</span>
              <span>{tokensPerSec}</span>
            </div>
            <div className="top-stats__model-row">
              <span>Status</span>
              <span className="top-stats__status-inline">
                <span className="top-stats__status-dot" />
                Loaded
              </span>
            </div>
            <div className="top-stats__model-row">
              <span>Selection</span>
              <span>Automatic Router</span>
            </div>
          </div>

         <div className="top-stats__model-card">
            <div className="top-stats__model-header">
              <span>Available Models</span>
            </div>
            {MODEL_OPTIONS.map((m) => (
              <div className="top-stats__model-row" key={m.id}>
                <span className="top-stats__status-inline">
                  <span
                    className={
                      "top-stats__status-dot" +
                      (m.id === selectedModelId ? "" : " top-stats__status-dot--hollow")
                    }
                  />
                  {m.label}
                </span>
                <span>{m.id === selectedModelId ? "Loaded" : "Available"}</span>
              </div>
            ))}
          </div>

          <div className="top-stats__model-card">
            <div className="top-stats__model-header">
              <span>Security</span>
            </div>
            <div className="top-stats__model-row">
              <span className="top-stats__status-inline">
                <Lock size={13} />
                Local execution
              </span>
              <Check size={14} />
            </div>
            <div className="top-stats__model-row">
              <span>External connections</span>
              <span>0</span>
            </div>
            <div className="top-stats__model-row">
              <span>Cloud inference</span>
              <span>0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function GaugeCard({ title, value, label, color }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const filled = (value / 100) * circumference;

  return (
    <div className="top-stats__gauge-card">
      <div className="top-stats__gauge-title">
        <span>{title}</span>
        <Info size={12} />
      </div>
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle
          cx="45"
          cy="45"
          r={radius}
          className="top-stats__ring-track"
        />
        <circle
          cx="45"
          cy="45"
          r={radius}
          stroke={color}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          transform="rotate(-90 45 45)"
        />
        <text x="45" y="42" textAnchor="middle" className="top-stats__ring-value">
          {value}%
        </text>
        <text x="45" y="58" textAnchor="middle" className="top-stats__ring-label">
          {label}
        </text>
      </svg>
      <div className="top-stats__gauge-range">0 / 100%</div>
    </div>
  );
}
