import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function TreeView({
  tree,
  onTagSelect,
  selectedTags,
}: {
  tree: any;
  onTagSelect: (tag: string) => void;
  selectedTags: string[];
}) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {},
  );

  const toggleNode = (key: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderTree = (node: any, path = '') => {
    return Object.keys(node).map((key) => {
      const currentPath = path ? `${path}.${key}` : key;
      const hasChildren = Object.keys(node[key]).length > 0;
      const isExpanded = expandedNodes[currentPath];
      const isSelected = selectedTags.includes(currentPath);

      return (
        <div key={currentPath} className="ml-1">
          <div
            className="flex items-center gap-1"
            onClick={() => hasChildren && toggleNode(currentPath)}
          >
            {hasChildren ? (
              <button className="cursor-pointer">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-blue-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-blue-500" />
                )}
              </button>
            ) : (
              <span className="h-0 w-0" />
            )}
            <div
              className={`mt-1 rounded px-2 py-1 text-sm transition-all ${
                isSelected
                  ? 'bg-blue-50 font-bold text-sky-500'
                  : 'hover:bg-neutral-100'
              }`}
              onClick={() => !hasChildren && onTagSelect(currentPath)}
            >
              <p className="cursor-pointer break-all">{key}</p>
            </div>
          </div>
          {hasChildren && isExpanded && (
            <div className="ml-2 border-l pl-1">
              {renderTree(node[key], currentPath)}
            </div>
          )}
        </div>
      );
    });
  };

  return <div>{renderTree(tree)}</div>;
}
