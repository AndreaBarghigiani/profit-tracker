// Components
// import Link from "next/link";

const Footer = () => {
  return (
    <footer className="container mx-auto mb-6 mt-10 flex max-w-4xl items-end justify-between">
      <p className="text-sm text-dog-400">
        © 2023 Underdog Tracker.
        <br />
        <span className="text-xs text-dog-600">
          Illustrations by{" "}
          <a target="_blank" href="https://storyset.com/people">
            Storyset
          </a>
        </span>
      </p>

      <p className="text-sm text-dog-400">
        <a href="mailto:andrea@cupofcraft.dev">Contact</a>
      </p>
    </footer>
  );
};

export default Footer;
