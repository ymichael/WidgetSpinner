const { widget } = figma;
const {
  AutoLayout,
  Ellipse,
  Frame,
  Fragment,
  Image,
  Rectangle,
  SVG,
  Text,
  useEffect,
  useSyncedState,
  waitForTask,
} = widget;

import { randomInRange } from "./utils";
import { idxToSvgSrc, bottleSvg } from "./svgSrc";

function zeroTo(num: number): number[] {
  const ret: number[] = [];
  for (let i = 0; i < num; i++) {
    ret.push(i);
  }
  return ret;
}

// https://easings.net/#easeOutQuart
function easeFunction(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}

const WEDGE_WIDTH = 130;
const WEDGE_PADDING = 5;
const WEDGE_WIDTH_W_PADDING = WEDGE_WIDTH + 2 * WEDGE_PADDING;

const COLORS = [
  "#E05534",
  "#F3A848",
  "#F8CD51",
  "#50AA64",
  "#46A0BE",
  "#419AF7",
  "#8B54F6",
  "#EB45B8",
];

function Bottle({
  onSpin,
  rotation,
}: {
  onSpin: () => Promise<void>;
  rotation: number;
}) {
  const startX = -192 / 2;
  const startY = -192 / 2;

  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  let x = startX * cos - startY * sin;
  let y = startY * cos + startX * sin;

  x += 300 / 2;
  y += 300 / 2;

  return (
    <Frame width={300} height={300} overflow="visible">
      <AutoLayout
        width={192}
        height={192}
        x={x}
        y={y}
        rotation={rotation * -57.2958}
      >
        <SVG width={192} height={192} src={bottleSvg} />
      </AutoLayout>
      <Ellipse
        onClick={onSpin}
        x={{ type: "center", offset: 0 }}
        y={{ type: "center", offset: 0 }}
        fill="#FFF"
        width={60}
        height={60}
        effect={[
          {
            color: "#00000070",
            offset: {
              x: 0,
              y: 0,
            },
            blur: 10,
            spread: 5,
            type: "drop-shadow",
          },
        ]}
      />
      <Text
        fontFamily="Poppins"
        fontSize={18}
        fontWeight={900}
        onClick={onSpin}
        x={{ type: "center", offset: 0 }}
        y={{ type: "center", offset: 0 }}
      >
        Spin
      </Text>
    </Frame>
  );
}

function Wheel({
  onSpin,
  rotation,
}: {
  onSpin: () => Promise<void>;
  rotation: number;
}) {
  const numSegments = COLORS.length;
  rotation = rotation % (2 * Math.PI);

  const diameter = numSegments * 1.5 * WEDGE_WIDTH_W_PADDING;
  const innerRadiusPct = 0.25;
  const radius = diameter / 2;

  const pctOffset = 0.8;
  const xOffset = pctOffset * radius;
  const startX = xOffset;
  const startY = 0;
  const deltaAngle = (2 * Math.PI) / numSegments;

  return (
    <Frame width={diameter} height={diameter} overflow="visible">
      <Ellipse
        arcData={{
          startingAngle: 0,
          endingAngle: 2 * Math.PI,
          innerRadius: innerRadiusPct,
        }}
        stroke="#419AF7"
        strokeWidth={2}
        width={diameter}
        height={diameter}
      />
      {zeroTo(numSegments).map((idx) => {
        const startingAngle = rotation + idx * deltaAngle;
        const endingAngle = startingAngle + deltaAngle;
        return (
          <Ellipse
            key={idx}
            arcData={{
              startingAngle,
              endingAngle,
              innerRadius: innerRadiusPct,
            }}
            fill={COLORS[idx % COLORS.length]}
            width={diameter}
            height={diameter}
          />
        );
      })}
      {true &&
        zeroTo(numSegments).map((idx) => {
          const startingAngle = rotation + idx * deltaAngle;
          const endingAngle = startingAngle + deltaAngle;
          const middleAngle = startingAngle + 0.5 * deltaAngle;
          const cos = Math.cos(middleAngle);
          const sin = Math.sin(middleAngle);

          let x = startX * cos - startY * sin;
          let y = startY * cos + startX * sin;
          y += radius;
          x += radius;
          x -= WEDGE_WIDTH_W_PADDING / 2;
          y -= WEDGE_WIDTH_W_PADDING / 2;

          return (
            <Frame
              x={x}
              y={y}
              key={idx}
              width={WEDGE_WIDTH_W_PADDING}
              height={WEDGE_WIDTH_W_PADDING}
              overflow="visible"
            >
              <AutoLayout
                width={WEDGE_WIDTH}
                padding={WEDGE_PADDING}
                horizontalAlignItems="center"
                overflow="visible"
                x={{ type: "center", offset: 0 }}
                y={{ type: "center", offset: 0 }}
              >
                <SVG
                  width={WEDGE_WIDTH * 2}
                  height={WEDGE_WIDTH * 2}
                  src={idxToSvgSrc[idx]}
                  rotation={-90 + (startingAngle + 0.5 * deltaAngle) * -57.2958}
                />
              </AutoLayout>
            </Frame>
          );
        })}
      <Frame
        onClick={onSpin}
        cornerRadius={1000}
        x={{ type: "center", offset: 0 }}
        y={{ type: "center", offset: 0 }}
        fill="#FFF"
        width={innerRadiusPct * diameter}
        height={innerRadiusPct * diameter}
        effect={[
          {
            color: "#00000070",
            offset: {
              x: 0,
              y: 0,
            },
            blur: 10,
            spread: 5,
            type: "drop-shadow",
          },
        ]}
        overflow="visible"
      >
        <SVG
          width={100}
          height={80}
          x={{ type: "center", offset: 0 }}
          y={-62}
          src={`<svg width="119" height="77" viewBox="0 0 119 77" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M119 77C70.2 51.4 19.3333 66.3333 0 77L58 0L119 77Z" fill="white"/>
</svg>`}
        />
        <Text
          fontFamily="Poppins"
          fontSize={100}
          fontWeight={900}
          onClick={onSpin}
          x={{ type: "center", offset: 0 }}
          y={{ type: "center", offset: 0 }}
        >
          Spin
        </Text>
      </Frame>
    </Frame>
  );
}

