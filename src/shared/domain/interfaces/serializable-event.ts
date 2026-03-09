/**
 * Serialized event payload
 * Iterates over all the properties of the event payload and serializes them.
 * If a property has a toJSON method, it will infer the return type of the method.
 * @template T event data type
 */
export type SerializableEventPayload<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends { toJSON(): infer U }
        ? U
        : SerializableEventPayload<T[K]>;
    }
  : T;

/**
 * Serializable event that can be stored in the event store
 * @template T event data type
 */
export interface SerializableEvent<T = any> {
  streamId: string;
  type: string;
  position: number;
  data: SerializableEventPayload<T>;
}
