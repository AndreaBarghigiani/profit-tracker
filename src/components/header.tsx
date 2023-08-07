import { signIn, signOut, useSession } from "next-auth/react";

// Components
import { Button } from "./ui/button";

const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <header className="mx-auto mb-6 flex items-center py-4">
      <div className="flex items-center gap-4">
        <svg
          className="h-8 w-8"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="fill-[#ffcd1a]"
            d="M120.337 227.029c0-12.454-10.111-22.564-22.564-22.564H47.564C35.11 204.465 25 214.575 25 227.029v49.874c0 12.453 10.11 22.563 22.564 22.563h50.209c12.453 0 22.564-10.11 22.564-22.563v-49.874Z"
          />
          <path
            className="fill-[#ffd84d]"
            d="M207.893 223.608v-56.651c0-31.311 26.062-56.733 58.162-56.733h83.858V61.187C349.913 41.215 333.29 25 312.815 25H180.837c-20.475 0-37.098 16.215-37.098 36.187v126.235c0 19.972 16.623 36.186 37.098 36.186h27.056Z"
          />
          <path
            className="fill-[#ffe380]"
            d="M228.812 257.477h81.814c32.101 0 58.162 25.422 58.162 56.733v53.999h59.431c25.819 0 46.781-20.446 46.781-45.631V175.466c0-25.185-20.962-45.632-46.781-45.632H275.593c-25.819 0-46.781 20.447-46.781 45.632v82.011Z"
          />
          <path
            className="fill-[#ffeeb3]"
            d="M350.923 326.819c0-28.677-23.282-51.959-51.959-51.959H196.709c-28.677 0-51.96 23.282-51.96 51.959v96.222c0 28.677 23.283 51.959 51.96 51.959h102.255c28.677 0 51.959-23.282 51.959-51.959v-96.222Z"
          />
        </svg>

        <h1 className="bg-gradient-to-r from-main-500 to-main-300 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
          Underdog Tracker
        </h1>
      </div>

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
