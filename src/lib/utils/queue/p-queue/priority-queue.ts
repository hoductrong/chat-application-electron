import { type Queue, type RunFunction } from './queue';
import lowerBound from './lower-bound';
import { type QueueAddOptions } from './options';
import { logger } from 'src/lib/logger';

export type PriorityQueueOptions = {
  priority?: number;
  id?: string | number;
} & QueueAddOptions;

type QueueElement = PriorityQueueOptions & { run: RunFunction };

export default class PriorityQueue
  implements Queue<RunFunction, PriorityQueueOptions>
{
  readonly #queue: Array<QueueElement> = [];

  enqueue(run: RunFunction, options?: Partial<PriorityQueueOptions>): void {
    options = {
      priority: 0,
      ...options,
    };

    const element = {
      priority: options.priority,
      run,
      id: options.id,
    };

    if (
      this.size &&
      this.#queue[this.size - 1]!.priority! >= options.priority!
    ) {
      this.#queue.push(element);
      return;
    }

    const index = lowerBound(
      this.#queue,
      element,
      (a: Readonly<PriorityQueueOptions>, b: Readonly<PriorityQueueOptions>) =>
        b.priority! - a.priority!,
    );
    this.#queue.splice(index, 0, element);
  }

  dequeue(): RunFunction | undefined {
    const item = this.#queue.shift();
    return item?.run;
  }

  changePriority(
    id: string | number,
    options: Partial<PriorityQueueOptions>,
  ): void {
    const index = this.#queue.findIndex(
      (element: Readonly<QueueElement>) => element.id === id,
    );
    if (index === -1) {
      logger.error(`Could not find element with id ${id}`);
      return;
    }

    const element = this.#queue[index];
    this.#queue.splice(index, 1);
    this.enqueue(element.run, {
      id: element.id,
      priority: options.priority,
    });
  }

  filter(options: Readonly<Partial<PriorityQueueOptions>>): RunFunction[] {
    return this.#queue
      .filter(
        (element: Readonly<PriorityQueueOptions>) =>
          element.priority === options.priority,
      )
      .map((element: Readonly<{ run: RunFunction }>) => element.run);
  }

  get size(): number {
    return this.#queue.length;
  }
}
