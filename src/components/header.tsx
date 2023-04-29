// Components
import Link from "next/link";

const Header = () => {
  return (
    <header className="container mx-auto mb-6 flex items-center">
      <h1 className="text-xl font-extrabold tracking-tight">Profit Tracker</h1>

      <nav className="ml-auto flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="project/add">Add Project</Link>
      </nav>
    </header>
  );
};

export default Header;