function FaceWheel({
  faces,
  onSpin,
  rotation,
}: {
  faces: Pick<User, "photoUrl">[];
  onSpin: () => Promise<void>;
  rotation: number;
}) {
  const numSegments = faces.length;
  rotation = rotation % (2 * Math.PI);

  const diameter = Math.max(numSegments, 5) * 1.5 * WEDGE_WIDTH_W_PADDING;
  const radius = diameter / 2;
  const innerRadiusPct = numSegments > 5 ? 0.25 : 0.35;
  const pctOffset = numSegments > 5 ? 0.85 : 0.75;
  const xOffset = pctOffset * radius;
  const startX = xOffset;
  const startY = 0;
  const deltaAngle = (2 * Math.PI) / numSegments;

  return (
    <Frame width={diameter} height={diameter} overflow="visible">
      <Ellipse
        arcData={{
          startingAngle: 0,
          endingAngle: 2 * Math.PI,
          innerRadius: innerRadiusPct,
        }}
        stroke="#419AF7"
        strokeWidth={2}
        width={diameter}
        height={diameter}
      />
      {zeroTo(numSegments).map((idx) => {
        const startingAngle = rotation + idx * deltaAngle;
        const endingAngle = startingAngle + deltaAngle;
        return (
          <Ellipse
            key={idx}
            arcData={{
              startingAngle,
              endingAngle,
              innerRadius: innerRadiusPct,
            }}
            fill={COLORS[idx % COLORS.length]}
            width={diameter}
            height={diameter}
          />
        );
      })}
      {true &&
        zeroTo(numSegments).map((idx) => {
          const startingAngle = rotation + idx * deltaAngle;
          const endingAngle = startingAngle + deltaAngle;
          const middleAngle = startingAngle + 0.5 * deltaAngle;
          const cos = Math.cos(middleAngle);
          const sin = Math.sin(middleAngle);

          let x = startX * cos - startY * sin;
          let y = startY * cos + startX * sin;
          y += radius;
          x += radius;
          x -= WEDGE_WIDTH_W_PADDING / 2;
          y -= WEDGE_WIDTH_W_PADDING / 2;

          return (
            <Frame
              x={x}
              y={y}
              key={idx}
              width={WEDGE_WIDTH_W_PADDING}
              height={WEDGE_WIDTH_W_PADDING}
              overflow="visible"
            >
              <AutoLayout
                width={100}
                height={100}
                horizontalAlignItems="center"
                verticalAlignItems="center"
                overflow="visible"
                fill="#000"
                x={{ type: "center", offset: 0 }}
                y={{ type: "center", offset: 0 }}
              >
                <Image
                  cornerRadius={999}
                  width={WEDGE_WIDTH * 2}
                  height={WEDGE_WIDTH * 2}
                  stroke={"#FFF" /* COLORS[idx % COLORS.length] */}
                  strokeWidth={20}
                  src={faces[idx].photoUrl ?? ""}
                  rotation={-90 + (startingAngle + 0.5 * deltaAngle) * -57.2958}
                />
              </AutoLayout>
            </Frame>
          );
        })}
      <Frame
        onClick={onSpin}
        cornerRadius={1000}
        x={{ type: "center", offset: 0 }}
        y={{ type: "center", offset: 0 }}
        fill="#FFF"
        width={innerRadiusPct * diameter}
        height={innerRadiusPct * diameter}
        effect={[
          {
            color: "#00000070",
            offset: {
              x: 0,
              y: 0,
            },
            blur: 10,
            spread: 5,
            type: "drop-shadow",
          },
        ]}
        overflow="visible"
      >
        <SVG
          width={100}
          height={80}
          x={{ type: "center", offset: 0 }}
          y={-62}
          src={`<svg width="119" height="77" viewBox="0 0 119 77" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M119 77C70.2 51.4 19.3333 66.3333 0 77L58 0L119 77Z" fill="white"/>
</svg>`}
        />
        <Text
          fontFamily="Poppins"
          fontSize={100}
          fontWeight={900}
          onClick={onSpin}
          x={{ type: "center", offset: 0 }}
          y={{ type: "center", offset: 0 }}
        >
          Spin
        </Text>
      </Frame>
    </Frame>
  );
}

function Widget() {
  const [rotation, setRotation] = useSyncedState("rotation", 0);
  const [activeUsers, setActiveUsers] = useSyncedState(
    "activeUsers",
    () => figma.activeUsers
  );

  const onSpin = async (): Promise<void> => {
    return new Promise((resolve) => {
      const initialSpeed = randomInRange(1.5, 2.5);
      const loops = randomInRange(80, 110);
      let idx = 0;

      setInterval(() => {
        if (idx++ > loops) {
          resolve();
        } else {
          const incr = initialSpeed * (1 - easeFunction(idx / loops));
          if (incr < 0.01) {
            idx += loops;
          }
          setRotation((rotation) => rotation + incr);
        }
      }, 50);
    });
  };
  if (false) {
    return <Bottle onSpin={onSpin} rotation={rotation} />;
  }
  if (false) {
    return (
      <FaceWheel faces={activeUsers} onSpin={onSpin} rotation={rotation} />
    );
  }
  return <Wheel onSpin={onSpin} rotation={rotation} />;
}

widget.register(Widget);
