import { Screens } from "./screens/Screens";

import { AuthProvider } from "./context/authentication";
export default function App() {
  return (
    <AuthProvider>
      <Screens />
    </AuthProvider>
  );
}
