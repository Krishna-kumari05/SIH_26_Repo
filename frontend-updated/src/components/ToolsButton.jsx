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

/**
 * SCREAMING_SNAKE_CASE IDs match backend ToolTaskType constants exactly.
 * These are the values sent as `taskType` in chat/tool-run requests.
 */
const TOOL_OPTIONS = [
  { id: "DOCUMENT_ANALYSER",          label: "Document Analyser",             icon: FileSearch },
  { id: "CODE_INTERPRETER",           label: "Code Interpreter",              icon: Code2 },
  { id: "FILE_READER",                label: "File Reader",                   icon: FileText },
  { id: "MATH_SOLVER",                label: "Math Solver",                   icon: Calculator },
  { id: "DOCUMENT_SUMMARIZER",        label: "Document Summarizer",           icon: BookOpen },
  { id: "IMAGE_ANALYSER",             label: "Image Analyser",                icon: ScanEye },
  { id: "PDF_GENERATOR",              label: "Pdf Generator",                 icon: FileText },
  { id: "PPT_GENERATOR",              label: "Ppt Generator",                 icon: Presentation },
  { id: "DOCS_GENERATOR",             label: "Docs Generator",                icon: FileStack },
  { id: "EXCEL_GENERATOR",            label: "Excel Generator",               icon: FileSpreadsheet },
  { id: "IMAGE_GENERATOR",            label: "Image Generator",               icon: ImageIcon },
  { id: "CODE_ASSISTANT",             label: "Code Assistant",                icon: Terminal },
  { id: "DATA_VISUALIZATION",         label: "Data Visualization",            icon: BarChart3 },
  { id: "ENGINEERING_SOLVER",         label: "Engineering Solver",            icon: FunctionSquare },
  { id: "MACHINE_DESIGN",             label: "Machine Design",                icon: Cog },
  { id: "ELECTRICAL_DESIGN",          label: "Electrical Design",             icon: Zap },
  { id: "PCB_ANALYZER",               label: "PCB Analyzer",                  icon: CircuitBoard },
  { id: "POWER_SYSTEM_ANALYZER",      label: "Power System Analyzer",         icon: PlugZap },
  { id: "CAD_ASSISTANT",              label: "CAD Assistant",                 icon: Ruler },
  { id: "DATA_EXTRACTOR",             label: "Data Extractor",                icon: DatabaseZap },
  { id: "KNOWLEDGE_BASED_SEARCH",     label: "Knowledge Based Search",        icon: Database },
  { id: "DRAWING_ANALYSER_GENERATOR", label: "Drawing Analyser and Generator",icon: PenTool },
  { id: "BLUEPRINT_ANALYSER_GENERATOR",   label: "Blueprint Analyser and Generator",   icon: LayoutTemplate },
  { id: "ARCHITECTURE_DIAGRAM_GENERATOR", label: "Architecture Diagram Generator",     icon: Building2 },
];

export default function ToolsButton() {
  const [open, setOpen] = useState(false);
  const { activeTaskType, setActiveTaskType } = useChat();

  function handleToolSelect(toolId) {
    // Toggle off if already selected, otherwise select it
    setActiveTaskType((prev) => (prev === toolId ? null : toolId));
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className={"tools-trigger" + (activeTaskType ? " tools-trigger--active" : "")}
        onClick={() => setOpen(true)}
        aria-label="Open tools"
      >
        <Wrench size={16} />
        {activeTaskType
          ? TOOL_OPTIONS.find((t) => t.id === activeTaskType)?.label ?? "Tools"
          : "Tools"}
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
                const isSelected = activeTaskType === id;
                return (
                  <button
                    key={id}
                    className={
                      "tools-panel__item" + (isSelected ? " tools-panel__item--active" : "")
                    }
                    onClick={() => handleToolSelect(id)}
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

            {activeTaskType && (
              <button
                className="tools-panel__clear"
                onClick={() => { setActiveTaskType(null); setOpen(false); }}
              >
                Clear tool selection
              </button>
            )}

            <button className="tools-panel__ok" onClick={() => setOpen(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
