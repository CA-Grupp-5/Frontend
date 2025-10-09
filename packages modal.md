## Packages Modal

### Overview
The packages modal presents grid, card, and list views for packages inside a shared, reanimated stack. Each view stays mounted while opacity and pointer events transition, eliminating costly unmount/remount cycles when switching layouts.

### Animation
- A shared value converts the selected mode into an index. `useAnimatedReaction` monitors that value and only unlocks pointer events after the fade settles, preventing accidental gestures on hidden lists.
- Each `FlatList` renders inside an absolutely positioned `Animated.View` with animated opacity. This keeps virtualization state alive across mode switches while preserving the existing styling for list rows, cards, and grid tiles.


