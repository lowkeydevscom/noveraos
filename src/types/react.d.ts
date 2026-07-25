import "react";

declare module "react" {
  export function useOptimistic<S, A>(
    passthrough: S,
    reducer: (state: S, action: A) => S
  ): [S, (action: A) => void];
}
