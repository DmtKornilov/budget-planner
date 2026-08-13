import { ForbiddenError } from "../errors";

/**
 * req-23 / req-27: placeholder auth foundation.
 *
 * There is no real authentication provider in this process (see the
 * approved concept, [[prob-1/concept-1]] Constraints — "no real auth
 * provider wired up in this process"). This module stands in for a real
 * session/identity layer: a single hardcoded "current user" concept,
 * extended with a second fixed test-user id so cross-user isolation logic
 * (req-23, req-27) can actually be exercised in tests rather than merely
 * assumed. Replace with real session lookups when a real auth provider is
 * integrated.
 */

/** The default "logged in" user for this process — mirrors proc-1's hardcoded "dev-user". */
export const CURRENT_USER_ID = "dev-user";

/** A second fixed user id, used only to exercise cross-user isolation (req-23, req-27). */
export const OTHER_TEST_USER_ID = "test-user-b";

export { ForbiddenError };

/**
 * req-23 / req-27: throws if `ownerUserId` does not match `requestingUserId`,
 * i.e. a user is attempting to read or mutate another user's data.
 */
export function assertOwnership(ownerUserId: string, requestingUserId: string): void {
  if (ownerUserId !== requestingUserId) {
    throw new ForbiddenError();
  }
}
