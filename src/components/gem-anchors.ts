/**
 * The page elements the 3D gemstones travel between. Kept apart from the scene so that
 * code which only needs these names does not pull in the 3D engine.
 */

/** Number of stones, which is also the number of slots on the page. */
export const GEM_COUNT = 4;

/** The area of the hero the stones float in. */
export const STAGE_SELECTOR = "[data-gem-stage]";

/** The slot the stone with this index lands in. */
export const slotSelector = (index: number) => `[data-gem-slot="${index}"]`;
