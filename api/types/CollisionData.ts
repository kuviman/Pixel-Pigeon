import { EntityCollidable } from "./EntityCollidable";

export interface CollisionData<CollisionLayer extends string> {
  readonly entityCollidables: EntityCollidable<CollisionLayer>[];
  readonly map: boolean;
}