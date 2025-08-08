import {
  Handle,
  Position,
  BaseEdge,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react';

/** * Input node
 * @param param0
 * @returns
 */
export const InputNode = ({
  data,
  selected,
}: {
  data: any;
  selected: boolean;
}) => {
  return (
    <div
      className={`px-5 py-3  rounded-md bg-white
      ${selected ? 'border-sky-500 border-3' : 'border-neutral-400 border-2'}
    `}
    >
      <div>
        <div className="tag">
          <div className="flex items-center gap-4 pb-1">
            {[0, 1].map((_, index) => (
              <p
                key={index}
                className="bg-sky-500 text-white px-2 py-1 rounded-sm text-[10px] w-fit -mx-1"
              >
                {`Tag0${index + 1}`}
              </p>
            ))}
          </div>
        </div>
        <p className="font-bold text-neutral-600 text-[16px] text-start">
          {data.label}
        </p>
        <div className="border-b my-2"></div>
        <p className="text-[12px] text-neutral-500 w-[240px] text-start">
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
  return (
    <div
      className={`px-5 py-3  rounded-md bg-white
      ${selected ? 'border-sky-500 border-3' : 'border-neutral-400 border-2'}
    `}
    >
      <div>
        <div className="tag">
          <div className="flex items-center gap-4 pb-1">
            {[0, 1].map((_, index) => (
              <p
                key={index}
                className="bg-sky-500 text-white px-2 py-1 rounded-sm text-[10px] w-fit -mx-1"
              >
                {`Tag0${index + 1}`}
              </p>
            ))}
          </div>
        </div>
        <p className="font-bold text-neutral-600 text-[16px] text-start">
          {data.label}
        </p>
        <div className="border-b my-2"></div>
        <p className="text-[12px] text-neutral-500 w-[240px] text-start">
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
  return (
    <div
      className={`px-5 py-3  rounded-md bg-white
      ${selected ? 'border-sky-500 border-3' : 'border-neutral-400 border-2'}
    `}
    >
      <div>
        <div className="tag">
          <div className="flex items-center gap-4 pb-1">
            {[0, 1].map((_, index) => (
              <p
                key={index}
                className="bg-sky-500 text-white px-2 py-1 rounded-sm text-[10px] w-fit -mx-1"
              >
                {`Tag0${index + 1}`}
              </p>
            ))}
          </div>
        </div>
        <p className="font-bold text-neutral-600 text-[16px] text-start">
          {data.label}
        </p>
        <div className="border-b my-2"></div>
        <p className="text-[12px] text-neutral-500 w-[240px] text-start">
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
    <div className="px-4 py-2 shadow-md rounded-md bg-gray-100 border-2 border-gray-400">
      <div className="font-bold text-gray-800">{data.label}</div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-500"
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
      {...props}
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
