export enum EDirection {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export type IBoard = IPixel[][];

export interface IPixel {
  value: 1 | 0;
  color: string;
}

export enum ELevel {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
}

export enum EPiece {
  O,
  I,
  T,
  L,
  J,
  S,
  Z,
}

export enum EMove {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  DOWN = 'DOWN',
  ROTATE = 'ROTATE',
  CHANGE = 'CHANGE',
}

export interface IPosition2D {
  x: number;
  y: number;
}

export interface IGame {
  isRunning: boolean;
  isFinish: boolean;
  sound: boolean;
  level: ELevel;
  score: number;
  lines: number;
}

export interface IPiece {
  name: EPiece;
  color: string;
  shape: number[][];
}
