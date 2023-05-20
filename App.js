import { Screens } from "./screens/Screens";

import { AuthProvider } from "./context/authentication";
import { CartProvider } from "./context/cart";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Screens />
      </CartProvider>
    </AuthProvider>
  );
}
