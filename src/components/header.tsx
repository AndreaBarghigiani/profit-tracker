import { signIn, signOut, useSession } from "next-auth/react";

// Components
import { Button } from "./ui/button";

const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <header className="mx-auto mb-6 flex items-center py-4">
      <h1 className="text-xl font-extrabold tracking-tight">Profit Tracker</h1>

      <nav className="ml-auto flex gap-4">
        <Button
          variant={"active"}
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </Button>
      </nav>
    </header>
  );
};

export default Header;
