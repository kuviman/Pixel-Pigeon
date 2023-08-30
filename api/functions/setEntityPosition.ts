import { CollisionData } from "../types/CollisionData";
import { EntityCollidable } from "../types/EntityCollidable";
import { EntityPosition } from "../types/EntityPosition";
import { Level } from "../types/World";
import { getRectangleCollisionData } from "./getRectangleCollisionData";
import { state } from "../state";

export interface SetEntityPositionOptions {
  readonly position: EntityPosition;
}
export const setEntityPosition = (
  entityID: string,
  options: SetEntityPositionOptions,
): void => {
  if (state.values.world === null) {
    throw new Error(
      `An attempt was made to set entity "${entityID}" position before world was loaded.`,
    );
  }
  if (state.values.levelID === null) {
    throw new Error(
      `An attempt was made to set entity "${entityID}" position with no active level.`,
    );
  }
  const level: Level | null =
    state.values.world.levels.get(state.values.levelID) ?? null;
  if (level === null) {
    throw new Error(
      `An attempt was made to set entity "${entityID}" position with a nonexistant active level.`,
    );
  }
  for (const layer of level.layers) {
    for (const [layerEntityID, entity] of layer.entities) {
      if (layerEntityID === entityID) {
        entity.position = options.position;
        const collisionData: CollisionData<string> = getRectangleCollisionData(
          {
            height: entity.height,
            width: entity.width,
            x: Math.floor(entity.position.x),
            y: Math.floor(entity.position.y),
          },
          entity.collidables.map(
            (entityCollidable: EntityCollidable<string>): string =>
              entityCollidable.collisionLayer,
          ),
        );
        if (collisionData.entityCollidables.length > 0 || collisionData.map) {
          entity.onCollision?.(collisionData);
        }
      }
    }
  }
};