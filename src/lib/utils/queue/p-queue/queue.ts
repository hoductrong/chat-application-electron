import type { PriorityQueueOptions } from './priority-queue';

export type RunFunction = () => Promise<unknown>;

export type Queue<Element, Options> = {
  size: number;
  filter: (options: Readonly<Partial<Options>>) => Element[];
  dequeue: () => Element | undefined;
  enqueue: (run: Element, options?: Partial<Options>) => void;
  changePriority: (
    id: string | number,
    options: Partial<PriorityQueueOptions>,
  ) => void;
};
