import { useEffect, useRef, useState } from 'react';

import BgTetris from '@/assets/svg/bg-tetris.svg';
import { Button, Card, CardBody, CardHead, Icon, Text } from '@/components/ui/atoms';
import { Modal } from '@/components/ui/molecules';
import { TetrisLogo } from '@/components/svg';
import { useAnimationFrame, useInterval, useKeyDown } from '@/hooks';

const PIXEL_SIZE = 30;
const CANVAS_WIDTH = 16;
const CANVAS_HEIGHT = 24;

type IBoard = IPixel[][];

interface IPixel {
  value: 1 | 0;
  color: string;
}

enum ELevel {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
}

enum EPiece {
  O,
  I,
  T,
  L,
  J,
  S,
  Z,
}

enum EMove {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  DOWN = 'DOWN',
  ROTATE = 'ROTATE',
  CHANGE = 'CHANGE',
}

interface IPosition2D {
  x: number;
  y: number;
}

interface IGame {
  isRunning: boolean;
  isFinish: boolean;
  level: ELevel;
  score: number;
  lines: number;
}

interface IPiece {
  name: EPiece;
  color: string;
  shape: number[][];
}

const pieces: IPiece[] = [
  {
    name: EPiece.O,
    color: '#FAD601',
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  {
    name: EPiece.I,
    color: '#00E2E9',
    shape: [[1], [1], [1], [1]],
  },
  {
    name: EPiece.T,
    color: '#FE4CE7',
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
  },
  {
    name: EPiece.L,
    color: '#FF7901',
    shape: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
  },
  {
    name: EPiece.J,
    color: '#083BF7',
    shape: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
  },
  {
    name: EPiece.S,
    color: '#1FC500',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
  },
  {
    name: EPiece.Z,
    color: '#F22231',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
];

const levels: { [key in ELevel]: number } = {
  [ELevel.EASY]: 900,
  [ELevel.NORMAL]: 600,
  [ELevel.HARD]: 300,
};

const defaultGame: IGame = {
  level: ELevel.NORMAL,
  isRunning: false,
  isFinish: true,
  score: 0,
  lines: 0,
};

const createBoard = () => {
  const board: IBoard = Array.from({ length: CANVAS_HEIGHT }, () =>
    Array(CANVAS_WIDTH).fill({
      value: 0,
      color: 'black',
    }),
  );
  return board;
};

const App = () => {
  const $canvas = useRef<HTMLCanvasElement>(null);
  const board = useRef<IBoard>(createBoard());
  const piece = useRef<IPiece>(pieces[Math.floor(Math.random() * pieces.length)]);
  const piecePosition = useRef<IPosition2D>({ x: 0, y: 0 });
  const [game, setGame] = useState<IGame>(defaultGame);

  const handleChangeGame = (key: string, value: string | number | boolean) => {
    setGame((prev) => ({ ...prev, [key]: value }));
  };

  const drawPixel = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string = 'black',
  ) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    ctx.lineWidth = 10;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#020c20';
    ctx.strokeRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
  };

  const clearBoard = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH * PIXEL_SIZE, CANVAS_HEIGHT * PIXEL_SIZE);
  };

  const checkRows = () => {
    board.current.forEach((row, y) => {
      const isFull = row.every((col) => col.value === 1);
      if (isFull) {
        board.current.splice(y, 1);
        board.current.unshift(Array(CANVAS_WIDTH).fill({ value: 0, color: 'black' }));
      }
    });
  };

  const drawBoard = (ctx: CanvasRenderingContext2D) => {
    board.current.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col.value === 1) drawPixel(ctx, x, y, col.color);
        // else drawPixel(ctx, x, y, 'transparent');
      });
    });
  };

  const newPiece = () => {
    piece.current = pieces[Math.floor(Math.random() * pieces.length)];
    const x = Math.floor(CANVAS_WIDTH / 2) - 1;
    piecePosition.current = { x, y: -1 };
  };

  const drawPiece = (ctx: CanvasRenderingContext2D) => {
    piece.current.shape.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col === 1) {
          drawPixel(
            ctx,
            piecePosition.current.x + x,
            piecePosition.current.y + y,
            piece.current.color,
          );
        }
      });
    });
  };

  const render = () => {
    const ctx = $canvas.current?.getContext('2d');
    if (!ctx) return;

    clearBoard(ctx);
    drawBoard(ctx);
    drawPiece(ctx);
  };

  const validatePiece = (piece: IPiece, { x, y }: IPosition2D) => {
    const { shape } = piece;

    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        const boardY = y + i;
        const boardX = x + j;

        if (shape[i][j] === 1) {
          if (boardY >= CANVAS_HEIGHT) return false;
          if (boardX < 0 || boardX >= CANVAS_WIDTH) return false;
          if (board.current[boardY][boardX].value === 1) return false;
        }
      }
    }

    return true;
  };

  const movePiece = (move: EMove) => {
    const moves = {
      [EMove.LEFT]: (piece: IPiece, position: { x: number; y: number }) => {
        if (validatePiece(piece, { x: position.x - 1, y: position.y })) position.x--;
      },
      [EMove.RIGHT]: (piece: IPiece, position: { x: number; y: number }) => {
        if (validatePiece(piece, { x: position.x + 1, y: position.y })) position.x++;
      },
      [EMove.DOWN]: (piece: IPiece, position: { x: number; y: number }) => {
        if (validatePiece(piece, { x: position.x, y: position.y + 1 })) position.y++;
      },
      [EMove.ROTATE]: (piece: IPiece, position: { x: number; y: number }) => {
        const rotatedPiece = piece.shape[0].map((_, i) =>
          piece.shape.map((row) => row[i]).reverse(),
        );
        if (!validatePiece({ ...piece, shape: rotatedPiece }, position)) {
          position.x -= position.x + rotatedPiece[0].length - CANVAS_WIDTH;
        }
        piece.shape = rotatedPiece;
      },
      [EMove.CHANGE]: () => {
        piece.current = pieces[Math.floor(Math.random() * pieces.length)];
      },
    };
    moves[move](piece.current, piecePosition.current);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const moveMap: { [key: string]: EMove } = {
      ArrowLeft: EMove.LEFT,
      ArrowRight: EMove.RIGHT,
      ArrowDown: EMove.DOWN,
      ArrowUp: EMove.ROTATE,
      ' ': EMove.ROTATE,
    };

    const move = moveMap[e.key];
    if (move) movePiece(move);
  };

  const solidifyPiece = () => {
    piece.current?.shape?.forEach((row, y) => {
      row.forEach((col, x) => {
        const boardRow = board.current[piecePosition.current.y + y];
        if (col === 1 && boardRow?.[piecePosition.current.x + x]) {
          boardRow[piecePosition.current.x + x] = {
            value: 1,
            color: piece.current.color,
          };
        }
      });
    });
  };

  const validateGameOver = () => {
    return board.current[0].some((col) => col.value === 1);
  };

  const gameStep = () => {
    const isValid = validatePiece(piece.current, {
      x: piecePosition.current.x,
      y: piecePosition.current.y + 1,
    });

    if (isValid) {
      movePiece(EMove.DOWN);
    } else {
      solidifyPiece();
      checkRows();
      newPiece();
    }

    if (validateGameOver()) handleFinish();
  };

  useKeyDown(handleKeyDown);

  const [startAnimation, cancelAnimation] = useAnimationFrame(render);
  const [startInterval, cancelInterval] = useInterval(gameStep, levels[game.level]);

  const handleNewGame = () => {
    board.current = createBoard();
    newPiece();
    handleChangeGame('isRunning', true);
    handleChangeGame('isFinish', false);
  };

  const handleRestart = () => {
    handleChangeGame('isRunning', true);
  };

  const handlePause = () => {
    handleChangeGame('isRunning', !game.isRunning);
  };

  const handleFinish = () => {
    handleChangeGame('isRunning', false);
    handleChangeGame('isFinish', true);
  };

  useEffect(() => {
    if (game.isRunning) {
      startAnimation();
      startInterval();
    } else {
      cancelAnimation();
      cancelInterval();
    }
  }, [game.isRunning]);

  // useEffect(() => {
  //   startInterval();
  // }, [game.level]);

  return (
    <div className="min-h-dscreen grid items-center justify-center">
      <div className="relative p-16">
        <div className="absolute top-0 left-0 w-full p-20 flex justify-end">
          <Button icon ghost onClick={() => handlePause()}>
            <Icon>pause</Icon>
          </Button>
        </div>
        <canvas
          id="canvas"
          style={{
            background: `radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), url(${BgTetris})`,
            backgroundSize: `cover, ${PIXEL_SIZE * 2}px`,
          }}
          ref={$canvas}
          width={CANVAS_WIDTH * PIXEL_SIZE}
          height={CANVAS_HEIGHT * PIXEL_SIZE}
        />
      </div>
      <Modal value={!game.isRunning}>
        <Card bgColor="background-200" style={{ width: 400 }}>
          <CardHead className="text-center">
            <TetrisLogo />
          </CardHead>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-3 rounded-full overflow-hidden">
              <Button
                ghost={game.level !== ELevel.EASY}
                color={game.level === ELevel.EASY ? 'primary' : undefined}
                onClick={() => handleChangeGame('level', ELevel.EASY)}
              >
                <Text className={game.level === ELevel.EASY ? 'text-black' : undefined}>
                  easy
                </Text>
              </Button>
              <Button
                ghost={game.level !== ELevel.NORMAL}
                color={game.level === ELevel.NORMAL ? 'primary' : undefined}
                onClick={() => handleChangeGame('level', ELevel.NORMAL)}
              >
                <Text className={game.level === ELevel.NORMAL ? 'text-black' : undefined}>
                  normal
                </Text>
              </Button>
              <Button
                ghost={game.level !== ELevel.HARD}
                color={game.level === ELevel.HARD ? 'primary' : undefined}
                onClick={() => handleChangeGame('level', ELevel.HARD)}
              >
                <Text className={game.level === ELevel.HARD ? 'text-black' : undefined}>
                  Hard
                </Text>
              </Button>
            </div>
            {!game.isFinish ? (
              <Button ghost color="primary" onClick={() => handleRestart()}>
                <Text>Resume</Text>
              </Button>
            ) : null}
            <Button color="primary" onClick={() => handleNewGame()}>
              <Text className="text-black">New game</Text>
            </Button>
          </CardBody>
        </Card>
      </Modal>
    </div>
  );
};

export default App;