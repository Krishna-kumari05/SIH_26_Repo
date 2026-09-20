import { useState } from "react";
import {
  Wrench,
  X,
  Sparkles,
  ChevronRight,
  Code2,
  Image as ImageIcon,
  FileText,
  Database,
  BookOpen,
  Calculator,
  FileSearch,
  ScanEye,
  Presentation,
  FileSpreadsheet,
  ClipboardList,
  Terminal,
  BarChart3,
  FunctionSquare,
  Cog,
  Zap,
  CircuitBoard,
  PlugZap,
  Ruler,
  PenTool,
  DatabaseZap,
  FileStack,
  LayoutTemplate,
  Building2,
} from "lucide-react";
import { useChat } from "../context/ChatContext";
const TOOL_OPTIONS = [
  { id: "document-analyser", label: "Document Analyser", icon: FileSearch },
  { id: "code-interpreter", label: "Code Interpreter", icon: Code2 },
  { id: "file-reader", label: "File Reader", icon: FileText },
  { id: "math-solver", label: "Math Solver", icon: Calculator },
  { id: "document-summarizer", label: "Document Summarizer", icon: BookOpen },
  { id: "image-analyser", label: "Image Analyser", icon: ScanEye },
  { id: "pdf-generator", label: "Pdf Generator", icon: FileText },
  { id: "ppt-generator", label: "Ppt Generator", icon: Presentation },
  { id: "docs-generator", label: "Docs Generator", icon: FileStack },
  { id: "excel-generator", label: "Excel Generator", icon: FileSpreadsheet },
  { id: "image-generator", label: "Image Generator", icon: ImageIcon },
  { id: "report-generator", label: "Report Generator", icon: ClipboardList },
  { id: "code-assistant", label: "Code Assistant", icon: Terminal },
  { id: "data-visualization", label: "Data Visualization", icon: BarChart3 },
  { id: "engineering-solver", label: "Engineering Solver", icon: FunctionSquare },
  { id: "machine-design", label: "Machine Design", icon: Cog },
  { id: "electrical-design", label: "Electrical Design", icon: Zap },
  { id: "pcb-analyzer", label: "PCB Analyzer", icon: CircuitBoard },
  { id: "power-system-analyzer", label: "Power System Analyzer", icon: PlugZap },
  { id: "cad-assistant", label: "CAD Assistant", icon: Ruler },
  { id: "data-extractor", label: "Data Extractor", icon: DatabaseZap },
  { id: "knowledge-base-search", label: "Knowledge Based Search", icon: Database },
  { id: "drawing-analyser-generator", label: "Drawing Analyser and Generator", icon: PenTool },
  { id: "blueprint-analyser-generator", label: "Blueprint Analyser and Generator", icon: LayoutTemplate },
  { id: "architecture-diagram-generator", label: "Architecture Diagram Generator", icon: Building2 },
];

export default function ToolsButton() {
  const [open, setOpen] = useState(false);
  const { enabledTools, toggleTool } = useChat();

  return (
    <>
      <button
        type="button"
        className="tools-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open tools"
      >
        <Wrench size={16} />
        Tools
      </button>

      {open && (
        <div className="search-modal__backdrop" onClick={() => setOpen(false)}>
          <div className="tools-panel" onClick={(e) => e.stopPropagation()}>
            <div className="tools-panel__header">
              <Sparkles size={18} className="tools-panel__header-icon" />
              <div>
                <div className="tools-panel__title">Tools</div>
                <div className="tools-panel__subtitle">
                  Choose a tool to add to your prompt
                </div>
              </div>
              <button
                className="icon-btn"
                onClick={() => setOpen(false)}
                aria-label="Close tools"
              >
                <X size={16} />
              </button>
            </div>

            <div className="tools-panel__list">
              {TOOL_OPTIONS.map(({ id, label, icon: Icon }) => {
                const isEnabled = enabledTools.includes(id);
                return (
                  <button
                    key={id}
                    className={
                      "tools-panel__item" + (isEnabled ? " tools-panel__item--active" : "")
                    }
                    onClick={() => toggleTool(id)}
                  >
                    <span className="tools-panel__icon-box">
                      <Icon size={16} />
                    </span>
                    <span className="tools-panel__label">{label}</span>
                    <ChevronRight size={16} className="tools-panel__chevron" />
                  </button>
                );
              })}
            </div>

            <button className="tools-panel__ok" onClick={() => setOpen(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
