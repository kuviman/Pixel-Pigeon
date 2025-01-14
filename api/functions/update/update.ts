import { SpriteInstance } from "../../classes/SpriteInstance";
import { getDefinables } from "../getDefinables";
import { handleCaughtError } from "../handleCaughtError";
import { state } from "../../state";
import { updateInput } from "./updateInput";
import { updateLevel } from "./updateLevel";

export const update = (): void => {
  updateInput();
  if (!state.values.hasExecutedOnRunCallbacks) {
    for (const onRunCallback of state.values.onRunCallbacks) {
      try {
        onRunCallback();
      } catch (error: unknown) {
        handleCaughtError(error, "onRun");
      }
    }
    state.setValues({ hasExecutedOnRunCallbacks: true });
  }
  if (state.values.levelID !== null) {
    updateLevel();
  }
  for (const onTickCallback of state.values.onTickCallbacks) {
    try {
      onTickCallback();
    } catch (error: unknown) {
      handleCaughtError(error, "onTick");
    }
  }
  getDefinables(SpriteInstance).forEach(
    (spriteInstance: SpriteInstance): void => {
      spriteInstance.playAnimation();
      spriteInstance.drawAtCoordinates();
    },
  );
  if (
    state.values.pauseMenuCondition !== null &&
    state.values.pauseMenuCondition()
  ) {
    document.body.classList.add("pausable");
  } else {
    document.body.classList.remove("pausable");
  }
};
