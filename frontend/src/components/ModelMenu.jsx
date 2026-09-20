import { Check } from "lucide-react";
export const MODEL_OPTIONS = [
    { id: "reasoning", label: "Reasoning" },
  { id: "coding", label: "Coding" },
  { id: "vision", label: "Vision" },
  { id: "fast", label: "Fast" },
];

export default function ModelMenu({ selectedModelId, onSelect }) {
  return (
    <div className="model-menu">
      {MODEL_OPTIONS.map((model) => (
        <button
          type="button"
          key={model.id}
          className={
            "model-menu__item" +
            (model.id === selectedModelId ? " model-menu__item--active" : "")
          }
          onClick={() => onSelect(model.id)}
        >
          <span>{model.label}</span>
          {model.id === selectedModelId && <Check size={14} />}
        </button>
      ))}
    </div>
  );
}
