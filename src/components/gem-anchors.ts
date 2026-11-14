/**
 * The page elements the 3D gemstones travel between and are clicked through. Kept apart
 * from the scene so that code which only needs these names does not pull in the 3D engine.
 */

/** The area of the hero the stones float in. */
export const STAGE_SELECTOR = "[data-gem-stage]";

/** The slot the stone with this index lands in. */
export const slotSelector = (index: number) => `[data-gem-slot="${index}"]`;
