// Types
import type { Hodl, Token } from "@prisma/client";

type PositionsProps = (Hodl & { token: Token })[];

export const sortedPositions = (positions: PositionsProps): PositionsProps => {
  positions.sort(
    (a, b) => b.amount * b.token.latestPrice - a.amount * a.token.latestPrice
  );

  return positions;
};
