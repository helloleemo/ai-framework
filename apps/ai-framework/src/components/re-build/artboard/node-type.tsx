import { CheckIcon } from '@/components/icon/check-icon';
import { usePipeline } from '@/hooks/use-context-pipeline';
import {
  Handle,
  Position,
  BaseEdge,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react';
import { excludedLabels } from './right-panel/no-setting-excluded-label';
import { CloseIcon } from '@/components/icon/close-icon';

/** * Input node
 * @param param0
 * @returns
 */
export const InputNode = ({
  id,
  data,
  selected,
}: {
  id: string;
  data: any;
  selected: boolean;
}) => {
  const { getNodeCompleted, getNodeStatus, getNode } = usePipeline();
  const completed = getNodeCompleted(data.id);
  const status = getNodeStatus(data.id);

  const isExcluded = excludedLabels.some(
    (label) => getNode(data.id)?.label === label,
  );

  return (
    <div
      className={`rounded-md bg-white px-5 py-3 ${selected ? 'border-3 border-sky-500' : 'border-2 border-neutral-400'} `}
    >
      <div className="absolute top-5 right-5 z-50 rounded-full p-1 transition-colors hover:bg-neutral-100">
        <CloseIcon className="h-5 w-5 cursor-pointer text-neutral-500" />
      </div>
      <div>
        <div className="tag">
          <div className="flex items-center gap-4 pb-1">
            {[0, 1].map((_, index) => (
              <p
                key={index}
                className="-mx-1 w-fit rounded-sm bg-sky-500 px-2 py-1 text-[10px] text-white"
              >
                {`Tag0${index + 1}`}
              </p>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-start text-[16px] font-bold text-neutral-600">
            {data.name}
          </p>
          {isExcluded ? null : (
            <CheckIcon
              className={`h-5 w-5 ${completed ? 'text-sky-500' : 'text-neutral-200'} `}
            />
          )}
          <div
            className={`top-5 right-5 h-4 w-4 rounded-full ${
              status === 'success' ? 'bg-sky-500' : 'bg-neutral-200'
            }`}
          ></div>
        </div>
        <div className="my-2 border-b"></div>
        <p className="w-[240px] text-start text-[12px] text-neutral-500">
          {data.description ||
            'No Description Available. lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
        </p>
      </div>
      <Handle
        style={
          selected
            ? {
                backgroundColor: '#fff',
                width: '1rem',
                height: '1rem',
                position: 'absolute',
                right: '10px',
                border: '2px solid #38bdf8',
                borderRadius: '9999px',
              }
            : {
                backgroundColor: '#fff',
                position: 'absolute',
                right: '10px',
                width: '1rem',
                height: '1rem',
                border: '2px solid #aaa',
                borderRadius: '9999px',
              }
        }
        type="source"
        position={Position.Right}
      />
    </div>
  );
};

/**
 * Transform node
 * @param param0
 * @returns
 */
export const TransformNode = ({
  data,
  selected,
}: {
  data: any;
  selected: boolean;
}) => {
  const { getNodeCompleted, getNodeStatus, getNode } = usePipeline();
  const completed = getNodeCompleted(data.id);
  const status = getNodeStatus(data.id);
  const isExcluded = excludedLabels.some(
    (label) => getNode(data.id)?.label === label,
  );
  return (
    <div
      className={`rounded-md bg-white px-5 py-3 ${selected ? 'border-3 border-sky-500' : 'border-2 border-neutral-400'} `}
    >
      <div className="absolute top-3 right-3 z-50 rounded-full p-1 transition-colors hover:bg-neutral-100">
        <CloseIcon className="h-5 w-5 cursor-pointer text-neutral-500" />
      </div>

      <div>
        <div className="tag">
          <div className="flex items-center gap-4 pb-1">
            {[0, 1].map((_, index) => (
              <p
                key={index}
                className="-mx-1 w-fit rounded-sm bg-sky-500 px-2 py-1 text-[10px] text-white"
              >
                {`Tag0${index + 1}`}
              </p>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-start text-[16px] font-bold text-neutral-600">
            {data.name}
          </p>
          {isExcluded ? null : (
            <CheckIcon
              className={`h-5 w-5 ${completed ? 'text-sky-500' : 'text-neutral-200'} `}
            />
          )}
          <div
            className={`top-3 right-3 h-4 w-4 rounded-full ${
              status === 'success' ? 'bg-sky-500' : 'bg-neutral-200'
            }`}
          ></div>
        </div>
        <div className="my-2 border-b"></div>
        <p className="w-[240px] text-start text-[12px] text-neutral-500">
          {data.description ||
            'No Description Available. lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
        </p>
      </div>
      <Handle
        style={{
          backgroundColor: '#fff',
          width: '1rem',
          height: '1rem',
          borderRadius: '9999px',
          border: selected ? '2px solid #38bdf8' : '2px solid #aaa',
        }}
        type="target"
        position={Position.Left}
      />
      <Handle
        style={
          selected
            ? {
                backgroundColor: '#fff',
                width: '1rem',
                height: '1rem',
                border: '2px solid #38bdf8',
                borderRadius: '9999px',
              }
            : {
                backgroundColor: '#fff',
                width: '1rem',
                height: '1rem',
                border: '2px solid #aaa',
                borderRadius: '9999px',
              }
        }
        type="source"
        position={Position.Right}
      />
    </div>
  );
};

/** * Output node
 * @param param0
 * @returns
 */
export const OutputNode = ({
  data,
  selected,
}: {
  data: any;
  selected: boolean;
}) => {
  const { getNodeStatus, getNodeCompleted } = usePipeline();
  const status = getNodeStatus(data.id);
  const completed = getNodeCompleted(data.id);
  return (
    <div
      className={`rounded-md bg-white px-5 py-3 ${selected ? 'border-3 border-sky-500' : 'border-2 border-neutral-400'} `}
    >
      <div className="absolute top-5 right-5 z-50 rounded-full p-1 transition-colors hover:bg-neutral-100">
        <CloseIcon className="h-5 w-5 cursor-pointer text-neutral-500" />
      </div>

      <div>
        <div className="tag">
          <div className="flex items-center gap-4 pb-1">
            {[0, 1].map((_, index) => (
              <p
                key={index}
                className="-mx-1 w-fit rounded-sm bg-sky-500 px-2 py-1 text-[10px] text-white"
              >
                {`Tag0${index + 1}`}
              </p>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-start text-[16px] font-bold text-neutral-600">
            {data.name}
          </p>
          <CheckIcon
            className={`h-5 w-5 ${completed ? 'text-sky-500' : 'text-neutral-200'} `}
          />
          <div
            className={`top-5 right-5 h-4 w-4 rounded-full ${
              status === 'success' ? 'bg-sky-500' : 'bg-neutral-200'
            }`}
          ></div>
        </div>
        <div className="my-2 border-b"></div>
        <p className="w-[240px] text-start text-[12px] text-neutral-500">
          {data.description ||
            'No Description Available. lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
        </p>
      </div>
      <Handle
        style={{
          backgroundColor: '#fff',
          width: '1rem',
          height: '1rem',
          borderRadius: '9999px',
          border: selected ? '2px solid #38bdf8' : '2px solid #aaa',
          marginRight: '-12px',
          position: 'absolute',
          left: '10px',
        }}
        type="target"
        position={Position.Left}
      />
    </div>
  );
};

// default node
export const DefaultNode = ({ data }: { data: any }) => {
  return (
    <div className="rounded-md border-2 border-gray-400 bg-gray-100 px-4 py-2 shadow-md">
      <div className="font-bold text-gray-800">{data.name}</div>
      <Handle
        type="target"
        position={Position.Left}
        className="h-3 w-3 bg-gray-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="h-3 w-3 bg-gray-500"
      />
    </div>
  );
};

/**
 * Custom edge component
 */
export const edgeType = (props: EdgeProps) => {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    selected,
    id,
  } = props;
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      // {...props}
      id={id}
      path={edgePath}
      style={{
        stroke: selected ? '#38bdf8' : '#aaa',
        strokeWidth: 2,
        // strokeDasharray: '6 2',
        // opacity: 0.8,
      }}
    />
  );
};
